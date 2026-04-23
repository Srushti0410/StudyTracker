// GET /api/health
import { connectDB } from './_db.js';
import mongoose from 'mongoose';

export default async function handler(_req, res) {
  try {
    await connectDB();
    res.status(200).json({
      status: 'ok',
      db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
}
