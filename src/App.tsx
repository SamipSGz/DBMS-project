import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { CFPForm } from './components/CFPForm';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/cfp" element={<CFPForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;