const fetch = globalThis.fetch || require("node-fetch");
const memoryManager = require("./memory");

async function openAiCompatible(url, apiKey, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: apiKey ? `Bearer ${apiKey}` : "",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`LLM error ${res.status}: ${await res.text()}`);
  return res.json();
}

async function anthropicRequest(apiKey, body) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey || "",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`LLM error ${res.status}: ${await res.text()}`);
  return res.json();
}

async function googleRequest(apiKey, model, body) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey || ""}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`LLM error ${res.status}: ${await res.text()}`);
  return res.json();
}

async function ollamaRequest(baseUrl, body) {
  const res = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, stream: false }),
  });
  if (!res.ok) throw new Error(`LLM error ${res.status}: ${await res.text()}`);
  return res.json();
}

module.exports = {
const toolBridge = require("./tools");

module.exports = {
  async runCompletion({ provider, model, messages, temperature, maxTokens, userId }) {
    // 1. Retrieve memories if userId is provided
    let memoryContext = "";
    if (userId) {
      const lastUserMessage = messages.findLast((m) => m.role === "user")?.content;
      if (lastUserMessage) {
        memoryContext = await memoryManager.getRelevantContext(userId, lastUserMessage);
      }
    }

    // 2. Inject memories into system prompt if available
    if (memoryContext) {
      const systemIndex = messages.findIndex((m) => m.role === "system");
      const memoryPrompt = `\n\nPast interactions and context about this user:\n${memoryContext}`;
      
      if (systemIndex > -1) {
        messages[systemIndex].content += memoryPrompt;
      } else {
        messages.unshift({ role: "system", content: `You are a helpful assistant.${memoryPrompt}` });
      }
    }

    // --- Agent Loop Initialization ---
    let loopCount = 0;
    const maxLoops = 5; // Prevent infinite loops
    let finalResponse = null;

    // Enhance system prompt for tool calling
    const systemIndex = messages.findIndex((m) => m.role === "system");
    const toolInstructions = `\n\nYou have access to various tools. If you need to perform an action, use the following JSON format:
{"thought": "Your reasoning", "tool": "tool-id", "input": {"arg": "value"}}
When you have the final answer, provide it directly without the JSON block.
Supported tools include: google-gmail, google-sheets, google-drive, google-bigquery, google-adsense, google-blogger, youtube-analytics, github-manager, etc.`;

    if (systemIndex > -1) {
      messages[systemIndex].content += toolInstructions;
    }

    while (loopCount < maxLoops) {
      loopCount++;
      let responseText = "";
      let usage = {};

      // Execute LLM request
      if (provider === "anthropic") {
        const apiKey = process.env.ANTHROPIC_API_KEY;
        const system = messages.find((m) => m.role === "system")?.content;
        const data = await anthropicRequest(apiKey, {
          model,
          max_tokens: maxTokens,
          temperature,
          system,
          messages: messages.filter((m) => m.role !== "system"),
        });
        responseText = Array.isArray(data.content) ? data.content[0]?.text : data.content?.text;
      } else {
        // Default: OpenAI-compatible
        const baseUrl = process.env.CUSTOM_LLM_BASE_URL || "https://api.openai.com/v1";
        const apiKey = process.env.OPENAI_API_KEY;
        const url = `${baseUrl.replace(/\/$/, "")}/chat/completions`;
        const payload = { model, messages, temperature, max_tokens: maxTokens };
        const data = await openAiCompatible(url, apiKey, payload);
        responseText = data.choices?.[0]?.message?.content || "";
        usage = data.usage || {};
      }

      // Check for tool calling JSON
      const jsonMatch = responseText.match(/\{[\s\S]*"tool"[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const toolCall = JSON.parse(jsonMatch[0]);
          console.log(`[Agent Loop] Loop ${loopCount}: Calling tool ${toolCall.tool}`);
          
          // Execute the tool via the bridge
          const toolOutput = await toolBridge.executeTool(userId, toolCall.tool, toolCall.input);
          
          // Add tool output to messages and continue loop
          messages.push({ role: "assistant", content: responseText });
          messages.push({ role: "user", content: `Observation from ${toolCall.tool}: ${JSON.stringify(toolOutput)}` });
          continue;
        } catch (e) {
          console.error("[Agent Loop] Failed to parse tool call:", e);
        }
      }

      // No tool call or parsing failed, this is our final response
      finalResponse = { text: responseText, usage };
      break;
    }

    // 3. Store interaction in memory if userId is provided
    if (userId && finalResponse?.text) {
      const fullMessages = [...messages, { role: "assistant", content: finalResponse.text }];
      memoryManager.addInteraction(userId, fullMessages).catch(err => 
        console.error("Failed to add interaction to memory:", err)
      );
    }

    return finalResponse;
  },
};
