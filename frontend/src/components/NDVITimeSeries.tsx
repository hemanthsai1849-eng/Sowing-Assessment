import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface NDVITimeSeriesData {
  date: string;
  ndvi: number;
  classification: string;
}

const NDVITimeSeries: React.FC = () => {
  const [parcelId, setParcelId] = useState('');
  const [timeRange, setTimeRange] = useState<'1m' | '3m' | '6m' | '1y'>('3m');
  const [loading, setLoading] = useState(false);

  // Sample time-series data
  const sampleData: NDVITimeSeriesData[] = [
    { date: '2026-01-15', ndvi: 0.15, classification: 'FALLOW' },
    { date: '2026-02-15', ndvi: 0.25, classification: 'FALLOW' },
    { date: '2026-03-15', ndvi: 0.35, classification: 'FALLOW' },
    { date: '2026-04-01', ndvi: 0.45, classification: 'LIKELY_CROPPED' },
    { date: '2026-04-15', ndvi: 0.55, classification: 'LIKELY_CROPPED' },
    { date: '2026-05-01', ndvi: 0.65, classification: 'CROPPED' },
    { date: '2026-05-15', ndvi: 0.72, classification: 'CROPPED' },
    { date: '2026-05-26', ndvi: 0.75, classification: 'CROPPED' },
  ];

  const getNDVIAnalysis = () => {
    if (!sampleData.length) return null;
    const values = sampleData.map((d) => d.ndvi);
    return {
      current: values[values.length - 1],
      min: Math.min(...values),
      max: Math.max(...values),
      avg: (values.reduce((a, b) => a + b, 0) / values.length).toFixed(3),
      trend:
        values[values.length - 1] - values[0] > 0
          ? '↑ Increasing (Vegetation improving)'
          : '↓ Decreasing (Vegetation declining)',
    };
  };

  const analysis = getNDVIAnalysis();

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
            onClick={() => setLoading(!loading)}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded
              font-medium transition-colors"
          >
            {loading ? 'Loading...' : 'Load Data'}
          </button>
        </div>
      </div>

      {/* Statistics */}
      {analysis && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <div className="bg-gray-800 rounded p-3 border border-gray-700">
            <p className="text-xs text-gray-400">Current NDVI</p>
            <p className="text-lg font-bold text-blue-400">{analysis.current.toFixed(3)}</p>
          </div>
          <div className="bg-gray-800 rounded p-3 border border-gray-700">
            <p className="text-xs text-gray-400">Minimum</p>
            <p className="text-lg font-bold text-red-400">{analysis.min.toFixed(3)}</p>
          </div>
          <div className="bg-gray-800 rounded p-3 border border-gray-700">
            <p className="text-xs text-gray-400">Maximum</p>
            <p className="text-lg font-bold text-green-400">{analysis.max.toFixed(3)}</p>
          </div>
          <div className="bg-gray-800 rounded p-3 border border-gray-700">
            <p className="text-xs text-gray-400">Average</p>
            <p className="text-lg font-bold text-yellow-400">{analysis.avg}</p>
          </div>
          <div className="bg-gray-800 rounded p-3 border border-gray-700">
            <p className="text-xs text-gray-400">Trend</p>
            <p className="text-xs font-bold text-green-400 mt-2">{analysis.trend}</p>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="bg-gray-800 rounded p-4 border border-gray-700">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={sampleData}>
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

      {/* Classification Legend */}
      <div className="mt-4 space-y-2">
        <p className="text-sm font-semibold text-gray-300">Classification Timeline:</p>
        <div className="flex flex-wrap gap-2">
          {sampleData.map((item, idx) => (
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
    </div>
  );
};

export default NDVITimeSeries;
