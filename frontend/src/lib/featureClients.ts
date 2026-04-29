const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/api';

// ─── Knowledge Base Client ────────────────────────────────────────────────────

export const knowledgeBaseClient = {
  // Create a knowledge base
  async createBase(name: string, description?: string) {
    const res = await fetch(`${API_BASE}/kb/bases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, description }),
    });
    return res.json();
  },

  // List all knowledge bases
  async listBases() {
    const res = await fetch(`${API_BASE}/kb/bases`, {
      credentials: 'include',
    });
    return res.json();
  },

  // Upload document to KB
  async uploadDocument(baseId: string, file: File, fileName?: string) {
    const text = await file.text();
    const res = await fetch(`${API_BASE}/kb/bases/${baseId}/documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        fileName: fileName || file.name,
        fileUrl: URL.createObjectURL(file),
        fileSize: file.size,
        fileType: file.type,
        textContent: text,
      }),
    });
    return res.json();
  },

  // Search knowledge base
  async search(baseId: string, query: string, limit = 5) {
    const res = await fetch(`${API_BASE}/kb/bases/${baseId}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ query, limit }),
    });
    return res.json();
  },

  // Delete document
  async deleteDocument(baseId: string, docId: string) {
    const res = await fetch(`${API_BASE}/kb/bases/${baseId}/documents/${docId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return res.json();
  },
};

// ─── Logs Client ────────────────────────────────────────────────────────────

export const logsClient = {
  // Get execution log for a run
  async getLog(runId: string) {
    const res = await fetch(`${API_BASE}/logs/${runId}`, {
      credentials: 'include',
    });
    return res.json();
  },

  // List execution logs
  async listLogs(filters?: { workflowId?: string; agentId?: string; limit?: number; offset?: number }) {
    const params = new URLSearchParams();
    if (filters?.workflowId) params.set('workflowId', filters.workflowId);
    if (filters?.agentId) params.set('agentId', filters.agentId);
    if (filters?.limit) params.set('limit', String(filters.limit));
    if (filters?.offset) params.set('offset', String(filters.offset));

    const res = await fetch(`${API_BASE}/logs?${params.toString()}`, {
      credentials: 'include',
    });
    return res.json();
  },

  // Get detailed trace for execution
  async getTrace(runId: string) {
    const res = await fetch(`${API_BASE}/logs/${runId}/trace`, {
      credentials: 'include',
    });
    return res.json();
  },

  // Create execution log
  async createLog(runId: string, agentId?: string, workflowId?: string) {
    const res = await fetch(`${API_BASE}/logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ runId, agentId, workflowId }),
    });
    return res.json();
  },

  // Add step to execution log
  async addStep(
    runId: string,
    stepNumber: number,
    name: string,
    status: string,
    input?: any,
    output?: any,
    error?: string,
  ) {
    const res = await fetch(`${API_BASE}/logs/${runId}/steps`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ stepNumber, name, status, input, output, error }),
    });
    return res.json();
  },
};

// ─── Tools Client ────────────────────────────────────────────────────────────

export const toolsClient = {
  // Get available tools
  async listTools() {
    const res = await fetch(`${API_BASE}/tools`, {
      credentials: 'include',
    });
    return res.json();
  },

  // Register custom tool
  async registerTool(name: string, description: string, category: string, config: any) {
    const res = await fetch(`${API_BASE}/tools`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, description, category, config }),
    });
    return res.json();
  },

  // Execute tool
  async executeTool(toolId: string, runId: string, input?: any) {
    const res = await fetch(`${API_BASE}/tools/${toolId}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ runId, input }),
    });
    return res.json();
  },

  // Get tool usage history
  async getUsage(toolId: string, limit = 20, offset = 0) {
    const res = await fetch(`${API_BASE}/tools/${toolId}/usage?limit=${limit}&offset=${offset}`, {
      credentials: 'include',
    });
    return res.json();
  },

  // Update tool
  async updateTool(toolId: string, updates: any) {
    const res = await fetch(`${API_BASE}/tools/${toolId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(updates),
    });
    return res.json();
  },

  // Delete tool
  async deleteTool(toolId: string) {
    const res = await fetch(`${API_BASE}/tools/${toolId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return res.json();
  },
};

// ─── Webhooks Client ────────────────────────────────────────────────────────

export const webhooksClient = {
  // List webhooks
  async listWebhooks() {
    const res = await fetch(`${API_BASE}/webhooks`, {
      credentials: 'include',
    });
    return res.json();
  },

  // Create webhook
  async createWebhook(url: string, events: string[], retries = 3, timeout = 30000) {
    const res = await fetch(`${API_BASE}/webhooks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ url, events, retries, timeout }),
    });
    return res.json();
  },

  // Update webhook
  async updateWebhook(webhookId: string, updates: any) {
    const res = await fetch(`${API_BASE}/webhooks/${webhookId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(updates),
    });
    return res.json();
  },

  // Delete webhook
  async deleteWebhook(webhookId: string) {
    const res = await fetch(`${API_BASE}/webhooks/${webhookId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return res.json();
  },

  // Test webhook
  async testWebhook(webhookId: string) {
    const res = await fetch(`${API_BASE}/webhooks/${webhookId}/test`, {
      method: 'POST',
      credentials: 'include',
    });
    return res.json();
  },

  // Get webhook deliveries
  async getDeliveries(webhookId: string, limit = 20, offset = 0) {
    const res = await fetch(`${API_BASE}/webhooks/${webhookId}/deliveries?limit=${limit}&offset=${offset}`, {
      credentials: 'include',
    });
    return res.json();
  },
};
