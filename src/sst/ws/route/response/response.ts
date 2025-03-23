import { DeleteItemCommand, DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb'
// import { jwt2data } from '../../../auth/lib/session'
import { Resource } from 'sst'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import { ApiGatewayManagementApiClient, PostToConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi'
const SESSION_SECRET = process.env.SESSION_SECRET || ''

export async function response({
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

    console.log(inbound.clientID)

    let onlineUsers = await dyna
        .send(
            new ScanCommand({
                TableName: Resource.ConnectionsTable.name,
                ScanFilter: {
                    clientID: {
                        ComparisonOperator: 'EQ',
                        AttributeValueList: [
                            {
                                S: `${inbound.clientID}`,
                            },
                        ],
                    },
                },
            }),
        )
        .then((r) => r.Items?.map((item) => unmarshall(item)))
        .then(async (data: any) => {
            let bucket: any[] = []
            for (let item of data) {
                //

                await wss
                    .send(
                        new PostToConnectionCommand({
                            ConnectionId: item.itemID,
                            Data: JSON.stringify({
                                ...inbound,
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
        .finally(() => {
            wss.destroy()
        })

    // let clientID = inbound.clientID

    // // let payload = inbound.payload
    // // let requestID = inbound.requestID
    // // let result = inbound.result

    // // // requestID
    // // // jwt(userID + randomID, secret) = mixer
    // // // store in DB
    // // // md5(userID + appID + mixer) = hash
    // // //

    // // console.log(inbound)

    // // // let jwt = json.jwt

    // // // let userObject = await jwt2data({
    // // //     payload: jwt,
    // // //     secretKey: SESSION_SECRET,
    // // // })

    // // // console.log(clientID, jwt);
    // // // console.log(userObject);

    // await dyna
    //     .send(
    //         new ScanCommand({
    //             TableName: Resource.ConnectionsTable.name,
    //             ScanFilter: {
    //                 clientID: {
    //                     ComparisonOperator: 'EQ',
    //                     AttributeValueList: [
    //                         {
    //                             S: `${clientID}`,
    //                         },
    //                     ],
    //                 },
    //             },
    //         }),
    //     )
    //     .then(async (r: any) => {
    //         if (r?.Items?.length && r.Items.length > 0) {
    //             for (let item of r.Items) {
    //                 if (item) {
    //                     let connection = unmarshall(item)
    //                     console.log('connection', connection)

    //                     await wss
    //                         .send(
    //                             new PostToConnectionCommand({
    //                                 ConnectionId: `${connection.itemID}`,
    //                                 Data: JSON.stringify({
    //                                     action: 'response',
    //                                     payload: {
    //                                         connectionID: `${connection.itemID}`,
    //                                         clientID: `${connection.clientID}`,
    //                                         inbound: inbound,
    //                                         // jwt: `${jwt}`,

    //                                         //
    //                                         // userID: `${userObject.userID}`,
    //                                         // username: `${userObject.username}`,
    //                                         // email: `${userObject.email}`,
    //                                     },
    //                                 }),
    //                             }),
    //                         )
    //                         .catch((r) => {
    //                             dyna.send(
    //                                 new DeleteItemCommand({
    //                                     TableName: Resource.ConnectionsTable.name,
    //                                     Key: {
    //                                         itemID: {
    //                                             S: `${connection.itemID}`,
    //                                         },
    //                                     },
    //                                 }),
    //                             )

    //                             console.error(r)
    //                         })
    //                 }
    //             }
    //         }
    //     })
}
