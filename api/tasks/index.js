// GET /api/tasks  — list all tasks
// POST /api/tasks — create a task
import { connectDB } from '../_db.js';
import Task from '../_task.js';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const tasks = await Task.find().sort({ deadline: 1 });
      return res.status(200).json(tasks);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const task = await Task.create(req.body);
      return res.status(201).json(task);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'Method not allowed' });
}
