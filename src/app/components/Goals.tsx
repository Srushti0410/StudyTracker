import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Target, Trophy, ChevronRight, Calculator, RotateCcw } from "lucide-react";
import { useData, Subject } from "../context/DataContext";

export function Goals() {
  const { subjects, calculateCGPA } = useData();
  const [target, setTarget] = useState(9.0);
  
  // Local state for "What-If" scenarios
  const [simulatedSubjects, setSimulatedSubjects] = useState<Subject[]>(subjects);
  
  const currentCGPA = parseFloat(calculateCGPA(subjects));
  const predictedCGPA = parseFloat(calculateCGPA(simulatedSubjects));

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTarget(parseFloat(e.target.value));
  };

  const handleScoreChange = (id: number, newScore: number) => {
    setSimulatedSubjects(prev => prev.map(s => s.id === id ? { ...s, score: newScore } : s));
  };

  const resetSimulation = () => {
    setSimulatedSubjects(subjects);
  };

  const gap = (target - currentCGPA).toFixed(2);
  const isPositive = target > currentCGPA;

  return (
    <div className="p-6 bg-stone-50 dark:bg-stone-950 min-h-screen pb-24 transition-colors duration-300 md:p-12">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Target className="text-emerald-600 dark:text-emerald-400" /> Set Your Goals
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">Define your academic targets.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Target Setting */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-8 shadow-sm border border-stone-100 dark:border-stone-800 text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 dark:from-emerald-500 dark:to-emerald-700" />
              
              <h2 className="text-stone-500 dark:text-stone-400 font-medium mb-4 text-xs uppercase tracking-widest">Target CGPA</h2>
              <div className="text-7xl font-bold text-stone-900 dark:text-stone-100 mb-2 tracking-tighter">
                {target.toFixed(1)}
              </div>
              
              <div className="relative h-12 flex items-center justify-center mb-8 mt-6">
                <input 
                  type="range" 
                  min="5.0" 
                  max="10.0" 
                  step="0.1" 
                  value={target}
                  onChange={handleSliderChange}
                  className="w-full h-2 bg-stone-100 dark:bg-stone-800 rounded-lg appearance-none cursor-pointer accent-emerald-600 dark:accent-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-900/40"
                />
              </div>

              <div className="flex justify-between text-[10px] text-stone-400 dark:text-stone-500 font-bold uppercase px-2 tracking-widest">
                <span>Pass (5.0)</span>
                <span>Excellent (10.0)</span>
              </div>
            </div>

            {/* Gap Analysis */}
            <motion.div 
              layout
              className="bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl p-6 border border-emerald-100 dark:border-emerald-800/30 flex items-center justify-between"
            >
              <div>
                <p className="text-emerald-900 dark:text-emerald-100 font-semibold mb-1 text-sm uppercase tracking-wide">Gap to Bridge</p>
                <p className="text-emerald-600/80 dark:text-emerald-400/60 text-xs">Based on current {currentCGPA} CGPA</p>
              </div>
              <div className="text-right">
                <span className="text-4xl font-bold text-emerald-700 dark:text-emerald-400 block tracking-tighter">+{gap}</span>
                <span className="text-[10px] text-emerald-500/80 dark:text-emerald-500 font-bold uppercase tracking-widest">Points needed</span>
              </div>
            </motion.div>

            {/* Action Plan */}
            <div>
              <h3 className="font-bold text-stone-800 dark:text-stone-200 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                <Trophy className="w-4 h-4 text-amber-500" /> Recommended Actions
              </h3>
              
              <div className="space-y-3">
                <ActionItem 
                  title="Improve Internal Marks" 
                  desc="Focus on upcoming unit tests to boost internal score."
                  difficulty="High Impact"
                />
                <ActionItem 
                  title="Submit Assignments Early" 
                  desc="Late submissions reduce grade by 10%."
                  difficulty="Medium Impact"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Grade Predictor */}
          <div className="bg-stone-100 dark:bg-stone-900/50 rounded-3xl p-6 border border-stone-200 dark:border-stone-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Grade Predictor
              </h3>
              <button 
                onClick={resetSimulation}
                className="text-xs flex items-center gap-1 text-stone-500 hover:text-emerald-600 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 mb-6 shadow-sm border border-stone-100 dark:border-stone-800">
              <div className="flex justify-between items-end mb-2">
                <span className="text-stone-500 text-xs font-bold uppercase tracking-wider">Predicted CGPA</span>
                <span className={`text-3xl font-bold tracking-tighter ${predictedCGPA >= target ? 'text-emerald-600' : 'text-stone-800 dark:text-stone-200'}`}>
                  {predictedCGPA.toFixed(2)}
                </span>
              </div>
              <div className="w-full h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(predictedCGPA / 10) * 100}%` }}
                  className={`h-full rounded-full transition-colors ${predictedCGPA >= target ? 'bg-emerald-500' : 'bg-stone-400'}`}
                />
              </div>
              {predictedCGPA >= target && (
                <motion.p 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-xs text-emerald-600 font-bold mt-2"
                >
                  🎉 Target Achieved!
                </motion.p>
              )}
            </div>

            <p className="text-xs text-stone-500 dark:text-stone-400 mb-4 px-1">Adjust subject scores to see impact:</p>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
              {simulatedSubjects.map((subject) => (
                <div key={subject.id} className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-stone-700 dark:text-stone-300">{subject.name}</span>
                    <span className="text-sm font-bold text-emerald-600">{subject.score}</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="100"
                    value={subject.score}
                    onChange={(e) => handleScoreChange(subject.id, parseInt(e.target.value))}
                    className="w-full h-1.5 bg-stone-100 dark:bg-stone-800 rounded-lg appearance-none cursor-pointer accent-stone-600 dark:accent-stone-400"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionItem({ title, desc, difficulty }: any) {
  return (
    <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm flex items-center justify-between active:scale-[0.99] transition-all hover:border-stone-200 dark:hover:border-stone-700 group">
      <div className="max-w-[85%]">
        <h4 className="font-semibold text-stone-800 dark:text-stone-200 text-sm mb-1 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">{title}</h4>
        <p className="text-stone-400 dark:text-stone-500 text-xs leading-relaxed">{desc}</p>
      </div>
      <ChevronRight className="text-stone-300 dark:text-stone-600 w-5 h-5 group-hover:text-emerald-500 transition-colors" />
    </div>
  );
}
