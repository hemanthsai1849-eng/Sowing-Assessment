package com.ap.agri.cropmonitoring.modules.monitoring.services;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ap.agri.cropmonitoring.modules.monitoring.dtos.NDVIDataPoint;
import com.ap.agri.cropmonitoring.modules.monitoring.dtos.NDVITimeSeriesResponse;
import com.ap.agri.cropmonitoring.modules.monitoring.entities.NDVIRecord;
import com.ap.agri.cropmonitoring.modules.monitoring.repositories.NDVIRecordRepository;
import com.ap.agri.cropmonitoring.modules.parcel.entities.Parcel;
import com.ap.agri.cropmonitoring.modules.parcel.repositories.ParcelRepository;
import com.ap.agri.cropmonitoring.shared.exception.ResourceNotFoundException;

/**
 * Service for NDVI (Normalized Difference Vegetation Index) data analysis
 * Provides time-series data retrieval, statistics calculation, and trend analysis
 */
@Service
@Transactional(readOnly = true)
public class NDVIService {

    private static final Logger log = LoggerFactory.getLogger(NDVIService.class);
    private static final int DEFAULT_MONTHS_LOOKBACK = 6;

    private final NDVIRecordRepository ndviRecordRepository;
    private final ParcelRepository parcelRepository;

    public NDVIService(NDVIRecordRepository ndviRecordRepository,
                       ParcelRepository parcelRepository) {
        this.ndviRecordRepository = ndviRecordRepository;
        this.parcelRepository = parcelRepository;
    }

    /**
     * Get NDVI time-series data for a specific parcel with trend analysis
     * 
     * @param parcelId The ID of the parcel
     * @param startDate Start date for data retrieval (optional, defaults to 6 months ago)
     * @param endDate End date for data retrieval (optional, defaults to today)
     * @return NDVITimeSeriesResponse containing time-series data and statistics
     */
    public NDVITimeSeriesResponse getTimeSeriesData(Long parcelId, LocalDate startDate, LocalDate endDate) {
        log.debug("Fetching NDVI time-series for parcel ID: {}, from {} to {}", parcelId, startDate, endDate);

        // Verify parcel exists
        Parcel parcel = parcelRepository.findById(parcelId)
                .orElseThrow(() -> new ResourceNotFoundException("Parcel not found with ID: " + parcelId));

        // Set default date range if not provided (last 6 months)
        final LocalDate finalStartDate = startDate == null 
                ? LocalDate.now().minusMonths(DEFAULT_MONTHS_LOOKBACK) 
                : startDate;
        final LocalDate finalEndDate = endDate == null ? LocalDate.now() : endDate;

        // Fetch NDVI records for the parcel, sorted by date ascending
        List<NDVIRecord> ndviRecords = ndviRecordRepository
                .findByParcelIdOrderByProcessedAtDesc(parcelId);

        // Filter by date range and convert to data points
        List<NDVIDataPoint> dataPoints = ndviRecords.stream()
                .filter(r -> isWithinDateRange(r.getProcessedAt().toLocalDate(), finalStartDate, finalEndDate))
                .sorted(Comparator.comparing(r -> r.getProcessedAt().toLocalDate()))
                .map(this::convertToDataPoint)
                .collect(Collectors.toList());

        // Calculate statistics
        BigDecimal avgNdvi = calculateAverage(dataPoints);
        BigDecimal maxNdvi = calculateMax(dataPoints);
        BigDecimal minNdvi = calculateMin(dataPoints);

        // Calculate trend
        String trendDirection = "STABLE";
        BigDecimal trendPercentage = BigDecimal.ZERO;

        if (dataPoints.size() >= 2) {
            trendPercentage = calculateTrend(dataPoints);
            if (trendPercentage.compareTo(BigDecimal.valueOf(5)) > 0) {
                trendDirection = "UP";
            } else if (trendPercentage.compareTo(BigDecimal.valueOf(-5)) < 0) {
                trendDirection = "DOWN";
            }
        }

        // Get latest classification
        String latestClassification = dataPoints.isEmpty() ? "UNKNOWN" 
                : dataPoints.get(dataPoints.size() - 1).getClassification();

        log.info("Retrieved {} NDVI records for parcel {}, trend: {} ({}%)", 
                dataPoints.size(), parcelId, trendDirection, trendPercentage);

        return NDVITimeSeriesResponse.builder()
                .parcelId(parcelId)
                .parcelName(parcel.getSurveyNumber())
                .farmerName(parcel.getFarmerName())
                .data(dataPoints)
                .avgNdvi(avgNdvi)
                .maxNdvi(maxNdvi)
                .minNdvi(minNdvi)
                .trendDirection(trendDirection)
                .trendPercentage(trendPercentage)
                .dataPointCount(dataPoints.size())
                .latestClassification(latestClassification)
                .build();
    }

