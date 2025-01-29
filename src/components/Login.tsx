import React, { useState } from 'react';
import { Mail, Lock, User, FileText} from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Author');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (email && password) {
      onLogin(); // Assuming this sets isAuthenticated to true

      // Redirect logic:
      const from = location.state?.from?.pathname || '/'; // Get redirect location from state or default to '/'
      navigate(from); 
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Panel */}
      <div className="w-1/2 bg-emerald-100 p-12 flex flex-col items-center justify-center relative">
        <div className="text-center mb-8">
          <div className="mb-6">
            <FileText size={120} className="text-emerald-600 mx-auto" />
          </div>
          <h1 className="text-3xl font-semibold text-emerald-800 mb-4">
            Call For Paper
          </h1>
          <p className="text-emerald-600 max-w-md">
            Submit your research papers and contribute to the academic community
          </p>
        </div>
        {/* Navigation dots */}
        <div className="absolute bottom-8 flex space-x-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <div className="w-2 h-2 rounded-full bg-emerald-300"></div>
          <div className="w-2 h-2 rounded-full bg-emerald-300"></div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-1/2 p-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <h2 className="text-2xl font-semibold text-gray-800 mb-8">
            Welcome to Call For Paper
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-600 text-sm mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-600 text-sm mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-600 text-sm mb-2">
                Role
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
                >
                  <option value="Author">Author</option>
                  <option value="Reviewer">Reviewer</option>
                  <option value="Editor">Editor</option>
                </select>
                <svg 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <a href="#" className="text-emerald-600 hover:text-emerald-700">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 text-white font-medium py-3 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Sign in
            </button>

            <div className="mt-6 text-center">
              <span className="text-gray-600 text-sm">
                New to Call For Paper?{' '}
                <Link to="/signup" className="text-emerald-600 hover:text-emerald-700">
                  Create Account
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}