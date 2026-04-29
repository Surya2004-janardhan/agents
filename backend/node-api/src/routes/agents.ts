import { Router, Response } from 'express';
import axios from 'axios';
import { z } from 'zod';
import { authenticate, AuthRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();
const AI_URL = process.env.PYTHON_AI_URL || 'http://localhost:5000';
const INTERNAL_SECRET = process.env.INTERNAL_API_SECRET || '';

const aiHeaders = () => ({ 'x-internal-secret': INTERNAL_SECRET });

/** Registered agent catalogue — extend to add new agents. */
const AGENTS = [
  { id: 'email',      name: 'Email Agent',      description: 'Draft, analyse and reply to emails with AI assistance.', icon: 'mail' },
  { id: 'summarizer', name: 'Summarizer',        description: 'Condense long documents into clear bullet-point summaries.', icon: 'file-text' },
  { id: 'researcher', name: 'Research Assistant', description: 'Deep-dive research on any topic with cited sources.', icon: 'search' },
];

// GET /api/agents — list available agents
router.get('/', authenticate, (_req: AuthRequest, res: Response) => {
  res.json({ agents: AGENTS });
});

// GET /api/agents/:id — agent metadata
router.get('/:id', authenticate, (req: AuthRequest, res: Response) => {
  const agent = AGENTS.find((a) => a.id === req.params.id);
  if (!agent) { res.status(404).json({ error: 'Agent not found' }); return; }
  res.json(agent);
});

// GET /api/agents/:id/memory — fetch user's memory for this agent
router.get('/:id/memory', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { data } = await axios.get(
      `${AI_URL}/ai/agents/${req.params.id}/memory/${req.user!.sub}`,
      { headers: aiHeaders() },
    );
    res.json(data);
  } catch (err: any) {
    const status = err.response?.status || 502;
    res.status(status).json({ error: err.response?.data?.error || 'AI service error' });
  }
});

// DELETE /api/agents/:id/memory — clear user's memory for this agent
router.delete('/:id/memory', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    await axios.delete(
      `${AI_URL}/ai/agents/${req.params.id}/memory/${req.user!.sub}`,
      { headers: aiHeaders() },
    );
    res.json({ message: 'Memory cleared' });
  } catch (err: any) {
    const status = err.response?.status || 502;
    res.status(status).json({ error: err.response?.data?.error || 'AI service error' });
  }
});

export default router;