    /**
     * Get latest NDVI records for all parcels in a district
     * Used for heatmap generation
     * 
     * @param districtId The ID of the district
     * @param dateFilter Optional date to filter records (defaults to today)
     * @return List of NDVIRecords representing latest values
     */
    public List<NDVIRecord> getDistrictNDVIHeatmap(Long districtId, LocalDate dateFilter) {
        if (dateFilter == null) {
            dateFilter = LocalDate.now();
        }
        
        log.debug("Fetching NDVI heatmap for district {}, date: {}", districtId, dateFilter);
        
        // This will be implemented with a custom query in the repository
        // For now, return empty list
        return List.of();
    }

    /**
     * Convert NDVIRecord to NDVIDataPoint DTO
     */
    private NDVIDataPoint convertToDataPoint(NDVIRecord record) {
        return NDVIDataPoint.builder()
                .date(record.getProcessedAt().toLocalDate())
                .meanNdvi(record.getMeanNdvi())
                .maxNdvi(record.getMaxNdvi())
                .classification(record.getClassificationStatus())
                .observationId(record.getObservation() != null ? record.getObservation().getId() : null)
                .build();
    }

    /**
     * Calculate average NDVI value from data points
     */
    private BigDecimal calculateAverage(List<NDVIDataPoint> dataPoints) {
        if (dataPoints.isEmpty()) {
            return BigDecimal.ZERO;
        }
        
        BigDecimal sum = dataPoints.stream()
                .map(NDVIDataPoint::getMeanNdvi)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        return sum.divide(BigDecimal.valueOf(dataPoints.size()), 4, RoundingMode.HALF_UP);
    }

    /**
     * Calculate maximum NDVI value from data points
     */
    private BigDecimal calculateMax(List<NDVIDataPoint> dataPoints) {
        if (dataPoints.isEmpty()) {
            return BigDecimal.ZERO;
        }
        
        return dataPoints.stream()
                .map(NDVIDataPoint::getMeanNdvi)
                .max(BigDecimal::compareTo)
                .orElse(BigDecimal.ZERO);
    }

    /**
     * Calculate minimum NDVI value from data points
     */
    private BigDecimal calculateMin(List<NDVIDataPoint> dataPoints) {
        if (dataPoints.isEmpty()) {
            return BigDecimal.ZERO;
        }
        
        return dataPoints.stream()
                .map(NDVIDataPoint::getMeanNdvi)
                .min(BigDecimal::compareTo)
                .orElse(BigDecimal.ZERO);
    }

    /**
     * Calculate trend percentage comparing first half to second half of data
     * Positive = increasing trend (UP)
     * Negative = decreasing trend (DOWN)
     * Between -5 and +5 = STABLE
     */
    private BigDecimal calculateTrend(List<NDVIDataPoint> dataPoints) {
        if (dataPoints.size() < 2) {
            return BigDecimal.ZERO;
        }

        int midpoint = dataPoints.size() / 2;

        BigDecimal firstHalfAvg = dataPoints.stream()
                .limit(midpoint)
                .map(NDVIDataPoint::getMeanNdvi)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .divide(BigDecimal.valueOf(midpoint), 4, RoundingMode.HALF_UP);

        BigDecimal secondHalfAvg = dataPoints.stream()
                .skip(midpoint)
                .map(NDVIDataPoint::getMeanNdvi)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .divide(BigDecimal.valueOf(dataPoints.size() - midpoint), 4, RoundingMode.HALF_UP);

        // Avoid division by zero
        if (firstHalfAvg.equals(BigDecimal.ZERO)) {
            return BigDecimal.ZERO;
        }

        // Calculate percentage change
        return secondHalfAvg.subtract(firstHalfAvg)
                .divide(firstHalfAvg, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Check if a date falls within a range (inclusive)
     */
    private boolean isWithinDateRange(LocalDate date, LocalDate start, LocalDate end) {
        return !date.isBefore(start) && !date.isAfter(end);
    }
}
