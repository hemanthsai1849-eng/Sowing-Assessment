import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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

const FallowAnalysis: React.FC = () => {
  const fallowData = [
    { district: 'East Godavari', area: 450, percentage: 18 },
    { district: 'West Godavari', area: 380, percentage: 15 },
    { district: 'Krishna', area: 320, percentage: 12 },
    { district: 'Guntur', area: 560, percentage: 22 },
    { district: 'Prakasam', area: 290, percentage: 11 },
  ];

  const severityData = [
    { name: 'Critical (>2 years)', value: 35, fill: '#dc2626' },
    { name: 'High (1-2 years)', value: 45, fill: '#f97316' },
    { name: 'Moderate (6-12 mo)', value: 15, fill: '#eab308' },
    { name: 'New Fallow', value: 5, fill: '#fbbf24' },
  ];

  const fallowTrend = [
    { month: 'Jan', area: 1800, parcels: 320 },
    { month: 'Feb', area: 1750, parcels: 310 },
    { month: 'Mar', area: 1900, parcels: 340 },
    { month: 'Apr', area: 2050, parcels: 365 },
    { month: 'May', area: 2134, parcels: 385 },
  ];

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">🚨 Fallow Land Analysis</h1>
          <p className="text-gray-400">Identify and monitor fallow agricultural lands</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Total Fallow Area</p>
            <p className="text-3xl font-bold text-red-400">2,134 Ha</p>
            <p className="text-xs text-red-400 mt-1">↑ 12% from last month</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Fallow Parcels</p>
            <p className="text-3xl font-bold text-orange-400">385</p>
            <p className="text-xs text-gray-400 mt-1">Across 14 districts</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Avg Duration</p>
            <p className="text-3xl font-bold text-yellow-400">14 mo</p>
            <p className="text-xs text-gray-400 mt-1">Since last cultivation</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Critical Alert</p>
            <p className="text-3xl font-bold text-red-500">135</p>
            <p className="text-xs text-red-400 mt-1">Require immediate attention</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* District-wise Fallow */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4">Fallow Area by District</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={fallowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="district" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                <Bar dataKey="area" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Severity Distribution */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4">Fallow Severity Classification</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} (${value}%)`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fallow Trend */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-bold mb-4">Fallow Land Trend (5 Months)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={fallowTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
              <Legend />
              <Line type="monotone" dataKey="area" stroke="#ef4444" strokeWidth={2} />
              <Line type="monotone" dataKey="parcels" stroke="#f97316" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default FallowAnalysis;
