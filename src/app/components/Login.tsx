import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { BookOpen, ArrowRight } from "lucide-react";

export function Login() {
  const [prn, setPrn] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (prn && birthdate) {
      // Mock login - in a real app this would verify credentials
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-emerald-200/50 dark:bg-emerald-900/20 rounded-full blur-3xl opacity-60 mix-blend-multiply dark:mix-blend-screen animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-amber-200/50 dark:bg-amber-900/20 rounded-full blur-3xl opacity-60 mix-blend-multiply dark:mix-blend-screen animate-pulse delay-700" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl dark:shadow-black/50 border border-white/50 dark:border-stone-800 z-10"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-emerald-600 dark:bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200 dark:shadow-emerald-900/40 rotate-3 transition-transform hover:rotate-6">
            <BookOpen className="text-white w-8 h-8" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-stone-800 dark:text-stone-100 mb-2">Student Tracker</h1>
        <p className="text-center text-stone-500 dark:text-stone-400 mb-8 text-sm">Enter your details to access your dashboard</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1 ml-1 uppercase tracking-wider">PRN Number</label>
            <input
              type="text"
              value={prn}
              onChange={(e) => setPrn(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-900/50 outline-none transition-all text-stone-900 dark:text-stone-100 placeholder:text-stone-400"
              placeholder="e.g. 12345678"
              required
            />
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1 ml-1 uppercase tracking-wider">Birthdate</label>
            <input
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-900/50 outline-none transition-all text-stone-600 dark:text-stone-300"
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-semibold py-4 rounded-xl shadow-lg shadow-emerald-200 dark:shadow-emerald-900/40 flex items-center justify-center gap-2 transition-colors cursor-pointer group"
          >
            Login <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
