import React, { useState } from 'react';
import { Save, RotateCcw } from 'lucide-react';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    mapCenter: '16.5062, 80.6437',
    mapZoom: 7,
    theme: 'dark',
    language: 'en',
    autoRefresh: true,
    refreshInterval: 300,
    enableAlerts: true,
    enableNotifications: true,
    dataRetention: 90,
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value });
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    setSettings({
      mapCenter: '16.5062, 80.6437',
      mapZoom: 7,
      theme: 'dark',
      language: 'en',
      autoRefresh: true,
      refreshInterval: 300,
      enableAlerts: true,
      enableNotifications: true,
      dataRetention: 90,
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">⚙️ Settings</h1>
          <p className="text-gray-400">Configure application preferences</p>
        </div>

        {/* Success Alert */}
        {saved && (
          <div className="bg-green-950 border border-green-700 rounded-lg p-4 mb-6">
            <p className="text-green-200">✓ Settings saved successfully</p>
          </div>
        )}

        {/* Settings Form */}
        <div className="space-y-6">
          {/* Map Settings */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4">🗺️ Map Configuration</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Map Center (Lat, Lng)</label>
                <input
                  type="text"
                  value={settings.mapCenter}
                  onChange={(e) => handleChange('mapCenter', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2
                    focus:outline-none focus:border-blue-500 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Initial Zoom Level</label>
                <input
                  type="number"
                  min="1"
                  max="19"
                  value={settings.mapZoom}
                  onChange={(e) => handleChange('mapZoom', parseInt(e.target.value))}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2
                    focus:outline-none focus:border-blue-500 text-white"
                />
              </div>
            </div>
          </div>

          {/* UI Settings */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4">🎨 User Interface</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Theme</label>
                <select
                  value={settings.theme}
                  onChange={(e) => handleChange('theme', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2
                    focus:outline-none focus:border-blue-500 text-white"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="auto">Auto (System)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => handleChange('language', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2
                    focus:outline-none focus:border-blue-500 text-white"
                >
                  <option value="en">English</option>
                  <option value="te">Telugu</option>
                  <option value="hi">Hindi</option>
                </select>
              </div>
            </div>
          </div>

          {/* Data Settings */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4">📊 Data & Refresh</h2>
            <div className="space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoRefresh}
                  onChange={(e) => handleChange('autoRefresh', e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm font-medium">Enable Auto-Refresh</span>
              </label>
              {settings.autoRefresh && (
                <div>
                  <label className="block text-sm font-medium mb-2">Refresh Interval (seconds)</label>
                  <input
                    type="number"
                    min="10"
                    max="3600"
                    value={settings.refreshInterval}
                    onChange={(e) => handleChange('refreshInterval', parseInt(e.target.value))}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2
                      focus:outline-none focus:border-blue-500 text-white"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-2">Data Retention (days)</label>
                <input
                  type="number"
                  min="7"
                  max="365"
                  value={settings.dataRetention}
                  onChange={(e) => handleChange('dataRetention', parseInt(e.target.value))}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2
                    focus:outline-none focus:border-blue-500 text-white"
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4">🔔 Notifications</h2>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableAlerts}
                  onChange={(e) => handleChange('enableAlerts', e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm font-medium">Enable Alerts</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableNotifications}
                  onChange={(e) => handleChange('enableNotifications', e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm font-medium">Enable Browser Notifications</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3
                rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <Save size={20} />
              <span>Save Settings</span>
            </button>
            <button
              onClick={handleReset}
              className="flex-1 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white
                font-semibold py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <RotateCcw size={20} />
              <span>Reset to Defaults</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
