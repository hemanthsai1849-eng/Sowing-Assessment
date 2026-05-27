import React, { useState } from 'react';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('ap_admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (username && password) {
        // Store auth token in localStorage
        localStorage.setItem('authToken', 'demo-token-' + Date.now());
        localStorage.setItem('username', username);
        navigate('/');
      } else {
        setError('Please enter both username and password');
      }
      setLoading(false);
    }, 1000);
  };

  const demoCredentials = [
    { role: 'Admin', username: 'ap_admin', password: 'admin123' },
    { role: 'Officer', username: 'ap_officer', password: 'admin123' },
    { role: 'Analyst', username: 'ap_analyst', password: 'admin123' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-900 to-gray-950 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🌾 Sowing Assessment</h1>
          <p className="text-gray-400">Fallow Land Intelligence System</p>
          <p className="text-sm text-gray-500 mt-2">GIS Dashboard - Government of Andhra Pradesh</p>
        </div>

        {/* Login Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-2xl p-8 backdrop-blur-sm">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Error Alert */}
            {error && (
              <div className="bg-red-950 border border-red-700 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3
                  text-white placeholder-gray-500 focus:outline-none focus:border-blue-500
                  transition-colors"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pr-12
                    text-white placeholder-gray-500 focus:outline-none focus:border-blue-500
                    transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400
                    hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded" />
                <span className="text-sm text-gray-400">Remember me</span>
              </label>
              <a href="#" className="text-sm text-blue-400 hover:text-blue-300">
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700
                hover:to-blue-800 disabled:opacity-50 text-white font-semibold py-3 rounded-lg
                transition-all transform hover:shadow-lg"
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">Demo Credentials</span>
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="space-y-2">
            {demoCredentials.map((cred) => (
              <div
                key={cred.username}
                onClick={() => {
                  setUsername(cred.username);
                  setPassword(cred.password);
                }}
                className="bg-gray-800 border border-gray-700 rounded-lg p-3 cursor-pointer
                  hover:border-blue-500 hover:bg-gray-750 transition-all"
              >
                <p className="text-sm font-semibold text-white">{cred.role}</p>
                <p className="text-xs text-gray-400">{cred.username}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-400">
          <p>
            Demo System • Version 1.0.0
            <br />
            <a href="#" className="text-blue-400 hover:text-blue-300">
              Support
            </a>
            {' • '}
            <a href="#" className="text-blue-400 hover:text-blue-300">
              Documentation
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
