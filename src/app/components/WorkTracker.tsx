import { useState } from "react";
import { Plus, Clock, CheckSquare, Trash2, X, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { format } from "date-fns";
import { useData } from "../context/DataContext";

export function WorkTracker() {
  const { tasks, updateTask, addTask, deleteTask, loading, error } = useData();
  const [filter, setFilter] = useState("all");
  const [isAdding, setIsAdding] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // New Task Form State
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskSubject, setNewTaskSubject] = useState("");
  const [newTaskDate, setNewTaskDate] = useState("");
  const [newTaskType, setNewTaskType] = useState("assignment");

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    return task.status === filter;
  });

  const toggleTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    try {
      await updateTask(id, {
        status: task.status === "completed" ? "pending" : "completed",
        progress: task.status === "completed" ? 0 : 100,
      });
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id);
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle || !newTaskSubject || !newTaskDate) return;
    setSubmitting(true);
    setActionError(null);
    try {
      await addTask({
        title: newTaskTitle,
        subject: newTaskSubject,
        deadline: new Date(newTaskDate),
        progress: 0,
        status: "pending",
        type: newTaskType as any,
      });
      setIsAdding(false);
      setNewTaskTitle("");
      setNewTaskSubject("");
      setNewTaskDate("");
      setNewTaskType("assignment");
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-stone-50 dark:bg-stone-950 min-h-screen pb-24 relative transition-colors duration-300 md:p-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Tasks</h1>
            <p className="text-stone-500 dark:text-stone-400 text-sm">Stay on top of your work</p>
          </div>
          <button
            onClick={() => { setIsAdding(true); setActionError(null); }}
            className="bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-stone-200 text-white dark:text-stone-900 p-3 rounded-xl shadow-lg shadow-stone-300 dark:shadow-black/50 transition-colors active:scale-95 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden md:inline font-medium text-sm">Add Task</span>
          </button>
        </header>

        {/* Error Banner */}
        <AnimatePresence>
          {(error || actionError) && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-4 flex items-center gap-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 px-4 py-3 rounded-xl text-sm"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error || actionError}</span>
              <button
                className="ml-auto text-rose-400 hover:text-rose-600"
                onClick={() => setActionError(null)}
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Task Form */}
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white dark:bg-stone-900 p-6 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 mb-6 overflow-hidden"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">New Task</h3>
                <button onClick={() => setIsAdding(false)}>
                  <X className="w-5 h-5 text-stone-400" />
                </button>
              </div>
              <form onSubmit={handleAddTask} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  placeholder="Task Title"
                  className="p-3 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 w-full"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  required
                />
                <input
                  placeholder="Subject"
                  className="p-3 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 w-full"
                  value={newTaskSubject}
                  onChange={(e) => setNewTaskSubject(e.target.value)}
                  required
                />
                <input
                  type="date"
                  className="p-3 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 w-full"
                  value={newTaskDate}
                  onChange={(e) => setNewTaskDate(e.target.value)}
                  required
                />
                <select
                  className="p-3 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 w-full"
                  value={newTaskType}
                  onChange={(e) => setNewTaskType(e.target.value)}
                >
                  <option value="assignment">Assignment</option>
                  <option value="exam">Exam</option>
                  <option value="project">Project</option>
                </select>
                <button
                  type="submit"
                  disabled={submitting}
                  className="md:col-span-2 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? "Creating…" : "Create Task"}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {["all", "in-progress", "pending", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${filter === f
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-200 dark:shadow-emerald-900/30"
                  : "bg-white dark:bg-stone-900 text-stone-500 dark:text-stone-400 border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700"
                }`}
            >
              {f.replace("-", " ")}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16 gap-3 text-stone-400">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-sm">Loading tasks…</span>
          </div>
        )}

        {/* Task Grid */}
        {!loading && (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {filteredTasks.map((task) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={task.id}
                  className={`bg-white dark:bg-stone-900 p-4 rounded-2xl border ${task.status === "completed"
                      ? "border-emerald-100 dark:border-emerald-900/20 bg-emerald-50/20 dark:bg-emerald-900/10"
                      : "border-stone-100 dark:border-stone-800"
                    } shadow-sm relative overflow-hidden group`}
                >
                  {/* Progress Bar */}
                  <div className="absolute bottom-0 left-0 h-1 bg-stone-100 dark:bg-stone-800 w-full">
                    <div
                      className={`h-full transition-all duration-500 ${task.progress === 100 ? "bg-emerald-500" : "bg-amber-500"
                        }`}
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>

                  <div className="flex items-start gap-4 relative z-10">
                    {/* Toggle Checkbox */}
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${task.status === "completed"
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "border-stone-300 dark:border-stone-600 text-transparent hover:border-emerald-500 dark:hover:border-emerald-400"
                        }`}
                    >
                      <CheckSquare className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1 gap-2">
                        <h3
                          className={`font-semibold text-sm truncate ${task.status === "completed"
                              ? "text-stone-400 line-through decoration-stone-400"
                              : "text-stone-800 dark:text-stone-200"
                            }`}
                        >
                          {task.title}
                        </h3>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400 shrink-0">
                          {task.subject}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-stone-400 dark:text-stone-500 mt-2">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(task.deadline), "MMM d, yyyy")}
                        </span>
                        {task.status === "in-progress" && (
                          <span className="text-amber-600 dark:text-amber-400 font-bold text-[10px] uppercase tracking-wide">
                            {task.progress}% done
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-stone-300 hover:text-rose-500 dark:text-stone-600 dark:hover:text-rose-400 shrink-0 mt-0.5"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-400 dark:text-stone-500">
              <CheckSquare className="w-8 h-8" />
            </div>
            <p className="text-stone-500 dark:text-stone-400">No tasks found</p>
          </div>
        )}
      </div>
    </div>
  );
}
