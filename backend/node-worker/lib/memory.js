const { MemoryClient } = require("mem0ai");

/**
 * Memory layer using Mem0 to provide long-term, adaptive memory for agents.
 */
class MemoryManager {
  constructor() {
    const apiKey = process.env.MEM0_API_KEY;
    if (!apiKey || apiKey === "your-mem0-api-key") {
      console.warn("Mem0 API Key not configured. Memory features will be disabled.");
      this.client = null;
    } else {
      this.client = new MemoryClient({ apiKey });
    }
  }

  /**
   * Retrieve relevant memories for a user based on a query.
   * @param {string} userId - Unique identifier for the user.
   * @param {string} query - The current user query or context.
   * @returns {Promise<string>} - A string of relevant memories.
   */
  async getRelevantContext(userId, query) {
    if (!this.client) return "";

    try {
      const results = await this.client.search(query, { user_id: userId });
      if (!results || results.length === 0) return "";

      // Mem0 results typically have a 'memory' field
      return results
        .map((m) => m.memory || m.content)
        .filter(Boolean)
        .join("\n");
    } catch (error) {
      console.error("Error fetching memories from Mem0:", error);
      return "";
    }
  }

  /**
   * Add a new interaction to the user's memory.
   * @param {string} userId - Unique identifier for the user.
   * @param {Array} messages - Array of messages in OpenAI format.
   */
  async addInteraction(userId, messages) {
    if (!this.client) return;

    try {
      // Extract the last exchange to store
      const userMessage = messages.findLast((m) => m.role === "user")?.content;
      const assistantMessage = messages.findLast((m) => m.role === "assistant")?.content;

      if (!userMessage || !assistantMessage) return;

      await this.client.add(
        [
          { role: "user", content: userMessage },
          { role: "assistant", content: assistantMessage },
        ],
        { user_id: userId }
      );
    } catch (error) {
      console.error("Error adding interaction to Mem0:", error);
    }
  }
}

module.exports = new MemoryManager();
