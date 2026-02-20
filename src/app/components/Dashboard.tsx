import { motion } from "motion/react";
import { ArrowUpRight, TrendingUp, BookOpen, AlertCircle, Clock } from "lucide-react";
import { Link, useOutletContext } from "react-router";
import { useData } from "../context/DataContext";
import { formatDistanceToNow } from "date-fns";

export function Dashboard() {
  const { tasks, subjects, calculateCGPA } = useData();
  const currentCGPA = parseFloat(calculateCGPA());
  const targetCGPA = 9.0;
  const progress = (currentCGPA / 10) * 100;
  
  // Calculate stats
  const pendingTasks = tasks.filter(t => t.status !== 'completed').length;
  const nextTask = tasks.filter(t => t.status !== 'completed').sort((a,b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())[0];
  
  return (
    <div className="p-6 bg-stone-50 dark:bg-stone-950 min-h-screen transition-colors duration-300 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Hello, Student! 👋</h1>
            <p className="text-stone-500 dark:text-stone-400 text-sm">Keep pushing for that {targetCGPA}!</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center border-2 border-emerald-200 dark:border-emerald-800">
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">S</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Main CGPA Card */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="col-span-1 md:col-span-2 lg:col-span-2 bg-stone-900 dark:bg-stone-800 rounded-3xl p-6 text-white shadow-xl shadow-stone-300 dark:shadow-black/50 relative overflow-hidden group min-h-[200px] flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transition-all group-hover:bg-emerald-500/30" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 transition-all group-hover:bg-amber-500/30" />
            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <span className="text-stone-300 font-medium bg-white/10 px-3 py-1 rounded-full text-xs backdrop-blur-md border border-white/10">Current CGPA</span>
              <div className="bg-emerald-500/20 p-2 rounded-full">
                <TrendingUp className="text-emerald-400 w-5 h-5" />
              </div>
            </div>
            
            <div className="flex items-end gap-3 mb-8 relative z-10">
              <h2 className="text-6xl font-bold tracking-tighter text-stone-50">{currentCGPA}</h2>
              <span className="text-stone-400 text-lg mb-2 font-medium">/ 10.0</span>
            </div>

            <div className="relative z-10">
              <div className="flex justify-between text-xs text-stone-400 mb-2 uppercase tracking-wider font-semibold">
                <span>Progress to Target</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-stone-800 rounded-full overflow-hidden border border-stone-700/50">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                />
              </div>
            </div>
          </motion.div>

          {/* Quick Stats Column */}
          <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
            <StatCard 
              icon={<BookOpen className="text-amber-600 dark:text-amber-400 w-5 h-5" />} 
              title="Subjects" 
              value={subjects.length} 
              subtitle="Active Courses"
              color="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-100 dark:border-amber-800/30"
            />
            <StatCard 
              icon={<AlertCircle className="text-rose-600 dark:text-rose-400 w-5 h-5" />} 
              title="Pending Tasks" 
              value={pendingTasks} 
              subtitle="To do"
              color="bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 border-rose-100 dark:border-rose-800/30"
            />
          </div>

          {/* Recent Activity / Next Up */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-stone-800 dark:text-stone-200 text-lg">Up Next</h3>
              <Link to="/tracker" className="text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-center gap-1 hover:underline">
                See all <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasks.slice(0, 3).map((task) => (
                <TaskItem 
                  key={task.id}
                  title={task.title} 
                  type={task.type || 'Assignment'} 
                  due={formatDistanceToNow(new Date(task.deadline), { addSuffix: true })} 
                  status={task.status === 'completed' ? 'normal' : 'urgent'} 
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, subtitle, color }: any) {
  return (
    <div className={`p-4 rounded-2xl border ${color.split(' ')[4]} bg-white dark:bg-stone-900 shadow-sm flex flex-col justify-center items-start gap-3 transition-transform active:scale-95 border-stone-100 dark:border-stone-800 h-full`}>
      <div className={`p-2.5 rounded-xl ${color.split(' ')[0]}`}>
        {icon}
      </div>
      <div>
        <p className="text-stone-500 dark:text-stone-400 text-xs font-medium mb-1 uppercase tracking-wide">{title}</p>
        <h4 className="text-2xl font-bold text-stone-800 dark:text-stone-100">{value}</h4>
        <p className="text-stone-400 dark:text-stone-500 text-[10px]">{subtitle}</p>
      </div>
    </div>
  );
}

function TaskItem({ title, type, due, status }: any) {
  const statusColors: any = {
    urgent: 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-800/30',
    upcoming: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800/30',
    normal: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800/30'
  };
  
  const dotColors: any = {
    urgent: 'bg-rose-500',
    upcoming: 'bg-amber-500',
    normal: 'bg-emerald-500'
  };

  return (
    <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm flex justify-between items-center group hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors">
      <div className="flex gap-4 items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold capitalize ${statusColors[status]}`}>
          {type[0]}
        </div>
        <div>
          <h4 className="font-semibold text-stone-800 dark:text-stone-200 text-sm group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">{title}</h4>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-stone-400 dark:text-stone-500 text-xs font-medium capitalize">{type}</span>
            <span className="text-stone-300 dark:text-stone-600 text-[10px]">•</span>
            <span className="text-stone-500 dark:text-stone-400 text-xs flex items-center gap-1">
               <Clock className="w-3 h-3" /> {due}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
