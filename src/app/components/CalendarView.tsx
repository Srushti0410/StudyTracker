import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { format, isSameDay } from "date-fns";
import { motion, AnimatePresence } from "motion/react";
import { Calendar as CalendarIcon, Clock, AlertCircle } from "lucide-react";
import "react-day-picker/dist/style.css";
import { useData } from "../context/DataContext";

export function CalendarView() {
  const { tasks } = useData();
  const [selected, setSelected] = useState<Date | undefined>(new Date());

  // Filter tasks for the selected date
  const selectedEvents = tasks.filter(
    (task) => selected && isSameDay(new Date(task.deadline), selected)
  );

  // Get all dates that have tasks
  const eventDates = tasks.map(task => new Date(task.deadline));

  return (
    <div className="p-6 pb-24 min-h-screen bg-stone-50 dark:bg-stone-950 transition-colors duration-300 md:p-12 md:pb-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2">
            <CalendarIcon className="text-emerald-600 dark:text-emerald-400" /> Schedule
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm">Stay ahead of deadlines</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Calendar Widget */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-sm border border-stone-200 dark:border-stone-800">
            <DayPicker
              mode="single"
              selected={selected}
              onSelect={setSelected}
              className="mx-auto"
              modifiers={{
                event: eventDates,
              }}
              modifiersStyles={{
                event: {
                  fontWeight: "bold",
                  textDecoration: "underline",
                  color: "#059669", // emerald-600
                },
              }}
              styles={{
                caption: { color: "var(--foreground)" },
                head_cell: { color: "#78716c" }, // stone-500
                day: { color: "var(--foreground)" },
                nav_button: { color: "#059669" },
              }}
            />
          </div>

          {/* Events List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-stone-800 dark:text-stone-200">
                {selected ? format(selected, "MMMM d, yyyy") : "Select a date"}
              </h3>
              <span className="text-xs font-bold bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded-md text-stone-500">
                {selectedEvents.length} Events
              </span>
            </div>
            
            <AnimatePresence mode="wait">
              {selectedEvents.length > 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  {selectedEvents.map((event) => (
                    <div key={event.id} className={`p-4 rounded-xl border-l-4 ${event.type === 'exam' ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'} shadow-sm`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-stone-800 dark:text-stone-100">{event.title}</h4>
                          <p className="text-stone-500 dark:text-stone-400 text-xs capitalize mt-1 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-stone-400 inline-block"></span>
                            {event.subject}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${event.type === 'exam' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            {event.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 bg-stone-100 dark:bg-stone-900 rounded-2xl border border-dashed border-stone-300 dark:border-stone-700"
                >
                  <AlertCircle className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                  <p className="text-stone-500 dark:text-stone-400">No events for this day</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
