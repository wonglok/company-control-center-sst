import { router } from './route/router'

export async function handler(event: any) {
    const connectionId = event['requestContext']['connectionId']

    let inbound = JSON.parse(event.body)

    await router({ inbound, connectionId })

    return {
        statusCode: 200,
        body: JSON.stringify('success'),
    }
}
