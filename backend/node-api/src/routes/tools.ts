import { Router, Request, Response } from 'express';
import { auth } from '../middleware/auth';
import prisma from '../lib/prisma';
import { JwtPayload } from '../types/express';

const router = Router();

// Get available tools
const BUILT_IN_TOOLS = [
  {
    id: 'web-search',
    name: 'Web Search',
    description: 'Search the web for information',
    category: 'search',
    config: { provider: 'serpapi' },
  },
  {
    id: 'file-handler',
    name: 'File Handler',
    description: 'Read, write, and process files',
    category: 'file',
    config: { maxSize: '10MB' },
  },
  {
    id: 'api-call',
    name: 'API Call',
    description: 'Make HTTP calls to external APIs',
    category: 'integration',
    config: { timeout: 30000 },
  },
  {
    id: 'data-query',
    name: 'Data Query',
    description: 'Query your knowledge base',
    category: 'knowledge',
    config: { limit: 5 },
  },
];

// List available tools
router.get('/', auth, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as JwtPayload).id;

    const customTools = await prisma.tool.findMany({
      where: { userId },
    });

    res.json({
      success: true,
      tools: [
        ...BUILT_IN_TOOLS.map((t) => ({ ...t, builtin: true })),
        ...customTools.map((t) => ({ ...t, builtin: false })),
      ],
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Register custom tool
router.post('/', auth, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as JwtPayload).id;
    const { name, description, category, config } = req.body;

    const tool = await prisma.tool.create({
      data: { userId, name, description, category, config },
    });

    res.json({ success: true, tool });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Update tool
router.patch('/:toolId', auth, async (req: Request, res: Response) => {
  try {
    const { toolId } = req.params;
    const userId = (req.user as JwtPayload).id;
    const { name, description, enabled, config } = req.body;

    const tool = await prisma.tool.findUnique({
      where: { id: toolId },
    });

    if (!tool || tool.userId !== userId) {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    const updated = await prisma.tool.update({
      where: { id: toolId },
      data: { name, description, enabled, config },
    });

    res.json({ success: true, tool: updated });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Execute tool
router.post('/:toolId/execute', auth, async (req: Request, res: Response) => {
  try {
    const { toolId } = req.params;
    const userId = (req.user as JwtPayload).id;
    const { runId, input } = req.body;

    const tool = await prisma.tool.findUnique({
      where: { id: toolId },
    });

    if (!tool || tool.userId !== userId) {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    const startTime = Date.now();
    let output: any = null;
    let error: string | null = null;

    try {
      // TODO: Execute based on tool type
      switch (toolId) {
        case 'web-search':
          // Example: call SerpAPI or similar
          output = { results: [], source: 'web-search' };
          break;
        case 'file-handler':
          output = { status: 'handled', source: 'file-handler' };
          break;
        case 'api-call':
          // Execute HTTP call
          output = { status: 'success', source: 'api-call' };
          break;
        case 'data-query':
          output = { results: [], source: 'data-query' };
          break;
        default:
          // Custom tool handler
          output = { executed: true, tool: tool.name };
      }
    } catch (e: any) {
      error = e.message;
    }

    const duration = Date.now() - startTime;

    const usage = await prisma.toolUsage.create({
      data: {
        userId,
        runId,
        toolName: tool.name,
        input,
        output,
        error,
        duration,
      },
    });

    res.json({ success: true, output, error, duration, usage });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get tool usage history
router.get('/:toolId/usage', auth, async (req: Request, res: Response) => {
  try {
    const { toolId } = req.params;
    const userId = (req.user as JwtPayload).id;
    const { limit = 20, offset = 0 } = req.query;

    const tool = await prisma.tool.findUnique({
      where: { id: toolId },
    });

    if (!tool || tool.userId !== userId) {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    const usage = await prisma.toolUsage.findMany({
      where: { userId, toolName: tool.name },
      orderBy: { createdAt: 'desc' },
      take: Number(limit),
      skip: Number(offset),
    });

    const total = await prisma.toolUsage.count({
      where: { userId, toolName: tool.name },
    });

    res.json({ success: true, usage, total, limit: Number(limit), offset: Number(offset) });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Delete tool
router.delete('/:toolId', auth, async (req: Request, res: Response) => {
  try {
    const { toolId } = req.params;
    const userId = (req.user as JwtPayload).id;

    const tool = await prisma.tool.findUnique({
      where: { id: toolId },
    });

    if (!tool || tool.userId !== userId) {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    await prisma.tool.delete({
      where: { id: toolId },
    });

    res.json({ success: true });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
