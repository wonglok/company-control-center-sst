import { LambdaFunctionURLEvent, LambdaFunctionURLHandler } from 'aws-lambda'
import http from 'serverless-http'
import { Resource } from 'sst'
import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import { DeleteItemCommand, DynamoDBClient, GetItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb'
import { ApiGatewayManagementApiClient, PostToConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import axios from 'axios'
import { jwt2data } from '@/sst/ws/util/auth'

const dyna = new DynamoDBClient({
    region: process.env.SST_AWS_REGION,
})

let wss = new ApiGatewayManagementApiClient({
    region: process.env.SST_AWS_REGION,
    endpoint: Resource.SocketAPI.managementEndpoint,
})

let url = new URL(Resource.RestAPI.url)

let getBot = (BOT_TOKEN: string) => {
    const bot = new Telegraf(BOT_TOKEN)
    return bot
}

//////////////////////// eachbot ////////////////////////
//////////////////////// eachbot ////////////////////////
//////////////////////// eachbot ////////////////////////
//////////////////////// eachbot ////////////////////////
//////////////////////// eachbot ////////////////////////
//////////////////////// eachbot ////////////////////////
//////////////////////// eachbot ////////////////////////
//////////////////////// eachbot ////////////////////////
//////////////////////// eachbot ////////////////////////

export const getBotHook = async (event: LambdaFunctionURLEvent, context: any) => {
    let botID = event?.pathParameters?.botID || ''
    let itemID = botID
    let botData = JSON.parse((event.body as string) || '{}')

    let jwt = botData.jwt

    let user = await jwt2data({
        payload: jwt,
        secretKey: Resource.SESSION_SECRET.value,
    })
    if (!['admin'].includes(user.role)) {
        throw new Error('not admin')
    }

    return fetch(`https://api.telegram.org/bot${botData.botToken}/getWebhookInfo`, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({
            //
        }),
    })
        .then(async (r) => {
            return await r.json()
        })
        .then((r) => {
            /*
        {
            ok: true,
            result: {
                url: 'https://8jx59bs3fc.execute-api.us-west-1.amazonaws.com/api/telegram/telegram/platformHook/a3ab2959-0258-47d5-a0fb-a5f87db45a39',
                has_custom_certificate: false,
                pending_update_count: 3,
                last_error_date: 1741856577,
                last_error_message: 'Wrong response from the webhook: 403 Forbidden',
                max_connections: 40,
                ip_address: '50.18.130.45'
            }
        }
        */
            return r
        })
}

export const setupBotHook = async (event: LambdaFunctionURLEvent, context: any) => {
    let botID = event?.pathParameters?.botID || ''
    let itemID = botID
    let botData = JSON.parse((event.body as string) || '{}')

    let jwt = botData.jwt

    let user = await jwt2data({
        payload: jwt,
        secretKey: Resource.SESSION_SECRET.value,
    })
    if (!['admin'].includes(user.role)) {
        throw new Error('not admin')
    }

    /*
    {
        botUserName: '',
        displayName: '',
        botToken: '',
        chatID: '703086702',
        itemID: '',
        aiDevice: '',
        webhookToken: '',
        jwt: ''
    }
    */

    if (botData.itemID === itemID) {
        let bot = await getBot(botData.botToken)

        await bot.createWebhook({
            domain: url.hostname,
            path: `/api/telegram/telegram/platformHook/${botData.itemID}`,
            secret_token: botData.webhookToken,
        })

        return {
            success: true,
        }
    } else {
        return {
            success: false,
        }
    }
}

// setup webhook
export const platformHook = async (event: LambdaFunctionURLEvent, context: any) => {
    let secretToken = event.headers['x-telegram-bot-api-secret-token']

    let botID = event?.pathParameters?.botID || ''
    let itemID = botID

    let botData = await dyna
        .send(
            new GetItemCommand({
                TableName: Resource.TelegramBotTable.name,
                Key: marshall({
                    itemID: itemID,
                }),
            }),
        )
        .then((r) => {
            if (!r.Item) {
                return
            }
            return unmarshall(r?.Item)
        })

    if (!botData) {
        throw new Error('result')
    }

    /*
    
    {
|  +6ms          botUserName: '',
|  +6ms          displayName: '',
|  +6ms          botToken: '
',
|  +6ms          chatID: '703086702',
|  +6ms          itemID: '',
|  +6ms          aiDevice: '',
|  +6ms          webhookToken: '',
|  +6ms          jwt: ''
|  +6ms        }

    */

    console.log('secretToken', secretToken)

    console.log('botData.aiDevice', botData.aiDevice)

    //
    let bot = await getBot(botData.botToken)

    bot.on(message('text'), async (ctx) => {
        //

        let results: any[] = await dyna
            .send(
                new ScanCommand({
                    TableName: Resource.ConnectionsTable.name,
                    FilterExpression: 'clientID = :clientID',
                    ExpressionAttributeValues: {
                        ':clientID': { S: `${botData.aiDevice}` },
                    },
                    //
                    //
                    // FilterExpression: '',
                }),
            )
            .then((r) => r.Items?.map((item) => unmarshall(item)))
            .then(async (data: any) => {
                let bucket: any[] = []
                for (let item of data) {
                    //

                    console.log(' item.clientID', item.clientID)
                    console.log(item)
                    //

                    if (item.clientID === botData.aiDevice) {
                        console.log('matched!!!!!!!!')
                        console.log('matched!!!!!!!!')
                        console.log('matched!!!!!!!!')
                        console.log('matched!!!!!!!!')
                        console.log('matched!!!!!!!!')
                        console.log('matched!!!!!!!!')

                        await wss
                            .send(
                                new PostToConnectionCommand({
                                    ConnectionId: item.itemID,
                                    Data: JSON.stringify({
                                        type: 'telegram_message',
                                        payload: {
                                            //
                                            message: ctx.message,
                                        },
                                    }),
                                }),
                            )
                            .then(() => {
                                bucket.push(item)
                            })
                            .catch(async (r) => {
                                //

                                //

                                //

                                await dyna.send(
                                    new DeleteItemCommand({
                                        TableName: Resource.ConnectionsTable.name,
                                        Key: marshall({
                                            itemID: item.itemID,
                                        }),
                                    }),
                                )
                            })
                    }
                }

                return bucket
            })
            .catch((err) => {
                console.log(err)
                return []
            })

        //

        // await ctx.reply(ctx.message.text)
    })

    return await http(
        bot.webhookCallback(`/api/telegram/telegram/platformHook/${botData.itemID}`, { secretToken: secretToken }),
    )(event, context)
}

//

//

//////////////////////// eachbot ////////////////////////
//////////////////////// eachbot ////////////////////////
//////////////////////// eachbot ////////////////////////
//////////////////////// eachbot ////////////////////////
//////////////////////// eachbot ////////////////////////
//////////////////////// eachbot ////////////////////////
//////////////////////// eachbot ////////////////////////
//////////////////////// eachbot ////////////////////////
//////////////////////// eachbot ////////////////////////

// //

// //

// export const seutpHook = async (ctx: LambdaFunctionURLEvent) => {
//     let data = JSON.parse((ctx.body as string) || '{}')

//     if (data.token) {
//         let bot = await getBot(Resource.TELEGRAM_BOT_TOKEN.value)

//         bot.createWebhook({
//             domain: url.hostname,
//             path: `/api/telegram/telegram/telegraf`,
//             secret_token: data.token,
//         })

//         return {
//             data: { success: true },
//         }
//     } else {
//         return {
//             data: { success: false },
//         }
//     }
// }

// // setup webhook
// export const telegraf = async (event: any, context: any) => {
//     let secretToken = event.headers['x-telegram-bot-api-secret-token']

//     console.log('secretToken', secretToken)

//     //
//     let bot = await getBot(Resource.TELEGRAM_BOT_TOKEN.value)

//     bot.on(message('text'), async (ctx) => {
//         //

//         let results: any[] = await dyna
//             .send(
//                 new ScanCommand({
//                     TableName: Resource.ConnectionsTable.name,
//                     ScanFilter: {},
//                 }),
//             )
//             .then((r) => r.Items?.map((item) => unmarshall(item)))
//             .then(async (data: any) => {
//                 let bucket: any[] = []
//                 for (let item of data) {
//                     //

//                     console.log(item)

//                     await wss
//                         .send(
//                             new PostToConnectionCommand({
//                                 ConnectionId: item.itemID,
//                                 Data: JSON.stringify({
//                                     type: 'telegram_message',
//                                     payload: {
//                                         //
//                                         message: ctx.message,
//                                     },
//                                 }),
//                             }),
//                         )
//                         .then(() => {
//                             bucket.push(item)
//                         })
//                         .catch(async (r) => {
//                             //

//                             //

//                             //

//                             await dyna.send(
//                                 new DeleteItemCommand({
//                                     TableName: Resource.ConnectionsTable.name,
//                                     Key: marshall({
//                                         itemID: item.itemID,
//                                     }),
//                                 }),
//                             )
//                         })
//                 }

//                 return bucket
//             })
//             .catch((err) => {
//                 console.log(err)
//                 return []
//             })

//         //

//         // await ctx.reply(ctx.message.text)
//     })

//     return await http(bot.webhookCallback(`/api/telegram/telegram/telegraf`, { secretToken: secretToken }))(
//         event,
//         context,
//     )
// }
