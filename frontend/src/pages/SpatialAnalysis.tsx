import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/useAppRedux';
import {
  calculateDistance,
  findNearbyParcels,
  analyzeNDVIChange,
  clusterParcels,
  filterByNDVIRange,
  identifyAnomalies,
  calculateGroupStatistics,
  bufferPoint,
} from '@/utils/gisAnalysis';

const SpatialAnalysis: React.FC = () => {
  const { parcels } = useAppSelector((state) => state.data);
  const [analysisType, setAnalysisType] = useState<
    'proximity' | 'clustering' | 'ndvi-range' | 'anomalies' | 'buffer'
  >('proximity');
  const [selectedParcelId, setSelectedParcelId] = useState<string>('');
  const [radiusKm, setRadiusKm] = useState(5);
  const [ndviMin, setNdviMin] = useState(0.3);
  const [ndviMax, setNdviMax] = useState(0.8);
  const [results, setResults] = useState<any>(null);

  const selectedParcel = parcels.find((p) => p.id === selectedParcelId);

  const handleProximityAnalysis = () => {
    if (!selectedParcel) return;
    const result = findNearbyParcels(selectedParcel, parcels, radiusKm);
    const nearbyDetails = parcels
      .filter((p) => result.nearbyParcels.includes(p.id))
      .map((p) => ({
        ...p,
        distance: calculateDistance(
          selectedParcel.geometry.coordinates[0][0][1],
          selectedParcel.geometry.coordinates[0][0][0],
          p.geometry.coordinates[0][0][1],
          p.geometry.coordinates[0][0][0]
        ),
      }));
    setResults({
      type: 'proximity',
      parcelId: result.parcelId,
      nearbyCount: result.nearbyParcels.length,
      nearbyParcels: nearbyDetails.sort((a, b) => a.distance - b.distance),
    });
  };

  const handleClustering = () => {
    const clusters = clusterParcels(parcels, radiusKm);
    const clusterData = Array.from(clusters.entries()).map(([id, members]) => {
      const memberDetails = parcels.filter((p) => members.includes(p.id));
      const stats = calculateGroupStatistics(memberDetails);
      return {
        centerId: id,
        memberCount: members.length,
        members,
        statistics: stats,
      };
    });
    setResults({
      type: 'clustering',
      clusterCount: clusterData.length,
      clusters: clusterData,
    });
  };

  const handleNDVIRange = () => {
    const filtered = filterByNDVIRange(parcels, ndviMin, ndviMax);
    const stats = calculateGroupStatistics(filtered);
    setResults({
      type: 'ndvi-range',
      count: filtered.length,
      parcels: filtered,
      statistics: stats,
    });
  };

  const handleAnomalies = () => {
    const anomalies = identifyAnomalies(parcels, 1.5);
    const stats = calculateGroupStatistics(anomalies);
    setResults({
      type: 'anomalies',
      count: anomalies.length,
      parcels: anomalies,
      statistics: stats,
    });
  };

  const handleBuffer = () => {
    if (!selectedParcel) return;
    const [lon, lat] = selectedParcel.geometry.coordinates[0][0];
    const buffer = bufferPoint(lat, lon, radiusKm);
    setResults({
      type: 'buffer',
      parcelId: selectedParcelId,
      radius: radiusKm,
      buffer,
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-700 p-4">
        <h1 className="text-2xl font-bold">🔍 Spatial Analysis Tools</h1>
        <p className="text-gray-400">Advanced GIS analysis and proximity queries</p>
      </div>

      <div className="grid grid-cols-3 gap-4 p-6">
        {/* Control Panel */}
        <div className="col-span-1 space-y-4">
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
            <h2 className="text-lg font-semibold mb-4">Analysis Type</h2>
            <div className="space-y-2">
              {[
                { value: 'proximity', label: '📍 Proximity Analysis' },
                { value: 'clustering', label: '🔗 Parcel Clustering' },
                { value: 'ndvi-range', label: '📊 NDVI Range Filter' },
                { value: 'anomalies', label: '⚠️ NDVI Anomalies' },
                { value: 'buffer', label: '⭕ Buffer Zone' },
              ].map((option) => (
                <label key={option.value} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="analysis"
                    value={option.value}
                    checked={analysisType === option.value}
                    onChange={(e) =>
                      setAnalysisType(
                        e.target.value as
                          | 'proximity'
                          | 'clustering'
                          | 'ndvi-range'
                          | 'anomalies'
                          | 'buffer'
                      )
                    }
                    className="w-4 h-4"
                  />
                  <span className="ml-2">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Parameters */}
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
            <h2 className="text-lg font-semibold mb-4">Parameters</h2>

            {['proximity', 'clustering', 'buffer'].includes(analysisType) && (
              <div className="mb-4">
                <label className="block text-sm mb-2">Search Radius (km)</label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="0.5"
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="text-sm text-gray-400 mt-1">{radiusKm} km</div>
              </div>
            )}

            {['proximity', 'buffer'].includes(analysisType) && (
              <div className="mb-4">
                <label className="block text-sm mb-2">Select Reference Parcel</label>
                <select
                  value={selectedParcelId}
                  onChange={(e) => setSelectedParcelId(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm"
                >
                  <option value="">Choose a parcel...</option>
                  {parcels.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.surveyNumber} - {p.village}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {analysisType === 'ndvi-range' && (
              <>
                <div className="mb-4">
                  <label className="block text-sm mb-2">Min NDVI: {ndviMin.toFixed(2)}</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={ndviMin}
                    onChange={(e) => setNdviMin(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm mb-2">Max NDVI: {ndviMax.toFixed(2)}</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={ndviMax}
                    onChange={(e) => setNdviMax(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </>
            )}

            {/* Run Button */}
            <button
              onClick={() => {
                switch (analysisType) {
                  case 'proximity':
                    handleProximityAnalysis();
                    break;
                  case 'clustering':
                    handleClustering();
                    break;
                  case 'ndvi-range':
                    handleNDVIRange();
                    break;
                  case 'anomalies':
                    handleAnomalies();
                    break;
                  case 'buffer':
                    handleBuffer();
                    break;
                }
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 rounded px-4 py-2 mt-4 font-semibold"
            >
              Run Analysis
            </button>
          </div>

          {/* Statistics */}
          {results && results.statistics && (
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <h3 className="font-semibold mb-3">Group Statistics</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Parcel Count:</span>
                  <span>{results.statistics.count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Area:</span>
                  <span>{results.statistics.totalArea.toFixed(2)} Ha</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Avg NDVI:</span>
                  <span>{results.statistics.avgNDVI.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Cropped:</span>
                  <span>{results.statistics.croppedPercentage.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Fallow:</span>
                  <span>{results.statistics.fallowPercentage.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Panel */}
        <div className="col-span-2 bg-gray-900 rounded-lg p-4 border border-gray-700 max-h-screen overflow-y-auto">
          {results ? (
            <>
              <h2 className="text-lg font-semibold mb-4">Analysis Results</h2>

              {results.type === 'proximity' && (
                <div className="space-y-4">
                  <div className="bg-gray-800 rounded p-3">
                    <p className="text-sm">
                      <span className="text-gray-400">Reference Parcel:</span>{' '}
                      <span className="font-semibold">{results.parcelId}</span>
                    </p>
                    <p className="text-sm mt-1">
                      <span className="text-gray-400">Nearby Parcels Found:</span>{' '}
                      <span className="font-semibold">{results.nearbyCount}</span>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold">Nearby Parcels</h3>
                    {results.nearbyParcels.map((p: any) => (
                      <div key={p.id} className="bg-gray-800 rounded p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">{p.surveyNumber}</p>
                            <p className="text-sm text-gray-400">{p.village}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-blue-400 font-semibold">
                              {p.distance.toFixed(2)} km
                            </p>
                            <p className="text-sm text-gray-400">
                              Status: {p.currentStatus}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {results.type === 'clustering' && (
                <div className="space-y-3">
                  <p className="text-sm">
                    <span className="text-gray-400">Total Clusters:</span>{' '}
                    <span className="font-semibold">{results.clusterCount}</span>
                  </p>
                  {results.clusters.map((cluster: any, idx: number) => (
                    <div key={idx} className="bg-gray-800 rounded p-3">
                      <p className="font-semibold">Cluster {idx + 1}</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {cluster.memberCount} parcels
                      </p>
                      <div className="mt-2 text-xs space-y-1">
                        <p>
                          <span className="text-gray-400">Avg NDVI:</span>{' '}
                          {cluster.statistics.avgNDVI.toFixed(3)}
                        </p>
                        <p>
                          <span className="text-gray-400">Area:</span>{' '}
                          {cluster.statistics.totalArea.toFixed(2)} Ha
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {results.type === 'ndvi-range' && (
                <div className="space-y-3">
                  <p className="text-sm">
                    <span className="text-gray-400">Parcels in Range:</span>{' '}
                    <span className="font-semibold">{results.count}</span>
                  </p>
                  <div className="max-h-96 overflow-y-auto space-y-2">
                    {results.parcels.map((p: any) => (
                      <div key={p.id} className="bg-gray-800 rounded p-2 text-sm">
                        <div className="flex justify-between">
                          <span>{p.surveyNumber}</span>
                          <span className="text-green-400">{p.ndviValue.toFixed(3)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {results.type === 'anomalies' && (
                <div className="space-y-3">
                  <p className="text-sm">
                    <span className="text-gray-400">Anomalies Detected:</span>{' '}
                    <span className="font-semibold text-red-400">{results.count}</span>
                  </p>
                  <div className="max-h-96 overflow-y-auto space-y-2">
                    {results.parcels.map((p: any) => (
                      <div key={p.id} className="bg-gray-800 rounded p-2 text-sm border border-red-700">
                        <div className="flex justify-between">
                          <span>{p.surveyNumber}</span>
                          <span className="text-red-400">{p.ndviValue.toFixed(3)}</span>
                        </div>
                        <p className="text-xs text-gray-400">{p.village}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {results.type === 'buffer' && (
                <div className="space-y-3">
                  <div className="bg-gray-800 rounded p-3">
                    <p className="text-sm">
                      <span className="text-gray-400">Parcel:</span>{' '}
                      <span className="font-semibold">{results.parcelId}</span>
                    </p>
                    <p className="text-sm mt-1">
                      <span className="text-gray-400">Buffer Radius:</span>{' '}
                      <span className="font-semibold">{results.radius} km</span>
                    </p>
                  </div>
                  <div className="bg-blue-900 bg-opacity-30 border border-blue-600 rounded p-3">
                    <p className="text-xs font-mono whitespace-pre-wrap break-all">
                      {JSON.stringify(results.buffer.geometry, null, 2).substring(0, 500)}...
                    </p>
                  </div>
                  <p className="text-xs text-gray-400">
                    Buffer geometry can be exported as GeoJSON for map visualization
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-96 text-gray-500">
              <p>Select analysis type and run to see results</p>
            </div>
          )}
        </div>
      </div>

      {/* Analysis Guide Legend */}
      <div className="fixed bottom-4 left-4 bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg w-80 max-h-96 overflow-y-auto z-40">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <span>📋</span>
          <span>Analysis Guide</span>
        </h2>
        
        <div className="space-y-4 text-sm">
          {/* Proximity */}
          <div className="bg-gray-800 rounded p-3">
            <h3 className="font-semibold text-blue-400 mb-2">📍 Proximity</h3>
            <p className="text-gray-300 text-xs mb-2">
              Find all parcels within a specified distance radius
            </p>
            <div className="text-xs text-gray-400 space-y-1">
              <p>• Distance calculations</p>
              <p>• Bearing angles</p>
              <p>• Nearby parcel ranking</p>
            </div>
          </div>

          {/* Clustering */}
          <div className="bg-gray-800 rounded p-3">
            <h3 className="font-semibold text-green-400 mb-2">🔗 Clustering</h3>
            <p className="text-gray-300 text-xs mb-2">
              Automatically group spatially close parcels
            </p>
            <div className="text-xs text-gray-400 space-y-1">
              <p>• Spatial grouping</p>
              <p>• Cluster statistics</p>
              <p>• Group NDVI analysis</p>
            </div>
          </div>

          {/* NDVI Range */}
          <div className="bg-gray-800 rounded p-3">
            <h3 className="font-semibold text-yellow-400 mb-2">📊 NDVI Range</h3>
            <p className="text-gray-300 text-xs mb-2">
              Filter parcels by vegetation health values
            </p>
            <div className="text-xs text-gray-400 space-y-1">
              <p>• 0.7+: Healthy crops</p>
              <p>• 0.5-0.7: Good</p>
              <p>• 0.3-0.5: Stressed</p>
              <p>• &lt;0.3: Poor condition</p>
            </div>
          </div>

          {/* Anomalies */}
          <div className="bg-gray-800 rounded p-3">
            <h3 className="font-semibold text-red-400 mb-2">⚠️ Anomalies</h3>
            <p className="text-gray-300 text-xs mb-2">
              Detect parcels with unusual NDVI values
            </p>
            <div className="text-xs text-gray-400 space-y-1">
              <p>• Statistical outliers</p>
              <p>• Potential crop issues</p>
              <p>• Alert triggers</p>
            </div>
          </div>

          {/* Buffer */}
          <div className="bg-gray-800 rounded p-3">
            <h3 className="font-semibold text-purple-400 mb-2">⭕ Buffer Zone</h3>
            <p className="text-gray-300 text-xs mb-2">
              Create circular zones around parcels
            </p>
            <div className="text-xs text-gray-400 space-y-1">
              <p>• GeoJSON export</p>
              <p>• Map integration</p>
              <p>• Impact analysis</p>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-gray-800 rounded p-3 border border-yellow-600">
            <h3 className="font-semibold text-yellow-300 mb-2">💡 Tips</h3>
            <div className="text-xs text-gray-400 space-y-1">
              <p>• Adjust radius for different scales</p>
              <p>• Use NDVI range for crop assessment</p>
              <p>• Run multiple analyses for insights</p>
              <p>• Check statistics for detailed results</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpatialAnalysis;
