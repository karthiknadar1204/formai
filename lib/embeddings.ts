import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { createLogger } from './logger';

const logger = createLogger('embeddings');


const openai = new OpenAI();

// Initialize Pinecone
export const initPinecone = async () => {
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });
  return pinecone;
};

// Generate embeddings for text
export const generateEmbeddings = async (input: string | string[]) => {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: input,
    });
    // Return just the embedding values from the first result
    return response.data[0].embedding;
  } catch (error) {
    logger.error('Failed to generate embeddings:', error);
    throw error;
  }
};
