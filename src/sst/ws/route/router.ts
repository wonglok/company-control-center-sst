import { ApiGatewayManagementApiClient } from '@aws-sdk/client-apigatewaymanagementapi'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { Resource } from 'sst'
// import { sayHi } from './sayHi/sayHi'
// import { requestAI } from './requestAI/requestAI'
// import { respondAI } from './respondAI/respondAI'

import { response } from './response/response'
import { request } from './request/request'

let wss = new ApiGatewayManagementApiClient({
    endpoint: Resource.SocketAPI.managementEndpoint,
})
let dyna = new DynamoDBClient({})

export async function router({ inbound, connectionId }: any) {
    // if (inbound.action === 'requestAI') {
    //     await requestAI({ inbound, connectionId, wss, dyna })
    // }
    // if (inbound.action === 'respondAI') {
    //     await respondAI({ inbound, connectionId, wss, dyna })
    // }

    if (inbound.route === 'response') {
        await response({ inbound, connectionId, wss, dyna })
    }

    if (inbound.route === 'request') {
        await request({ inbound, connectionId, wss, dyna })
    }
}
