import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RiverBasinIntelligence: React.FC = () => {
  const krishnaStats = {
    area: 8245,
    parcels: 756,
    irrigated: 85.5,
    avgNdvi: 0.62,
    commands: [
      { name: 'Nagarjuna Sagar Command', area: 4200, coverage: 92 },
      { name: 'Sri Ram Sagar Command', area: 2100, coverage: 78 },
      { name: 'Srisailam Command', area: 1945, coverage: 88 },
    ],
  };

  const godavariStats = {
    area: 6890,
    parcels: 634,
    irrigated: 78.2,
    avgNdvi: 0.58,
    commands: [
      { name: 'Godavari Barrage Command', area: 3500, coverage: 85 },
      { name: 'Polavaram Command', area: 2100, coverage: 72 },
      { name: 'Dowleswaram Command', area: 1290, coverage: 82 },
    ],
  };

  const irrigationTrend = [
    { month: 'Jan', krishna: 82, godavari: 75 },
    { month: 'Feb', krishna: 84, godavari: 76 },
    { month: 'Mar', krishna: 86, godavari: 78 },
    { month: 'Apr', krishna: 88, godavari: 80 },
    { month: 'May', krishna: 85.5, godavari: 78.2 },
  ];

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">🌊 River Basin Intelligence</h1>
          <p className="text-gray-400">Krishna and Godavari river basin agricultural analysis</p>
        </div>

        {/* Basin Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Krishna Basin */}
          <div className="bg-sky-950 border border-sky-700 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-4 h-4 bg-sky-500 rounded mr-2"></div>
              <h2 className="text-2xl font-bold">Krishna River Basin</h2>
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-300">Total Area</span>
                <span className="text-xl font-bold text-sky-400">{krishnaStats.area} Ha</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Parcels</span>
                <span className="text-xl font-bold text-sky-400">{krishnaStats.parcels}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Irrigation Coverage</span>
                <span className="text-xl font-bold text-sky-400">{krishnaStats.irrigated}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Avg NDVI</span>
                <span className="text-xl font-bold text-sky-400">{krishnaStats.avgNdvi}</span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Irrigation Commands</h3>
              <div className="space-y-2">
                {krishnaStats.commands.map((cmd, idx) => (
                  <div key={idx} className="bg-gray-800 p-2 rounded text-sm">
                    <div className="flex justify-between mb-1">
                      <span>{cmd.name}</span>
                      <span className="text-sky-400">{cmd.coverage}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-sky-500 h-2 rounded-full"
                        style={{ width: `${cmd.coverage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Godavari Basin */}
          <div className="bg-cyan-950 border border-cyan-700 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-4 h-4 bg-cyan-500 rounded mr-2"></div>
              <h2 className="text-2xl font-bold">Godavari River Basin</h2>
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-300">Total Area</span>
                <span className="text-xl font-bold text-cyan-400">{godavariStats.area} Ha</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Parcels</span>
                <span className="text-xl font-bold text-cyan-400">{godavariStats.parcels}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Irrigation Coverage</span>
                <span className="text-xl font-bold text-cyan-400">{godavariStats.irrigated}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Avg NDVI</span>
                <span className="text-xl font-bold text-cyan-400">{godavariStats.avgNdvi}</span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Irrigation Commands</h3>
              <div className="space-y-2">
                {godavariStats.commands.map((cmd, idx) => (
                  <div key={idx} className="bg-gray-800 p-2 rounded text-sm">
                    <div className="flex justify-between mb-1">
                      <span>{cmd.name}</span>
                      <span className="text-cyan-400">{cmd.coverage}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-cyan-500 h-2 rounded-full"
                        style={{ width: `${cmd.coverage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Irrigation Trend */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-bold mb-4">Irrigation Coverage Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={irrigationTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
              <Legend />
              <Line
                type="monotone"
                dataKey="krishna"
                stroke="#0ea5e9"
                strokeWidth={2}
                name="Krishna Basin"
              />
              <Line
                type="monotone"
                dataKey="godavari"
                stroke="#06b6d4"
                strokeWidth={2}
                name="Godavari Basin"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default RiverBasinIntelligence;
