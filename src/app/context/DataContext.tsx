import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { tasksApi, ApiTask } from '../api/tasks';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Task {
  id: string;          // MongoDB _id (string)
  title: string;
  subject: string;
  deadline: Date;
  progress: number;
  status: 'pending' | 'in-progress' | 'completed';
  type: 'assignment' | 'exam' | 'project';
}

export interface Subject {
  id: number;
  name: string;
  code: string;
  score: number;
  grade: string;
  credits: number;
}

interface DataContextType {
  tasks: Task[];
  subjects: Subject[];
  loading: boolean;
  error: string | null;
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateSubjectScore: (id: number, newScore: number) => void;
  setSubjects: (subjects: Subject[]) => void;
  calculateCGPA: (customSubjects?: Subject[]) => string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function apiToTask(t: ApiTask): Task {
  return {
    id: t._id,
    title: t.title,
    subject: t.subject,
    deadline: new Date(t.deadline),
    progress: t.progress,
    status: t.status,
    type: t.type,
  };
}

function gradeFromScore(score: number): string {
  if (score >= 90) return 'O';
  if (score >= 80) return 'A+';
  if (score >= 70) return 'A';
  if (score >= 60) return 'B+';
  if (score >= 50) return 'B';
  if (score >= 40) return 'P';
  return 'F';
}

// ─── Initial subjects (static — not persisted to DB yet) ─────────────────────

const initialSubjects: Subject[] = [
  { id: 1, name: 'Data Structures', code: 'CS301', score: 85, grade: 'A+', credits: 4 },
  { id: 2, name: 'Database Mgmt', code: 'CS302', score: 78, grade: 'A', credits: 3 },
  { id: 3, name: 'Operating Systems', code: 'CS303', score: 92, grade: 'O', credits: 4 },
  { id: 4, name: 'Computer Networks', code: 'CS304', score: 74, grade: 'B+', credits: 3 },
  { id: 5, name: 'Mathematics III', code: 'MA301', score: 68, grade: 'B', credits: 3 },
];

// ─── Context ──────────────────────────────────────────────────────────────────

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [subjects, setSubjectsState] = useState<Subject[]>(initialSubjects);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Fetch all tasks on mount ──────────────────────────────────────────────
  useEffect(() => {
    tasksApi
      .getAll()
      .then((data) => setTasks(data.map(apiToTask)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // ── CRUD ─────────────────────────────────────────────────────────────────

  const addTask = useCallback(async (task: Omit<Task, 'id'>) => {
    const created = await tasksApi.create({
      title: task.title,
      subject: task.subject,
      deadline: task.deadline.toISOString(),
      progress: task.progress,
      status: task.status,
      type: task.type,
    });
    setTasks((prev) => [...prev, apiToTask(created)]);
  }, []);

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    const payload: Record<string, unknown> = { ...updates };
    if (updates.deadline instanceof Date) {
      payload.deadline = updates.deadline.toISOString();
    }
    const updated = await tasksApi.update(id, payload as any);
    setTasks((prev) => prev.map((t) => (t.id === id ? apiToTask(updated) : t)));
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    await tasksApi.delete(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── Subjects (local only) ─────────────────────────────────────────────────

  const updateSubjectScore = useCallback((id: number, newScore: number) => {
    setSubjectsState((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, score: newScore, grade: gradeFromScore(newScore) } : s
      )
    );
  }, []);

  const setSubjects = useCallback((newSubjects: Subject[]) => {
    setSubjectsState(newSubjects);
  }, []);

  const calculateCGPA = useCallback(
    (customSubjects: Subject[] = subjects) => {
      const totalCredits = customSubjects.reduce((acc, s) => acc + s.credits, 0);
      const weighted = customSubjects.reduce((acc, s) => acc + (s.score / 10) * s.credits, 0);
      return (weighted / totalCredits).toFixed(2);
    },
    [subjects]
  );

  return (
    <DataContext.Provider
      value={{
        tasks,
        subjects,
        loading,
        error,
        addTask,
        updateTask,
        deleteTask,
        updateSubjectScore,
        setSubjects,
        calculateCGPA,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
}
