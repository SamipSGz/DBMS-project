import React, { useState } from 'react';
import { Mail, Lock, User, FileText, Building, MonitorSmartphone} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
  const [name, setName] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [phone_num, setPhoneNum] = useState("");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, affiliation, phone_num, password }),
      });

      ////console.log("The sending body : ",JSON.stringify({ name, email, affiliation, phone_num, password }));
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setSuccess('User registered successfully');
      setTimeout(() => navigate('/login'), 2000); // Redirect after success
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-white"> 
      <div className="w-1/2 bg-emerald-100 p-12 flex flex-col items-center justify-center relative">
        <div className="text-center mb-8">
          <FileText size={120} className="text-emerald-600 mx-auto" />
          <h1 className="text-3xl font-semibold text-emerald-800 mb-4">Call For Paper</h1>
          <p className="text-emerald-600 max-w-md">Submit your research papers and contribute to the academic community</p>
        </div>
      </div>

      <div className="w-1/2 p-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">Create a New Account</h2>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {success && <p className="text-green-500 text-center">{success}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-600 text-sm mb-2">Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input type="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:ring-emerald-500" placeholder="Albert Einstein" required />
              </div>
            </div>

            <div>
              <label className="block text-gray-600 text-sm mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:ring-emerald-500" placeholder="Enter your email" required />
              </div>
            </div>

            <div>
              <label className="block text-gray-600 text-sm mb-2">Affiliation</label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input type="affiliation" value={affiliation} onChange={(e) => setAffiliation(e.target.value)} className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:ring-emerald-500" placeholder="Pulchowk Campus" required />
              </div>
            </div>
            
            <div>
              <label className="block text-gray-600 text-sm mb-2">Phone Number</label>
              <div className="relative">
                <MonitorSmartphone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input type="phone_num" value={phone_num} onChange={(e) => setPhoneNum(e.target.value)} className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:ring-emerald-500" placeholder="9810203040" required />
              </div>
            </div>
            
            <div>
              <label className="block text-gray-600 text-sm mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:ring-emerald-500" placeholder="Enter your password" required />
              </div>
            </div>

            <div>
              <label className="block text-gray-600 text-sm mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:ring-emerald-500" placeholder="Confirm your password" required />
              </div>
            </div>

            
            <button type="submit" className="w-full bg-emerald-600 text-white font-medium py-3 rounded-lg hover:bg-emerald-700 transition-colors">Sign Up</button>
            <div className="mt-6 text-center">
              <span className="text-gray-600 text-sm">Already have an account? <Link to="/login" className="text-emerald-600 hover:text-emerald-700">Log in</Link></span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
