// GET    /api/tasks/:id — get one task
// PATCH  /api/tasks/:id — update task
// DELETE /api/tasks/:id — delete task
import { connectDB } from '../_db.js';
import Task from '../_task.js';

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const task = await Task.findById(id);
      if (!task) return res.status(404).json({ error: 'Task not found' });
      return res.status(200).json(task);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'PATCH') {
    try {
      const task = await Task.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!task) return res.status(404).json({ error: 'Task not found' });
      return res.status(200).json(task);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const task = await Task.findByIdAndDelete(id);
      if (!task) return res.status(404).json({ error: 'Task not found' });
      return res.status(200).json({ message: 'Task deleted', id });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  res.setHeader('Allow', 'GET, PATCH, DELETE');
  return res.status(405).json({ error: 'Method not allowed' });
}
