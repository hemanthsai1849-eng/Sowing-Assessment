import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleLayer } from '@/store/mapSlice';
import { Menu, X, Filter } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: (state: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const dispatch = useDispatch();
  const [districtFilter, setDistrictFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const districts = [
    'Andhra Pradesh',
    'Srikakulam',
    'Visakhapatnam',
    'Vizianagaram',
    'East Godavari',
    'West Godavari',
    'Krishna',
    'Guntur',
    'Prakasam',
    'Nellore',
  ];

  const statuses = ['CROPPED', 'LIKELY_CROPPED', 'FALLOW'];

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => onToggle(!isOpen)}
        className="fixed top-4 left-4 z-40 md:hidden bg-gray-800 p-2 rounded-lg hover:bg-gray-700"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-800 shadow-lg
          transform transition-transform duration-300 ease-in-out z-30
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="h-full overflow-y-auto p-4">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-xl font-bold text-white">
              🌾 Crop Sowing Assessment
            </h1>
            <p className="text-xs text-gray-400 mt-1">GIS Intelligence Dashboard</p>
          </div>

          {/* Filters */}
          <div className="space-y-6">
            {/* District Filter */}
            <div>
              <label className="flex items-center space-x-2 font-semibold text-sm mb-3">
                <Filter size={16} />
                District
              </label>
              <select
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm
                  focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="">All Districts</option>
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="font-semibold text-sm mb-3 block">Crop Status</label>
              <div className="space-y-2">
                {statuses.map((status) => (
                  <label key={status} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={statusFilter === status}
                      onChange={() => setStatusFilter(statusFilter === status ? '' : status)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm">{status}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gray-800 rounded-lg p-4 space-y-3 border border-gray-700">
              <h3 className="font-semibold text-sm mb-3">Quick Stats</h3>
              <div>
                <p className="text-xs text-gray-400">Total Parcels</p>
                <p className="text-xl font-bold text-blue-400">1,254</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Cropped Area</p>
                <p className="text-xl font-bold text-green-400">8,456 Ha</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Fallow Area</p>
                <p className="text-xl font-bold text-red-400">2,134 Ha</p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-2 pt-4 border-t border-gray-700">
              <a href="/analytics" className="block text-sm hover:text-blue-400 py-2">
                📊 Analytics Dashboard
              </a>
              <a href="/fallow-analysis" className="block text-sm hover:text-blue-400 py-2">
                🚨 Fallow Land Analysis
              </a>
              <a href="/epanta-comparison" className="block text-sm hover:text-blue-400 py-2">
                🔄 e-Panta Comparison
              </a>
              <a href="/river-basins" className="block text-sm hover:text-blue-400 py-2">
                🌊 River Basin Intelligence
              </a>
              <a href="/spatial-analysis" className="block text-sm hover:text-blue-400 py-2">
                🔍 Spatial Analysis
              </a>
              <a href="/settings" className="block text-sm hover:text-blue-400 py-2">
                ⚙️ Settings
              </a>
              <a href="/login" className="block text-sm hover:text-red-400 py-2" onClick={() => {
                localStorage.removeItem('authToken');
                localStorage.removeItem('username');
              }}>
                🚪 Logout
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => onToggle(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
