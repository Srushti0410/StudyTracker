import { useState } from "react";
import { User, Mail, School, Shield, Moon, Bell, ChevronRight, LogOut } from "lucide-react";
import { motion } from "motion/react";

export function Profile() {
  const [activeTab, setActiveTab] = useState("personal");

  return (
    <div className="p-6 pb-24 min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors duration-300">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-stone-500 text-sm">Manage your account</p>
        </div>
        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center border-2 border-emerald-200 dark:border-emerald-800">
          <User className="text-emerald-700 dark:text-emerald-400 w-6 h-6" />
        </div>
      </header>

      {/* Tabs */}
      <div className="flex bg-stone-200 dark:bg-stone-800 p-1 rounded-xl mb-6">
        <button 
          onClick={() => setActiveTab("personal")}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === "personal" ? "bg-white dark:bg-stone-700 shadow-sm text-stone-900 dark:text-white" : "text-stone-500 hover:text-stone-700 dark:text-stone-400"}`}
        >
          Personal
        </button>
        <button 
          onClick={() => setActiveTab("preferences")}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === "preferences" ? "bg-white dark:bg-stone-700 shadow-sm text-stone-900 dark:text-white" : "text-stone-500 hover:text-stone-700 dark:text-stone-400"}`}
        >
          Preferences
        </button>
      </div>

      <motion.div 
        key={activeTab}
        initial={{ opacity: 0, x: activeTab === "personal" ? -20 : 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        className="space-y-6"
      >
        {activeTab === "personal" ? (
          <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 shadow-sm border border-stone-100 dark:border-stone-800 space-y-4">
            <InputField label="Full Name" value="Alex Johnson" icon={<User size={16} />} />
            <InputField label="Email" value="alex.j@university.edu" icon={<Mail size={16} />} />
            <InputField label="University" value="Tech Institute of Science" icon={<School size={16} />} />
            <InputField label="Semester" value="5th Semester" icon={<School size={16} />} />
            
            <div className="pt-4 border-t border-stone-100 dark:border-stone-800">
              <button className="w-full py-3 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-medium rounded-xl hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors flex items-center justify-center gap-2">
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <SettingItem icon={<Moon size={18} />} title="Dark Mode" desc="Adjust appearance automatically" toggle />
            <SettingItem icon={<Bell size={18} />} title="Notifications" desc="Email digests and push alerts" toggle />
            <SettingItem icon={<Shield size={18} />} title="Privacy" desc="Manage data sharing" />
            
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/50 mt-4">
              <h4 className="font-bold text-emerald-800 dark:text-emerald-200 text-sm mb-1">Pro Tip</h4>
              <p className="text-emerald-600 dark:text-emerald-400 text-xs">Sync your calendar with Google Calendar for better alerts.</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function InputField({ label, value, icon }: any) {
  return (
    <div>
      <label className="text-xs font-medium text-stone-500 dark:text-stone-400 mb-1.5 block ml-1">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
          {icon}
        </div>
        <input 
          type="text" 
          defaultValue={value}
          className="w-full pl-10 pr-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm font-medium"
        />
      </div>
    </div>
  );
}

function SettingItem({ icon, title, desc, toggle }: any) {
  const [isOn, setIsOn] = useState(true);
  
  return (
    <button 
      onClick={() => toggle && setIsOn(!isOn)}
      className="w-full bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 dark:group-hover:bg-emerald-900/30 dark:group-hover:text-emerald-400 transition-colors">
          {icon}
        </div>
        <div className="text-left">
          <h4 className="font-semibold text-stone-800 dark:text-stone-200 text-sm">{title}</h4>
          <p className="text-stone-500 dark:text-stone-500 text-xs">{desc}</p>
        </div>
      </div>
      
      {toggle ? (
        <div className={`w-12 h-6 rounded-full p-1 transition-colors ${isOn ? 'bg-emerald-500' : 'bg-stone-300 dark:bg-stone-700'}`}>
          <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${isOn ? 'translate-x-6' : 'translate-x-0'}`} />
        </div>
      ) : (
        <ChevronRight className="text-stone-400 w-5 h-5" />
      )}
    </button>
  );
}
