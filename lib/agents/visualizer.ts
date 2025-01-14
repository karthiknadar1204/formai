import { OpenAI } from 'openai'
import { FormBlockInstance } from '@/@types/form-block.type'
import { generateEmbeddings, initPinecone } from '../embeddings'

interface VisualizationQuestion {
  id: string;
  visualType: "bar" | "pie" | "line" | "area";
}

export async function visualizer(
  formId: string,
  userQuestion: string,
  blocks: FormBlockInstance[],
  type: 'numeric' | 'graphical'
) {
  const openai = new OpenAI()
  
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
      content: `You are an AI assistant that generates visualization configurations and explanations for form data analysis.
For numeric insights: Provide statistics and counts with clear explanations
For graphical insights: Suggest appropriate chart types (bar, pie, line, area) based on the data and explain why.

Always explain:
1. What the visualization will show
2. Why this type of chart was chosen
3. Key insights that can be derived from it`
    }, {
      role: "user",
      content: `Question: ${userQuestion}
Available Questions: ${JSON.stringify(blocks.map(b => ({
        id: b.id,
        type: b.blockType,
        label: b.attributes?.label
      })))}
Relevant Responses: ${relevantResponses}`
    }],
    tools: [{
      type: "function",
      function: {
        name: "generateVisualization",
        description: "Generate visualization configuration",
        parameters: {
          type: "object",
          properties: {
            type: {
              type: "string",
              enum: ["numeric", "graphical"]
            },
            questions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  visualType: {
                    type: "string",
                    enum: ["bar", "pie", "line", "area"]
                  }
                },
                required: ["id", "visualType"]
              }
            }
          },
          required: ["type", "questions"]
        }
      }
    }],
    tool_choice: "auto"
  })

  const toolCall = response.choices[0].message.tool_calls?.[0]
  if (toolCall?.function.name === "generateVisualization") {
    const options = JSON.parse(toolCall.function.arguments)
    return {
      type: "visualization",
      visualizationOptions: {
        type: options.type,
        questions: options.questions.map((q: VisualizationQuestion) => ({
          ...q,
          id: q.id.toLowerCase()
        }))
      },
      message: response.choices[0].message.content
    }
  }

  return null
}
