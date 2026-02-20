import { useState } from "react";
import { BookOpen, AlertCircle, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useData } from "../context/DataContext";

export function Performance() {
  const { subjects, calculateCGPA } = useData();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const currentCGPA = calculateCGPA();

  return (
    <div className="p-6 bg-stone-50 dark:bg-stone-950 min-h-screen pb-24 transition-colors duration-300 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <BookOpen className="text-emerald-600 dark:text-emerald-400" /> Academic Report
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">Semester 5 Performance</p>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <SummaryCard label="SGPA" value={currentCGPA} trend="+0.2" color="bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800/30" />
          <SummaryCard label="Attendance" value="92%" trend="-2%" color="bg-cyan-50 text-cyan-700 border-cyan-100 dark:bg-cyan-900/20 dark:text-cyan-300 dark:border-cyan-800/30" />
          <SummaryCard label="Assignments" value="12/15" trend="Pending" color="bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800/30" />
          <SummaryCard label="Total Credits" value={subjects.reduce((a,b) => a + b.credits, 0)} trend="Active" color="bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800/30" />
        </div>

        {/* Subject List */}
        <div>
          <h2 className="text-xs font-bold text-stone-400 dark:text-stone-500 mb-4 uppercase tracking-widest pl-1">
            Subjects
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {subjects.map((subject) => (
              <motion.div 
                layout
                key={subject.id}
                onClick={() => toggleExpand(subject.id)}
                className={`bg-white dark:bg-stone-900 rounded-2xl border ${expandedId === subject.id ? 'border-emerald-500 dark:border-emerald-500 shadow-md ring-1 ring-emerald-50 dark:ring-emerald-900/20' : 'border-stone-100 dark:border-stone-800 shadow-sm'} overflow-hidden transition-all cursor-pointer h-fit`}
              >
                <div className="p-5 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm ${getGradeColor(subject.grade)}`}>
                      {subject.grade}
                    </div>
                    <div>
                      <h3 className="font-semibold text-stone-800 dark:text-stone-100 text-sm">{subject.name}</h3>
                      <p className="text-stone-400 dark:text-stone-500 text-xs font-mono mt-0.5">{subject.code}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="block font-bold text-stone-700 dark:text-stone-200 text-lg">{subject.score}</span>
                      <span className="text-[10px] text-stone-400 dark:text-stone-500 font-bold uppercase tracking-wide">{subject.credits} Credits</span>
                    </div>
                    <div className={`p-1 rounded-full transition-colors ${expandedId === subject.id ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''}`}>
                      <ChevronDown className={`w-4 h-4 text-stone-400 dark:text-stone-500 transition-transform duration-300 ${expandedId === subject.id ? 'rotate-180 text-emerald-600 dark:text-emerald-400' : ''}`} />
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedId === subject.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/20 p-5"
                    >
                      <div className="grid grid-cols-2 gap-6 text-xs mb-4">
                        <div>
                          <div className="flex justify-between mb-1">
                             <p className="text-stone-500 dark:text-stone-400 font-medium">Internal</p>
                             <span className="text-stone-700 dark:text-stone-300 font-bold">24/30</span>
                          </div>
                          <div className="h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 w-[80%]" />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                             <p className="text-stone-500 dark:text-stone-400 font-medium">Lab</p>
                             <span className="text-stone-700 dark:text-stone-300 font-bold">18/20</span>
                          </div>
                           <div className="h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-500 w-[90%]" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 bg-white dark:bg-stone-900 p-3 rounded-xl border border-stone-100 dark:border-stone-800 shadow-sm">
                        <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        <span>Next assignment due in 3 days. Prepare for viva.</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, trend, color }: any) {
  return (
    <div className={`p-5 rounded-2xl border ${color} flex flex-col justify-between h-32`}>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-2">{label}</p>
        <h3 className="text-3xl font-bold mb-1 tracking-tighter">{value}</h3>
      </div>
      <span className="text-[10px] font-bold bg-white/50 dark:bg-black/20 px-2 py-1 rounded-md self-start backdrop-blur-sm">{trend}</span>
    </div>
  );
}

function getGradeColor(grade: string) {
  if (grade === 'O') return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
  if (grade === 'A+' || grade === 'A') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300';
  if (grade.startsWith('B')) return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300';
  if (grade.startsWith('C')) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300';
  return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300';
}
