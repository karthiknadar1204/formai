import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { generateEmbeddings, initPinecone } from "./embeddings";
import { createLogger } from "./logger";

const logger = createLogger("chat-service");
const openai = new OpenAI();
const MAX_TOKENS = 4000;

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export class ChatService {
  private context: ChatMessage[] = [];

  constructor() {
    // Initialize with system message
    this.context = [{
      role: "system",
      content: `You are an intelligent AI assistant analyzing form responses. Your task is to:
1. Carefully read and understand all questions and their corresponding answers
2. Analyze patterns, trends, and key insights in the responses
3. Provide clear, well-structured, and detailed answers based on the form response data
4. Format your responses in a clear and readable way
5. Support your answers with specific examples from the responses when relevant
6. Be concise yet comprehensive in your analysis`
    }];
  }

  async queryFormResponses(formId: string, userQuestion: string) {
    try {
      // 1. Generate embeddings for the user question
      const questionEmbedding = await generateEmbeddings(userQuestion);

      // 2. Query Pinecone for similar responses
      const pinecone = await initPinecone();
      const index = pinecone.Index("formai");

      const queryResponse = await index.query({
        vector: questionEmbedding,
        filter: { formId }, // Filter by formId
        topK: 5,
        includeMetadata: true,
      });

      // 3. Format relevant responses for the AI
      const relevantResponses = queryResponse.matches
        .map(match => match.metadata?.responseText)
        .filter(Boolean)
        .join("\n\n");

      // 4. Create detailed prompt for OpenAI
      this.context.push({
        role: "user",
        content: `Here are the form responses to analyze:

${relevantResponses}

User Question: ${userQuestion}

Please provide a comprehensive analysis by:
1. Reading through all questions and answers carefully
2. Identifying relevant information and patterns
3. Providing a clear and well-structured response
4. Including specific examples from the responses where appropriate
5. Ensuring your answer directly addresses the user's question

Please format your response in a clear, readable way.`
      });

      // 5. Get AI response
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: this.context,
        temperature: 0.7,
      });

      const responseMessage = response.choices[0].message;
      this.context.push(responseMessage);

      // 6. Manage context length
      if (response.usage && response.usage.total_tokens > MAX_TOKENS) {
        this.removeOlderMessages();
      }

      return responseMessage.content;

    } catch (error) {
      logger.error("Error in queryFormResponses:", error);
      throw error;
    }
  }

  private removeOlderMessages() {
    // Keep system message and last 4 messages
    const systemMessage = this.context[0];
    this.context = [systemMessage, ...this.context.slice(-4)];
  }
}
