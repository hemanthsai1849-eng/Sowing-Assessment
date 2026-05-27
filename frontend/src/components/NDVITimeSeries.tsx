import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { api } from '../services/api';

interface NDVIDataPoint {
  date: string;
  meanNdvi: number;
  maxNdvi: number;
  classification: string;
  observationId?: number;
  color: string;
}

interface NDVITimeSeriesResponse {
  parcelId: number;
  parcelName: string;
  farmerName: string;
  data: NDVIDataPoint[];
  avgNdvi: number;
  maxNdvi: number;
  minNdvi: number;
  trendDirection: string;
  trendPercentage: number;
  dataPointCount: number;
  latestClassification: string;
}

interface ChartData {
  date: string;
  ndvi: number;
  classification: string;
}

const NDVITimeSeries: React.FC = () => {
  const [parcelId, setParcelId] = useState('');
  const [timeRange, setTimeRange] = useState<'1m' | '3m' | '6m' | '1y'>('3m');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<NDVITimeSeriesResponse | null>(null);

  // Convert time range string to months
  const getMonthsFromTimeRange = (range: '1m' | '3m' | '6m' | '1y'): number => {
    switch (range) {
      case '1m': return 1;
      case '3m': return 3;
      case '6m': return 6;
      case '1y': return 12;
      default: return 6;
    }
  };

  // Calculate date range for API request
  const getDateRange = (range: '1m' | '3m' | '6m' | '1y'): [string, string] => {
    const now = new Date();
    const endDate = now.toISOString().split('T')[0];
    
    const startDateObj = new Date(now);
    startDateObj.setMonth(startDateObj.getMonth() - getMonthsFromTimeRange(range));
    const startDate = startDateObj.toISOString().split('T')[0];
    
    return [startDate, endDate];
  };

  // Fetch NDVI time-series data from backend
  const fetchTimeSeriesData = async () => {
    if (!parcelId.trim()) {
      setError('Please enter a parcel ID');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const [startDate, endDate] = getDateRange(timeRange);
      const response = await api.get<any>(`/api/v1/ndvi/parcel/${parcelId}/timeseries`, {
        params: {
          startDate,
          endDate,
        },
      });

      if (response.data.success) {
        setTimeSeriesData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch NDVI data');
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Failed to fetch NDVI time-series data';
      setError(errorMessage);
      console.error('Error fetching NDVI data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleLoadData = () => {
    fetchTimeSeriesData();
  };

  // Convert backend data to chart format
  const getChartData = (): ChartData[] => {
    if (!timeSeriesData || !timeSeriesData.data) return [];
    
    return timeSeriesData.data.map((point) => ({
      date: point.date,
      ndvi: Number(point.meanNdvi),
      classification: point.classification,
    }));
  };

  const chartData = getChartData();

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
      <h2 className="text-xl font-bold mb-4">📊 NDVI Time-Series Analysis</h2>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Parcel ID</label>
          <input
            type="text"
            placeholder="Enter parcel ID"
            value={parcelId}
            onChange={(e) => setParcelId(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLoadData()}
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2
              focus:outline-none focus:border-blue-500 text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Time Range</label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2
              focus:outline-none focus:border-blue-500 text-white"
          >
            <option value="1m">Last Month</option>
            <option value="3m">Last 3 Months</option>
            <option value="6m">Last 6 Months</option>
            <option value="1y">Last Year</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={handleLoadData}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded
              font-medium transition-colors"
          >
            {loading ? 'Loading...' : 'Load Data'}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded text-red-200">
          {error}
        </div>
      )}

      {/* Statistics */}
      {timeSeriesData && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <div className="bg-gray-800 rounded p-3 border border-gray-700">
            <p className="text-xs text-gray-400">Current NDVI</p>
            <p className="text-lg font-bold text-blue-400">{Number(timeSeriesData.data[timeSeriesData.data.length - 1]?.meanNdvi || 0).toFixed(3)}</p>
          </div>
          <div className="bg-gray-800 rounded p-3 border border-gray-700">
            <p className="text-xs text-gray-400">Minimum</p>
            <p className="text-lg font-bold text-red-400">{Number(timeSeriesData.minNdvi).toFixed(3)}</p>
          </div>
          <div className="bg-gray-800 rounded p-3 border border-gray-700">
            <p className="text-xs text-gray-400">Maximum</p>
            <p className="text-lg font-bold text-green-400">{Number(timeSeriesData.maxNdvi).toFixed(3)}</p>
          </div>
          <div className="bg-gray-800 rounded p-3 border border-gray-700">
            <p className="text-xs text-gray-400">Average</p>
            <p className="text-lg font-bold text-yellow-400">{Number(timeSeriesData.avgNdvi).toFixed(3)}</p>
          </div>
          <div className="bg-gray-800 rounded p-3 border border-gray-700">
            <p className="text-xs text-gray-400">Trend</p>
            <p className={`text-sm font-bold mt-2 ${
              timeSeriesData.trendDirection === 'UP' ? 'text-green-400' : 
              timeSeriesData.trendDirection === 'DOWN' ? 'text-red-400' : 
              'text-yellow-400'
            }`}>
              {timeSeriesData.trendDirection === 'UP' ? '↑' : 
               timeSeriesData.trendDirection === 'DOWN' ? '↓' : '→'} {timeSeriesData.trendPercentage.toFixed(2)}%
            </p>
          </div>
        </div>
      )}

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="bg-gray-800 rounded p-4 border border-gray-700 mb-4">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" domain={[0, 1]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => value.toFixed(3)}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="ndvi"
                stroke="#eab308"
                strokeWidth={2}
                dot={{ fill: '#eab308', r: 4 }}
                name="NDVI Value"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Classification Timeline */}
      {timeSeriesData && timeSeriesData.data && timeSeriesData.data.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-semibold text-gray-300">Classification Timeline:</p>
          <div className="flex flex-wrap gap-2">
            {timeSeriesData.data.map((item, idx) => (
              <div key={idx} className="text-xs bg-gray-800 px-3 py-1 rounded border border-gray-700">
                <span className="text-gray-400">{item.date}</span>
                <span
                  className={`ml-2 font-bold ${
                    item.classification === 'CROPPED'
                      ? 'text-green-400'
                      : item.classification === 'LIKELY_CROPPED'
                        ? 'text-yellow-400'
                        : 'text-red-400'
                  }`}
                >
                  {item.classification}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Data Message */}
      {!timeSeriesData && !loading && (
        <div className="text-center text-gray-400 py-8">
          Enter a parcel ID and click "Load Data" to view NDVI time-series
        </div>
      )}
    </div>
  );
};

export default NDVITimeSeries;
