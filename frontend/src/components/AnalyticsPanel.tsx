import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface AnalyticsPanelProps {
  className?: string;
}

const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ className = '' }) => {
  const cropData = [
    { name: 'Rice', area: 3200, parcels: 450 },
    { name: 'Cotton', area: 2100, parcels: 280 },
    { name: 'Sugarcane', area: 1500, parcels: 180 },
    { name: 'Maize', area: 1200, parcels: 160 },
    { name: 'Pulses', area: 800, parcels: 150 },
  ];

  const ndviTrend = [
    { week: 'W1', average: 0.35 },
    { week: 'W2', average: 0.42 },
    { week: 'W3', average: 0.48 },
    { week: 'W4', average: 0.55 },
    { week: 'W5', average: 0.62 },
  ];

  const basinStats = [
    { name: 'Krishna', value: 65 },
    { name: 'Godavari', value: 35 },
  ];

  const colors = ['#0ea5e9', '#06b6d4'];

  const statusData = [
    { name: 'Cropped', value: 56, fill: '#10b981' },
    { name: 'Likely Cropped', value: 28, fill: '#eab308' },
    { name: 'Fallow', value: 16, fill: '#ef4444' },
  ];

  return (
    <div className={`bg-gray-900 border-t border-gray-800 p-6 ${className}`}>
      <h2 className="text-xl font-bold mb-6">Analytics Dashboard</h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        {/* Stats Cards */}
        <div className="stat-card">
          <p className="text-gray-400 text-sm">Total Parcels</p>
          <p className="text-3xl font-bold text-blue-400">1,254</p>
          <p className="text-xs text-green-400 mt-1">↑ 12% from last season</p>
        </div>
        <div className="stat-card">
          <p className="text-gray-400 text-sm">Total Area</p>
          <p className="text-3xl font-bold text-green-400">10,590 Ha</p>
          <p className="text-xs text-gray-400 mt-1">Across 14 districts</p>
        </div>
        <div className="stat-card">
          <p className="text-gray-400 text-sm">Avg NDVI</p>
          <p className="text-3xl font-bold text-yellow-400">0.58</p>
          <p className="text-xs text-gray-400 mt-1">Moderate vegetation</p>
        </div>
        <div className="stat-card">
          <p className="text-gray-400 text-sm">Fallow Land</p>
          <p className="text-3xl font-bold text-red-400">2,134 Ha</p>
          <p className="text-xs text-red-400 mt-1">20% of total area</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crop Distribution */}
        <div className="stat-card">
          <h3 className="font-bold mb-4">Top Crops by Area</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={cropData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
              />
              <Bar dataKey="area" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* NDVI Trend */}
        <div className="stat-card">
          <h3 className="font-bold mb-4">NDVI Trend (5 Weeks)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={ndviTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="week" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
              />
              <Line type="monotone" dataKey="average" stroke="#eab308" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Crop Status Distribution */}
        <div className="stat-card">
          <h3 className="font-bold mb-4">Crop Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} (${value}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Basin Distribution */}
        <div className="stat-card">
          <h3 className="font-bold mb-4">Basin-wise Coverage</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={basinStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} (${value}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {colors.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;
