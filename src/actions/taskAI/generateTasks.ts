'use server'
// import { Resource } from 'sst'
// import { generateObject } from 'ai'
import { z } from 'zod'
// import { createDeepSeek } from '@ai-sdk/deepseek'
import { getMySelf } from '../getMySelf'
// import { createOllama } from 'ollama-ai-provider'

// Resource.DEEPSEEK_API_KEY.value

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

    // //DEEPSEEK_API_KEY
    // const deepseek = createDeepSeek({
    //     apiKey: Resource.DEEPSEEK_API_KEY.value,
    // })

    // let ollama = await createOllama({
    //     baseURL: 'http://127.0.0.1:11434',
    // })

    // const model = await ollama('llama3.1:8b')

    // const { object } = await generateObject({
    //     model: model,
    //     schema: z.object({
    //         name: z.string(),
    //         steps: z.array(
    //             //
    //             z.object({ name: z.string(), description: z.string() }),
    //         ),
    //     }),
    //     prompt: 'create steps for the following description. \n' + text,
    // })

    // console.log(object)

    // return object
}

//
