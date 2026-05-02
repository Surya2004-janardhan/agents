const fetch = globalThis.fetch || require("node-fetch");

/**
 * Bridge to execute tools via the node-api.
 * This allows the worker to perform real actions like sending emails or querying BigQuery.
 */
async function executeTool(userId, toolId, input) {
  const apiUrl = process.env.NODE_API_INTERNAL_URL || "http://node-api:4000";
  const apiSecret = process.env.INTERNAL_API_SECRET;

  try {
    const res = await fetch(`${apiUrl}/api/tools/${toolId}/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-secret": apiSecret,
        "x-user-id": userId,
      },
      body: JSON.stringify({ input }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      return { error: `Tool execution failed: ${errorText}` };
    }

    return await res.json();
  } catch (error) {
    console.error(`Error executing tool ${toolId}:`, error);
    return { error: error.message };
  }
}

module.exports = { executeTool };
