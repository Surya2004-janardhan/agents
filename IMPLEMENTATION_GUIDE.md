# Implementation Guide: KB, Logging, Tools & Webhooks

This document outlines the implementation of 4 key features for workflows and agents:

## 1. Knowledge Base / RAG

### What it does
- Upload documents (PDF, TXT, DOCX via API)
- Generate embeddings for semantic search
- Query knowledge base to retrieve relevant context
- Useful for agents to reference company docs, FAQs, guidelines

### API Endpoints
```
POST   /api/kb/bases                      # Create KB
GET    /api/kb/bases                      # List KBs
POST   /api/kb/bases/:baseId/documents    # Upload document
POST   /api/kb/bases/:baseId/search       # Search KB
DELETE /api/kb/bases/:baseId/documents/:docId
```

### Usage Example (Frontend)
```typescript
import { knowledgeBaseClient } from '@/lib/featureClients';

// Create KB
const kb = await knowledgeBaseClient.createBase(
  'Company Guidelines',
  'Internal policies and procedures'
);

// Upload document
const file = new File(['content...'], 'policy.txt');
await knowledgeBaseClient.uploadDocument(kb.knowledgeBase.id, file);

// Search
const results = await knowledgeBaseClient.search(
  kb.knowledgeBase.id,
  'return policy'
);
```

### Next Steps
- [ ] Integrate OpenAI embeddings API for semantic search
- [ ] Add support for multiple file types (PDF, Word)
- [ ] Implement vector storage (Pinecone, Supabase pgvector)
- [ ] Add chunking for large documents
- [ ] UI: Knowledge base manager, document upload drag-drop

---

## 2. Advanced Logging & Execution Traces

### What it does
- Track detailed execution flow of agents/workflows
- Record each step, inputs, outputs, errors
- Store execution duration and resource usage
- Provide debugging interface to replay runs

### API Endpoints
```
POST   /api/logs                          # Create log
GET    /api/logs/:runId                   # Get log
GET    /api/logs/:runId/trace             # Get detailed trace
GET    /api/logs                          # List logs (with filters)
PATCH  /api/logs/:runId                   # Update log status
POST   /api/logs/:runId/steps             # Add step
```

### Data Structure
```typescript
ExecutionLog
  ├─ runId
  ├─ status (running | completed | failed)
  ├─ startedAt / completedAt / duration
  └─ steps: ExecutionStep[]
    ├─ stepNumber
    ├─ name
    ├─ status
    ├─ input / output
    ├─ error
    └─ duration / tokens
```

### Usage Example
```typescript
import { logsClient } from '@/lib/featureClients';

// Create log when run starts
await logsClient.createLog(runId, agentId);

// Record each step
await logsClient.addStep(
  runId,
  1,
  'Web Search',
  'completed',
  { query: 'AI trends' },
  { results: [...] }
);

// Get full trace
const trace = await logsClient.getTrace(runId);
// Includes: steps, durations, errors, timestamps
```

### Next Steps
- [ ] UI: Run details view with step-by-step trace
- [ ] Filter logs by status, duration, errors
- [ ] Export logs as JSON/CSV
- [ ] Real-time log streaming during execution
- [ ] Error analytics dashboard

---

## 3. Tool Integration

### What it does
- Built-in tools: Web Search, File Handling, API Calls, Data Query
- Register custom tools with config
- Execute tools during agent/workflow runs
- Track tool usage and performance

### Built-in Tools
1. **Web Search** - Search the web (SerpAPI)
2. **File Handler** - Read/write/upload files
3. **API Call** - Make HTTP requests to external APIs
4. **Data Query** - Query knowledge base and databases

### API Endpoints
```
GET    /api/tools                         # List available tools
POST   /api/tools                         # Register custom tool
POST   /api/tools/:toolId/execute         # Execute tool
GET    /api/tools/:toolId/usage           # Get tool usage history
PATCH  /api/tools/:toolId                 # Update tool
DELETE /api/tools/:toolId                 # Delete custom tool
```

### Usage Example
```typescript
import { toolsClient } from '@/lib/featureClients';

// Get available tools
const { tools } = await toolsClient.listTools();
// Includes: web-search, file-handler, api-call, data-query

// Execute web search during run
const result = await toolsClient.executeTool(
  'web-search',
  runId,
  { query: 'latest AI news' }
);

// Register custom tool
await toolsClient.registerTool(
  'Slack Notify',
  'Send message to Slack',
  'integration',
  { webhook_url: 'https://...' }
);
```

### Next Steps
- [ ] Implement web search (SerpAPI integration)
- [ ] File upload/download handlers
- [ ] HTTP request builder UI
- [ ] Tool test playground
- [ ] Rate limiting per tool
- [ ] Error recovery and fallbacks

