import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { generateEmbeddings, initPinecone } from "./embeddings";
import { createLogger } from "./logger";
import { FormBlockInstance } from "@/@types/form-block.type";
import { taskManager } from "./agents";
import { visualizer } from "./agents";
import { analyzer } from "./agents";

const logger = createLogger("chat-service");
const openai = new OpenAI();
const MAX_TOKENS = 4000;

interface ChatMessage {
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  name?: string;
  tool_call_id?: string;
}

interface VisualizationOptions {
  type: "numeric" | "graphical";
  graphType?: "bar" | "pie" | "line" | "area";
  questions?: string[];
}

export class ChatService {
  private context: ChatMessage[] = [];

  constructor() {
    this.context = [{
      role: "system",
      content: `You are an intelligent AI assistant analyzing form responses. Your task is to:
1. Carefully read and understand all questions and their corresponding answers
2. When users request insights or analysis:
   - For numeric insights: Provide statistics like response counts, percentages, and distributions
   - For graphical insights: Suggest appropriate chart types (bar, pie, line, area) based on the data type
3. Always specify which questions you're analyzing using their exact IDs from the form
4. For visualizations, recommend:
   - Pie/Bar charts for multiple choice, radio, or rating questions
   - Line/Area charts for numeric or time-based data
5. Format responses clearly and support with specific examples
6. Be concise yet comprehensive in analysis

For generic questions like "What can you help me with?", I can:
• Ask questions about response patterns and trends
• Request visualizations like pie charts or bar graphs
• Get statistical insights from your data

Try asking something like 'Show me a pie chart of responses' or 'What are the most common answers?'`
    }];
  }

  async queryFormResponses(formId: string, userQuestion: string, blocks?: FormBlockInstance[], conversationHistory: ChatMessage[] = []) {
    try {
      // Update context with conversation history
      this.context = [
        this.context[0], // Keep the system message
        ...conversationHistory, // Add previous conversation
        { role: "user", content: userQuestion } // Add current question
      ];

      const action = await taskManager(userQuestion, blocks || [])
      
      if (action.next === 'visualize') {
        return await visualizer(formId, userQuestion, blocks || [], action.type || 'graphical')
      }
      
      return {
        type: "text",
        message: await analyzer(formId, userQuestion, blocks || [])
      }
    } catch (error) {
      logger.error("Error in queryFormResponses:", error)
      throw error
    }
  }

  private removeOlderMessages() {
    const systemMessage = this.context[0];
    this.context = [systemMessage, ...this.context.slice(-4)];
  }
}
