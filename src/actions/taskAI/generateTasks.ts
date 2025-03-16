'use server'
// import { Resource } from 'sst'
// import { generateObject } from 'ai'
import { z } from 'zod'
// import { createDeepSeek } from '@ai-sdk/deepseek'
import { getMySelf } from '../getMySelf'
// import { createOllama } from 'ollama-ai-provider'

//
import ollama from 'ollama'
import { zodToJsonSchema } from 'zod-to-json-schema'

export const generateTasks = async ({ text = '' }) => {
    let user = await getMySelf()

    if (!['admin'].includes(user.role)) {
        throw new Error('not admin')
    }

    const Step = z.object({
        type: z.enum([`get_data_from_api`, 'send_user_text']),
        url: z.string({
            description: 'the url of the data',
        }),
        displayName: z.string(),
    })

    const ResultSchema = z.object({
        summary: z.string(),
        steps: z.array(Step),
    })

    const response = await ollama.chat({
        model: 'llama3.1',
        messages: [
            { role: 'system', content: 'compile a list of working steps' },
            { role: 'user', content: text },
        ],
        format: zodToJsonSchema(ResultSchema),
    })

    const country = ResultSchema.parse(JSON.parse(response.message.content))
    console.log(country)

    return country
}

//
