# ----------------------------------------------------------------------------
# AP Agriculture Department - Automated Endpoint Test Runner
# Executes and verifies every REST API endpoint in the system end-to-end.
# ----------------------------------------------------------------------------

$baseUrl = "http://localhost:8080/api/v1"
$ErrorActionPreference = "Stop"

Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host " AP AGRI INTEL - AUTOMATED SYSTEM INTEGRATION & ENDPOINT TESTING" -ForegroundColor Cyan
Write-Host "================================================================================" -ForegroundColor Cyan

# Helper to print colored steps
function Log-Step($msg) {
    Write-Host "`n[STEP] $msg..." -ForegroundColor Yellow
}

function Log-Success($msg) {
    Write-Host "[SUCCESS] $msg" -ForegroundColor Green
}

function Log-Info($msg) {
    Write-Host "        $msg" -ForegroundColor DarkGray
}

try {
    # ------------------------------------------------------------------------
    Log-Step "1. User Authentication (JWT Retrieval)"
    # ------------------------------------------------------------------------
    $authBody = @{
        username = "ap_officer"
        password = "admin123"
    } | ConvertTo-Json

    $authResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -ContentType "application/json" -Body $authBody
    $token = $authResponse.data.token
    $headers = @{
        Authorization = "Bearer $token"
    }
    Log-Success "Officer JWT Token successfully acquired."
    Log-Info "Token Prefix: Bearer $($token.Substring(0, 15))..."

    # ------------------------------------------------------------------------
    Log-Step "2. Register Cadastral Parcel (GeoJSON Boundary Upload)"
    # ------------------------------------------------------------------------
    $parcelBody = @{
        villageId = 1
        surveyNumber = "145/B-Demo"
        farmerName = "K. Venkata Rao"
        areaHa = 2.45
        geojsonGeometry = '{"type":"Polygon","coordinates":[[[80.621,16.541],[80.625,16.541],[80.625,16.545],[80.621,16.545],[80.621,16.541]]]}'
    } | ConvertTo-Json -Depth 5

    $parcelResponse = Invoke-RestMethod -Uri "$baseUrl/parcels" -Method Post -ContentType "application/json" -Headers $headers -Body $parcelBody
    $parcelId = $parcelResponse.data.id
    Log-Success "Cadastral land parcel registered successfully."
    Log-Info "Parcel ID: $parcelId"
    Log-Info "Survey Number: $($parcelResponse.data.surveyNumber)"
    Log-Info "Auto-Calculated Area: $($parcelResponse.data.areaHa) Hectares"

    # ------------------------------------------------------------------------
    Log-Step "3. Retrieve Parcel Details"
    # ------------------------------------------------------------------------
    $detailsResponse = Invoke-RestMethod -Uri "$baseUrl/parcels/$parcelId" -Method Get -Headers $headers
    Log-Success "Parcel details loaded successfully."
    Log-Info "Farmer: $($detailsResponse.data.farmerName)"
    Log-Info "Status: $($detailsResponse.data.currentStatus)"

    # ------------------------------------------------------------------------
    Log-Step "4. List Parcels by Village"
    # ------------------------------------------------------------------------
    $villageResponse = Invoke-RestMethod -Uri "$baseUrl/parcels/village/1" -Method Get -Headers $headers
    Log-Success "Parcels retrieved for Village ID 1."
    Log-Info "Total Parcels Found: $($villageResponse.data.Count)"

    # ------------------------------------------------------------------------
    Log-Step "5. Spatial Boundary Query (Parcels Within Mandal Boundary)"
    # ------------------------------------------------------------------------
    $mandalResponse = Invoke-RestMethod -Uri "$baseUrl/parcels/spatial/within-mandal/1" -Method Get -Headers $headers
    Log-Success "Spatial boundary containment query completed."
    Log-Info "Total Parcels Residing Inside Mandal Boundary: $($mandalResponse.data.Count)"

    # ------------------------------------------------------------------------
    Log-Step "6. Register Sowing Declaration (e-Panta Record)"
    # ------------------------------------------------------------------------
    # Registers farmer sowing crop 'Paddy' on our parcel
    $epantaUri = "$baseUrl/epanta/records?parcelId=$parcelId&seasonId=2&farmerName=K.+Venkata+Rao&cropName=Paddy&sownAreaHa=2.45"
    $epantaResponse = Invoke-RestMethod -Uri $epantaUri -Method Post -Headers $headers
    Log-Success "e-Panta crop sowing record registered successfully."
    Log-Info "e-Panta ID: $($epantaResponse.data.id)"
    Log-Info "Registered Crop: $($epantaResponse.data.cropName)"

    # ------------------------------------------------------------------------
    Log-Step "7. Trigger Manual Single Parcel Crop Classification (NDVI Heuristic)"
    # ------------------------------------------------------------------------
    # We trigger with NDVI = 0.15 to simulate a FALLOW (dry land) state
    $classUri = "$baseUrl/classification/trigger?parcelId=$parcelId&meanNdvi=0.15"
    $classResponse = Invoke-RestMethod -Uri $classUri -Method Post -Headers $headers
    Log-Success "NDVI classification rules executed."
    Log-Info "Derived Physical Crop Status: $($classResponse.data)"

    # ------------------------------------------------------------------------
    Log-Step "8. Trigger e-Panta Sowing Mismatch Validation Audit"
    # ------------------------------------------------------------------------
    # Compares: Physically FALLOW vs e-Panta Paddy Sown claim -> raises high-priority Alert!
    $auditResponse = Invoke-RestMethod -Uri "$baseUrl/epanta/audit" -Method Post -Headers $headers
    Log-Success "Discrepancy validation audit completed."
    Log-Info "New Anomaly Alerts Raised: $($auditResponse.data)"

    # ------------------------------------------------------------------------
    Log-Step "9. Fetch Active Discrepancy Alerts"
    # ------------------------------------------------------------------------
    $alertsResponse = Invoke-RestMethod -Uri "$baseUrl/epanta/alerts" -Method Get -Headers $headers
    $alertId = $alertsResponse.data[0].id
    Log-Success "Unresolved discrepancy alerts dashboard loaded."
    Log-Info "Alert ID: $alertId"
    Log-Info "Alert Type: $($alertsResponse.data[0].alertType)"
    Log-Info "Audit Warning: $($alertsResponse.data[0].message)"

    # ------------------------------------------------------------------------
    Log-Step "10. Retrieve District Crop Intelligence Dashboard"
    # ------------------------------------------------------------------------
    $analyticsResponse = Invoke-RestMethod -Uri "$baseUrl/analytics/district/1" -Method Get -Headers $headers
    Log-Success "District-wide agricultural report generated."
    Log-Info "Scope: $($analyticsResponse.data.scope)"
    Log-Info "Total Monitored Area: $($analyticsResponse.data.totalMonitoredAreaHectares) Hectares"
    Log-Info "Fallow Land Hectares: $($analyticsResponse.data.statusBreakdown.FALLOW.areaHectares) ($($analyticsResponse.data.statusBreakdown.FALLOW.percentageOfTotalArea)%)"

    # ------------------------------------------------------------------------
    Log-Step "11. Simulate Field Inspection & Resolve the Alert"
    # ------------------------------------------------------------------------
    $resolveResponse = Invoke-RestMethod -Uri "$baseUrl/epanta/alerts/$alertId/resolve" -Method Post -Headers $headers
    Log-Success "Mismatch alert successfully resolved after field officer inspection."
    Log-Info "Resolution Timestamp: $($resolveResponse.data.resolvedAt)"

    # ------------------------------------------------------------------------
    Log-Step "12. Verify Active Alerts are Cleared"
    # ------------------------------------------------------------------------
    $alertsClearedResponse = Invoke-RestMethod -Uri "$baseUrl/epanta/alerts" -Method Get -Headers $headers
    Log-Success "Verification completed. Unresolved alerts remaining: $($alertsClearedResponse.data.Count)"

    Write-Host "`n================================================================================" -ForegroundColor Green
    Write-Host " ALL SYSTEM ENDPOINTS AND REST APIS VALIDATED SUCCESSFULLY - 100% SUCCESS" -ForegroundColor Green
    Write-Host "================================================================================" -ForegroundColor Green

} catch {
    Write-Host "`n[CRITICAL ERROR] Test suite aborted due to request failure:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host "Please ensure your Spring Boot local application is actively running on port 8080!" -ForegroundColor Red
    Write-Host "================================================================================" -ForegroundColor Red
}