---

## 4. Webhooks & Event Triggers

### What it does
- Register webhooks to subscribe to workflow/agent events
- Automatically send HTTP callbacks when events occur
- Retry failed deliveries with exponential backoff
- Event types: run.started, run.completed, run.failed, etc.

### API Endpoints
```
GET    /api/webhooks                      # List webhooks
POST   /api/webhooks                      # Create webhook
PATCH  /api/webhooks/:webhookId           # Update webhook
DELETE /api/webhooks/:webhookId           # Delete webhook
POST   /api/webhooks/:webhookId/test      # Test webhook
GET    /api/webhooks/:webhookId/deliveries # Get delivery history
```

### Event Types
- `run.started` - Workflow/agent run initiated
- `run.completed` - Run finished successfully
- `run.failed` - Run encountered error
- `run.step_completed` - Individual step completed
- `workflow.created` - New workflow defined
- `agent.updated` - Agent configuration changed

### Usage Example
```typescript
import { webhooksClient } from '@/lib/featureClients';

// Register webhook
const webhook = await webhooksClient.createWebhook(
  'https://example.com/webhooks/runs',
  ['run.completed', 'run.failed'],
  3,      // retries
  30000   // timeout (ms)
);

// Webhook will receive POST:
// {
//   event_type: "run.completed",
//   timestamp: "2026-04-29T15:30:00Z",
//   run_id: "run_123",
//   data: { ... }
// }

// Test webhook
await webhooksClient.testWebhook(webhook.id);

// View delivery history
const { deliveries } = await webhooksClient.getDeliveries(webhook.id);
```

### Webhook Signature
Each webhook request includes an `X-Webhook-Signature` header with HMAC-SHA256:
```
signature = HMAC-SHA256(webhook_secret, request_body)
```

### Next Steps
- [ ] Implement webhook delivery queue (Redis Bull)
- [ ] Exponential backoff retry logic
- [ ] Webhook signature verification
- [ ] Failed delivery notifications
- [ ] Webhook URL validation
- [ ] UI: Webhook manager with test runner

---

## Database Migration

After schema changes, run:

```bash
cd backend/node-api

# Generate migration
npx prisma migrate dev --name add_kb_logging_tools_webhooks

# Apply to production
npx prisma migrate deploy
```

---

## Environment Setup

No new env vars needed, but optional:

```bash
# For embeddings (future)
OPENAI_EMBEDDINGS_ENABLED=true

# For web search tool (future)
SERPAPI_KEY=your_key

# For webhook retries
WEBHOOK_RETRY_INTERVAL=5000
WEBHOOK_MAX_RETRIES=5
```

---

## Integration Points

### Knowledge Base Integration with Agents
```typescript
// In agent execution (ai-worker):
const agentContext = await fetchKnowledgeBase(agentConfig.knowledgeBaseId, userQuery);
const prompt = `Context: ${agentContext}\n\nQuestion: ${userQuery}`;
```

### Tools in Workflows
```typescript
// In workflow step execution:
if (step.toolName) {
  const toolResult = await executeTool(step.toolName, step.input);
  step.output = toolResult;
}
```

### Event Triggers on Run Completion
```typescript
// In ai-worker after run:
await triggerEvent(userId, 'run.completed', {
  runId, workflowId, agentId,
  output, duration, tokens
});
```

---

## Testing

### Knowledge Base
```bash
curl -X POST http://localhost:3000/api/kb/bases \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Test KB"}'
```

### Logs
```bash
curl http://localhost:3000/api/logs/run_123 \
  -H "Authorization: Bearer $TOKEN"
```

### Tools
```bash
curl http://localhost:3000/api/tools \
  -H "Authorization: Bearer $TOKEN"
```

### Webhooks
```bash
curl -X POST http://localhost:3000/api/webhooks \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"url":"https://example.com/hook","events":["run.completed"]}'
```

---

## Roadmap

**Phase 2:**
- [ ] Semantic search with embeddings
- [ ] Multi-file type support
- [ ] Web search tool integration
- [ ] Execution trace UI
- [ ] Webhook delivery dashboard

**Phase 3:**
- [ ] Knowledge base synchronization (GitHub, Notion)
- [ ] Tool marketplace
- [ ] Advanced filtering & analytics
- [ ] Batch execution with logging
- [ ] Performance profiling

---

## Notes

- All endpoints require JWT authentication (except internal event triggers)
- Knowledge base documents stored in PostgreSQL (text field)
- Webhooks retry with configurable backoff
- Tools can be built-in (system) or custom (user-defined)
- Execution logs tied to Run records for audit trail
