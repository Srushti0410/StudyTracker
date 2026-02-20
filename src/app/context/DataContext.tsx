import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types
export interface Task {
  id: number;
  title: string;
  subject: string;
  deadline: Date; // using Date object for easier calendar integration
  progress: number;
  status: 'pending' | 'in-progress' | 'completed';
  type: 'assignment' | 'exam' | 'project';
}

export interface Subject {
  id: number;
  name: string;
  code: string;
  score: number; // Current score
  grade: string;
  credits: number;
}

interface DataContextType {
  tasks: Task[];
  subjects: Subject[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: number, updates: Partial<Task>) => void;
  updateSubjectScore: (id: number, newScore: number) => void;
  setSubjects: (subjects: Subject[]) => void;
  calculateCGPA: (customSubjects?: Subject[]) => string;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const initialSubjects: Subject[] = [
  { id: 1, name: "Data Structures", code: "CS301", score: 85, grade: "A+", credits: 4 },
  { id: 2, name: "Database Mgmt", code: "CS302", score: 78, grade: "A", credits: 3 },
  { id: 3, name: "Operating Systems", code: "CS303", score: 92, grade: "O", credits: 4 },
  { id: 4, name: "Computer Networks", code: "CS304", score: 74, grade: "B+", credits: 3 },
  { id: 5, name: "Mathematics III", code: "MA301", score: 68, grade: "B", credits: 3 },
];

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Database Assignment",
    subject: "Database Mgmt",
    deadline: new Date(new Date().setDate(new Date().getDate() + 1)), // Tomorrow
    progress: 75,
    status: "in-progress",
    type: 'assignment'
  },
  {
    id: 2,
    title: "OS Lab Viva",
    subject: "Operating Systems",
    deadline: new Date(new Date().setDate(new Date().getDate() + 3)), // In 3 days
    progress: 30,
    status: "pending",
    type: 'exam'
  },
  {
    id: 3,
    title: "Data Structures Quiz",
    subject: "Data Structures",
    deadline: new Date(new Date().setDate(new Date().getDate() + 5)),
    progress: 0,
    status: "pending",
    type: 'exam'
  },
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);

  const addTask = (task: Omit<Task, 'id'>) => {
    setTasks(prev => [...prev, { ...task, id: Math.max(0, ...prev.map(t => t.id)) + 1 }]);
  };

  const updateTask = (id: number, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const updateSubjectScore = (id: number, newScore: number) => {
    setSubjects(prev => prev.map(s => {
      if (s.id === id) {
        // Simple grade logic for demo
        let grade = 'F';
        if (newScore >= 90) grade = 'O';
        else if (newScore >= 80) grade = 'A+';
        else if (newScore >= 70) grade = 'A';
        else if (newScore >= 60) grade = 'B+';
        else if (newScore >= 50) grade = 'B';
        else if (newScore >= 40) grade = 'P';

        return { ...s, score: newScore, grade };
      }
      return s;
    }));
  };

  const setSubjectsFromAPI = (newSubjects: Subject[]) => {
    setSubjects(newSubjects);
  };

  const calculateCGPA = (customSubjects: Subject[] = subjects) => {
    const totalCredits = customSubjects.reduce((acc, s) => acc + s.credits, 0);
    const weightedScore = customSubjects.reduce((acc, s) => {
      // Convert score to grade point (approximate)
      const gradePoint = s.score / 10;
      return acc + (gradePoint * s.credits);
    }, 0);

    return (weightedScore / totalCredits).toFixed(2);
  };

  return (
    <DataContext.Provider value={{ tasks, subjects, addTask, updateTask, updateSubjectScore, setSubjects: setSubjectsFromAPI, calculateCGPA }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
