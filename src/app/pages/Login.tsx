import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { User, Calendar, ArrowRight, AlertCircle } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function Login() {
  const navigate = useNavigate();
  const { setSubjects } = useData();
  const [prn, setPrn] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (prn && birthdate) {
      setLoading(true);
      setError('');

      try {
        // API call to fetch marks/subjects data
        const response = await fetch(`/api/students/${prn}/marks`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch student data');
        }

        const data = await response.json();

        // Update subjects with fetched marks data
        // Assuming API returns data in format: { subjects: Subject[] }
        if (data.subjects && Array.isArray(data.subjects)) {
          setSubjects(data.subjects);
        }

        // Navigate to dashboard after successful data fetch
        navigate('/dashboard');
      } catch (err) {
        console.error('Error fetching marks:', err);
        setError('Failed to fetch student data. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 flex flex-col justify-center items-center p-6 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm bg-white rounded-3xl shadow-xl shadow-purple-100 p-8 border border-purple-50"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-purple-600">
            <User size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-500 text-sm mt-2">Enter your academic details to continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 ml-1">PRN Number</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300" size={20} />
              <input
                type="text"
                value={prn}
                onChange={(e) => setPrn(e.target.value)}
                placeholder="e.g. 12345678"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-200 focus:bg-white transition-all outline-none text-gray-800 placeholder-gray-400"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 ml-1">Birthdate</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300" size={20} />
              <input
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-200 focus:bg-white transition-all outline-none text-gray-800"
                required
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-semibold shadow-lg shadow-purple-200 flex items-center justify-center gap-2 transition-colors mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                Loading...
              </>
            ) : (
              <>
                Access Dashboard
                <ArrowRight size={20} />
              </>
            )}
          </motion.button>
        </form>
      </motion.div>

      <p className="mt-8 text-center text-sm text-gray-400">
        Academic Goal Tracker &copy; 2026
      </p>
    </div>
  );
}
