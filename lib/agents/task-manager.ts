import { OpenAI } from 'openai'
import { FormBlockInstance } from '@/@types/form-block.type'

const openai = new OpenAI()

interface NextAction {
  next: 'visualize' | 'respond'
  type?: 'numeric' | 'graphical'
  reason: string
}

export async function taskManager(
  userQuestion: string,
  blocks: FormBlockInstance[]
) {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{
      role: "system",
      content: `You are an AI assistant that determines how to best respond to form analysis questions.
For each query, determine if it requires:
1. A simple text response ('respond')
2. A visualization ('visualize')

For visualization requests, specify:
- type: 'numeric' for statistical summaries
- type: 'graphical' for charts/graphs

Consider:
- Questions about trends, patterns, or distributions usually need visualization
- Simple factual queries can use text responses
- Questions about comparisons or relationships often benefit from charts`
    }, {
      role: "user",
      content: `Question: ${userQuestion}\nAvailable Questions: ${JSON.stringify(blocks.map(b => ({
        id: b.id,
        type: b.blockType,
        label: b.attributes?.label
      })))}`
    }],
    functions: [{
      name: "determineAction",
      description: "Determine the next action to take",
      parameters: {
        type: "object",
        properties: {
          next: {
            type: "string",
            enum: ["visualize", "respond"]
          },
          type: {
            type: "string",
            enum: ["numeric", "graphical"]
          },
          reason: {
            type: "string"
          }
        },
        required: ["next", "reason"]
      }
    }],
    function_call: { name: "determineAction" }
  })

  const result = JSON.parse(
    response.choices[0].message.function_call?.arguments || '{}'
  )
  return result as NextAction
}
