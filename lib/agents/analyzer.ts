import { OpenAI } from 'openai'
import { FormBlockInstance } from '@/@types/form-block.type'
import { generateEmbeddings, initPinecone } from '../embeddings'

const openai = new OpenAI()

export async function analyzer(
  formId: string,
  userQuestion: string,
  blocks: FormBlockInstance[]
) {
  const questionEmbedding = await generateEmbeddings(userQuestion)
  const pinecone = await initPinecone()
  const index = pinecone.Index("formai")

  const queryResponse = await index.query({
    vector: questionEmbedding,
    filter: { formId },
    topK: 5,
    includeMetadata: true,
  })

  const relevantResponses = queryResponse.matches
    .map(match => match.metadata?.responseText)
    .filter(Boolean)
    .join("\n\n")

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{
      role: "system",
      content: `You are an AI assistant analyzing form responses. Provide clear, concise answers based on the form data.`
    }, {
      role: "user",
      content: `Question: ${userQuestion}\nRelevant Responses: ${relevantResponses}`
    }]
  })

  return response.choices[0].message.content
}
