import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import MapContainer from '@/components/MapContainer';
import Sidebar from '@/components/Sidebar';
import AnalyticsPanel from '@/components/AnalyticsPanel';
import { setParcels } from '@/store/dataSlice';
import { parcelSampleData } from '@/data/parcels';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    // Load initial data
    dispatch(setParcels(parcelSampleData));
  }, [dispatch]);

  return (
    <div className="h-screen flex flex-col bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-3 shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            🌾 Sowing Assessment & Fallow Land Intelligence
          </h1>
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="hidden md:block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-semibold"
          >
            📊 {showAnalytics ? 'Hide' : 'Show'} Analytics
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onToggle={setSidebarOpen} />

        {/* Map Area */}
        <div className="flex-1 md:ml-64 flex flex-col">
          <MapContainer className="flex-1" />

          {/* Analytics Panel */}
          {showAnalytics && <AnalyticsPanel className="h-96 overflow-y-auto" />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
