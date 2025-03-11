'use server'

import { DeleteItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb'
import { Resource } from 'sst'
import { dyna } from './dyna'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import { ApiGatewayManagementApiClient, PostToConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi'

let wss = new ApiGatewayManagementApiClient({
    region: process.env.SST_AWS_REGION,
    endpoint: Resource.SocketAPI.managementEndpoint,
})
export async function getOnlineConnections() {
    //
    let results: any[] = await dyna
        .send(
            new ScanCommand({
                TableName: Resource.ConnectionsTable.name,
                ScanFilter: {},
            }),
        )
        .then((r) => r.Items?.map((item) => unmarshall(item)))
        .then(async (data: any) => {
            let bucket: any[] = []
            for (let item of data) {
                console.log(item)

                await wss
                    .send(
                        new PostToConnectionCommand({
                            ConnectionId: item.itemID,
                            Data: JSON.stringify({
                                type: 'ping',
                                payload: {
                                    //
                                },
                            }),
                        }),
                    )
                    .then(() => {
                        bucket.push(item)
                    })
                    .catch(async (r) => {
                        //

                        await dyna.send(
                            new DeleteItemCommand({
                                TableName: Resource.ConnectionsTable.name,
                                Key: marshall({
                                    itemID: item.itemID,
                                }),
                            }),
                        )

                        //

                        //
                    })
            }

            return bucket
        })
        .catch((err) => {
            console.log(err)
            return []
        })

    return {
        socketURL: Resource.SocketAPI.url,
        online: results,
    }
}
