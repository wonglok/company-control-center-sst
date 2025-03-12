import { LambdaFunctionURLEvent, LambdaFunctionURLHandler } from 'aws-lambda'
import http from 'serverless-http'
import { Resource } from 'sst'
import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import { DeleteItemCommand, DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb'
import { ApiGatewayManagementApiClient, PostToConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'

const token = Resource.TELEGRAM_BOT_TOKEN.value
const TELEGRAM_WEBHOOK_TOKEN = Resource.TELEGRAM_WEBHOOK_TOKEN.value
const bot = new Telegraf(token)

const dyna = new DynamoDBClient({
    region: process.env.SST_AWS_REGION,
})

let wss = new ApiGatewayManagementApiClient({
    region: process.env.SST_AWS_REGION,
    endpoint: Resource.SocketAPI.managementEndpoint,
})

bot.on(message('text'), async (ctx) => {
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
                //

                console.log(item)

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

            return bucket
        })
        .catch((err) => {
            console.log(err)
            return []
        })

    //

    // await ctx.reply(ctx.message.text)
})

let url = new URL(Resource.RestAPI.url)

export const seutpHook = (ctx: LambdaFunctionURLEvent) => {
    let data = JSON.parse((ctx.body as string) || '{}')
    if (data.token === TELEGRAM_WEBHOOK_TOKEN) {
        bot.createWebhook({
            domain: url.hostname,
            path: `/api/telegram/telegram/telegraf`,
            secret_token: TELEGRAM_WEBHOOK_TOKEN,
        })

        return {
            data: { success: true },
        }
    } else {
        return {
            data: { success: false },
        }
    }
}

// setup webhook
export const telegraf = http(
    bot.webhookCallback(`/api/telegram/telegram/telegraf`, { secretToken: TELEGRAM_WEBHOOK_TOKEN }),
)

//

//

//

//
