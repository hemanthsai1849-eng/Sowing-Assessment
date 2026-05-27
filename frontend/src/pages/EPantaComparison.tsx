import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const EPantaComparison: React.FC = () => {
  const comparisonData = [
    {
      district: 'East Godavari',
      registered: 450,
      verified: 398,
      mismatch: 52,
      percentage: 88.4,
    },
    {
      district: 'West Godavari',
      registered: 380,
      verified: 315,
      mismatch: 65,
      percentage: 82.9,
    },
    {
      district: 'Krishna',
      registered: 420,
      verified: 380,
      mismatch: 40,
      percentage: 90.5,
    },
    {
      district: 'Guntur',
      registered: 560,
      verified: 468,
      mismatch: 92,
      percentage: 83.6,
    },
  ];

  const mismatchReasons = [
    { reason: 'Fallow but registered', count: 148, percentage: 56 },
    { reason: 'Wrong crop type', count: 62, percentage: 24 },
    { reason: 'Area mismatch', count: 38, percentage: 14 },
    { reason: 'Farmer mismatch', count: 15, percentage: 6 },
  ];

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">🔄 e-Panta Verification</h1>
          <p className="text-gray-400">Compare satellite data with e-Panta registrations</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Registered Parcels</p>
            <p className="text-3xl font-bold text-blue-400">1,810</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Verified Parcels</p>
            <p className="text-3xl font-bold text-green-400">1,561</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Mismatches Detected</p>
            <p className="text-3xl font-bold text-red-400">249</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Verification Rate</p>
            <p className="text-3xl font-bold text-yellow-400">86.3%</p>
          </div>
        </div>

        {/* Comparison Chart */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">District-wise e-Panta Verification</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="district" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
              <Legend />
              <Bar dataKey="registered" fill="#3b82f6" name="Registered in e-Panta" />
              <Bar dataKey="verified" fill="#10b981" name="Verified via Satellite" />
              <Bar dataKey="mismatch" fill="#ef4444" name="Mismatches" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Mismatch Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4">Mismatch Reasons</h2>
            <div className="space-y-3">
              {mismatchReasons.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-gray-300">{item.reason}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-400">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4">Alerts & Recommendations</h2>
            <div className="space-y-3">
              <div className="bg-red-950 border border-red-700 rounded p-3">
                <p className="text-red-300 text-sm font-semibold">⚠️ Critical Anomalies: 52</p>
                <p className="text-xs text-red-400 mt-1">
                  Parcels registered as cropped but physically fallow
                </p>
              </div>
              <div className="bg-orange-950 border border-orange-700 rounded p-3">
                <p className="text-orange-300 text-sm font-semibold">🔍 Review Required: 38</p>
                <p className="text-xs text-orange-400 mt-1">Area or crop type mismatches</p>
              </div>
              <div className="bg-yellow-950 border border-yellow-700 rounded p-3">
                <p className="text-yellow-300 text-sm font-semibold">📋 Farmer Updates: 15</p>
                <p className="text-xs text-yellow-400 mt-1">Ownership or farming data updates needed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EPantaComparison;
