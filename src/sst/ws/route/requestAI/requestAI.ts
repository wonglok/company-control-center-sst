import { DeleteItemCommand, DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb'
// import { jwt2data } from '../../../auth/lib/session'
import { Resource } from 'sst'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { ApiGatewayManagementApiClient, PostToConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi'
const SESSION_SECRET = process.env.SESSION_SECRET || ''

export async function requestAI({
    inbound,
    connectionId,
    wss,
    dyna,
}: {
    inbound: any
    connectionId: string
    wss: ApiGatewayManagementApiClient
    dyna: DynamoDBClient
}) {
    //

    let payload = inbound.payload
    let clientID = payload.clientID
    let query = payload.query

    console.log(inbound)

    // let jwt = json.jwt

    // let userObject = await jwt2data({
    //     payload: jwt,
    //     secretKey: SESSION_SECRET,
    // })

    // console.log(clientID, jwt);
    // console.log(userObject);

    await dyna
        .send(
            new ScanCommand({
                TableName: Resource.ConnectionsTable.name,
                ScanFilter: {
                    clientID: {
                        ComparisonOperator: 'EQ',
                        AttributeValueList: [
                            {
                                S: `${clientID}`,
                            },
                        ],
                    },
                },
            }),
        )
        .then(async (r: any) => {
            if (r?.Items?.length && r.Items.length > 0) {
                for (let item of r.Items) {
                    if (item) {
                        let connection = unmarshall(item)

                        console.log('connection', connection)

                        await wss
                            .send(
                                new PostToConnectionCommand({
                                    ConnectionId: `${connection.itemID}`,
                                    Data: JSON.stringify({
                                        action: 'requestAI',
                                        payload: {
                                            ...payload,

                                            requestedAt: Date.now(),
                                            connectionID: `${connection.itemID}`,
                                            clientID: `${connection.clientID}`,

                                            // jwt: `${jwt}`,

                                            //
                                            // userID: `${userObject.userID}`,
                                            // username: `${userObject.username}`,
                                            // email: `${userObject.email}`,
                                        },
                                    }),
                                }),
                            )
                            .catch((r) => {
                                dyna.send(
                                    new DeleteItemCommand({
                                        TableName: Resource.ConnectionsTable.name,
                                        Key: {
                                            itemID: {
                                                S: `${connection.itemID}`,
                                            },
                                        },
                                    }),
                                )

                                console.error(r)
                            })
                    }
                }
            }
        })
}
