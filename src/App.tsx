import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { CFPForm } from './components/CFPForm';
import { Conferences } from './components/Conferences';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './components/Login';
import Signup from './components/Signup'; 


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {isAuthenticated && <Navigation />} 
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
            <Route path="/signup" element={<Signup />} />
            <Route 
              path="/" 
              element={isAuthenticated ? <Dashboard onLogout={() => setIsAuthenticated(false)} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/cfp" 
              element={isAuthenticated ? <CFPForm /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/conferences" 
              element={isAuthenticated ? <Conferences /> : <Navigate to="/login" />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
