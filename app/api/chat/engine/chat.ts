import { BaseChatEngine, BaseToolWithCall, LLMAgent } from "llamaindex";
import toolConfig from "../config/tools.config"; // adjust the relative path if needed
import { getDataSource } from "./index";
import { createTools } from "./tools";
import { createQueryEngineTool } from "./tools/query-engine";

export async function createChatEngine(documentIds?: string[], params?: any) {
  const tools: BaseToolWithCall[] = [];

  // Add a query engine tool if we have a data source
  const index = await getDataSource(params);
  if (index) {
    tools.push(createQueryEngineTool(index, { documentIds }));
  }

  // Optionally load tools from config if file exists
  tools.push(...(await createTools(toolConfig)));


  const agent = new LLMAgent({
    tools,
    systemPrompt: process.env.SYSTEM_PROMPT,
  }) as unknown as BaseChatEngine;

  return agent;
}
