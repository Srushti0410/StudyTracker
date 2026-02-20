import { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router";
import { LayoutGrid, Target, BookOpen, CheckSquare, Calendar as CalendarIcon, User, Moon, Sun, Menu, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { DataProvider } from "../context/DataContext";

export function Layout() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <DataProvider>
      <div className={`min-h-screen font-sans transition-colors duration-300 flex ${isDark ? 'bg-stone-950 text-stone-100' : 'bg-stone-50 text-stone-800'}`}>
        
        {/* Desktop Sidebar (Hidden on Mobile) */}
        <aside className={`hidden md:flex flex-col fixed top-0 left-0 h-screen w-64 border-r border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 z-50 transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
            <span className="font-bold text-lg tracking-tight">StudentTrack</span>
          </div>

          <nav className="flex-1 px-4 space-y-2 mt-4">
            <SidebarItem to="/dashboard" icon={<LayoutGrid size={20} />} label="Dashboard" />
            <SidebarItem to="/goals" icon={<Target size={20} />} label="Goals" />
            <SidebarItem to="/calendar" icon={<CalendarIcon size={20} />} label="Calendar" />
            <SidebarItem to="/performance" icon={<BookOpen size={20} />} label="Performance" />
            <SidebarItem to="/tracker" icon={<CheckSquare size={20} />} label="Tasks" />
            <SidebarItem to="/profile" icon={<User size={20} />} label="Profile" />
          </nav>

          <div className="p-4 border-t border-stone-200 dark:border-stone-800">
            <button 
              onClick={() => setIsDark(!isDark)}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-600 dark:text-stone-400"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
              <span className="text-sm font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className={`flex-1 min-h-screen relative transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-0'}`}>
          
          {/* Mobile Wrapper: Constrained width on mobile, full width on desktop */}
          <div className="md:p-8 w-full max-w-md md:max-w-none mx-auto min-h-screen relative bg-stone-50 dark:bg-stone-950 shadow-2xl md:shadow-none overflow-x-hidden">
            
            {/* Mobile Header (Theme Toggle) */}
            <div className="absolute top-6 right-6 z-50 md:hidden">
              <button 
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-full bg-stone-200/50 dark:bg-stone-800/50 backdrop-blur-md text-stone-600 dark:text-stone-300 shadow-sm transition-transform active:scale-95"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>

            <Outlet context={{ isDark }} />
            
            {/* Bottom Navigation (Mobile Only) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
              <div className="max-w-md mx-auto flex justify-center pb-6 pointer-events-auto">
                <nav className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-xl border border-white/50 dark:border-stone-800/50 px-4 py-4 rounded-full shadow-lg shadow-stone-200/20 dark:shadow-black/40 flex items-center justify-between gap-1 mx-4 w-full max-w-[90%]">
                  <NavItem to="/dashboard" icon={<LayoutGrid size={22} />} label="Home" />
                  <NavItem to="/goals" icon={<Target size={22} />} label="Goals" />
                  <NavItem to="/calendar" icon={<CalendarIcon size={22} />} label="Plan" />
                  <NavItem to="/performance" icon={<BookOpen size={22} />} label="Marks" />
                  <NavItem to="/profile" icon={<User size={22} />} label="You" />
                </nav>
              </div>
            </div>

          </div>
        </main>
      </div>
    </DataProvider>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors px-2 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300'}`}
    >
      {({ isActive }) => (
        <>
          <div className="relative p-1">
            {isActive && (
              <motion.div 
                layoutId="nav-indicator"
                className="absolute inset-0 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl -z-10"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            {icon}
          </div>
          <span className="text-[9px] font-medium tracking-wide">{label}</span>
        </>
      )}
    </NavLink>
  );
}

function SidebarItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-semibold' : 'text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-200'}`}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </NavLink>
  );
}
