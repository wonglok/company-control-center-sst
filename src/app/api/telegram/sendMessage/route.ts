'server only'
import { dyna } from '@/actions/dyna'
import { jwt2data } from '@/sst/ws/util/auth'
import { AttributeValue, ScanCommand } from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import axios from 'axios'

// import mongoose from 'mongoose'
// import { jwt2data } from '@/app/api/_model/sesion'

// const ALL_MONGOS = {
//     production: process.env.MONGODB_PRODUCTION || '',
//     preview: process.env.MONGODB_PREVIEW || '',
//     development: process.env.MONGODB_DEVELOPMENT || '',
// }
// const CURRENT_MONGO = ALL_MONGOS[process.env.NODE_ENV] || ALL_MONGOS.preview
const SESSION_SECRET = process.env.SESSION_SECRET || ''

// Imports
// ========================================================
import { NextResponse, type NextRequest } from 'next/server'
import { Resource } from 'sst'
// Config CORS
// ========================================================
/**
 *
 * @param origin
 * @returns
 */
const getCorsHeaders = (origin: string) => {
    // Default options
    const headers = {
        'Access-Control-Allow-Methods': `GET, POST, PUT, DELETE, OPTIONS`,
        'Access-Control-Allow-Headers': `Content-Type, Authorization, token`,
        'Access-Control-Allow-Origin': `${origin || '*'}`,
    }

    return headers
}

// ========================================================
// Endpoints
// ========================================================
/**
 * Basic OPTIONS Request to simuluate OPTIONS preflight request for mutative requests
 */
export const OPTIONS = async (request: NextRequest) => {
    // Return Response
    let origin = request.headers.get('origin') || ''

    console.log('origin', origin)

    return new Response('ok', {
        status: 200,
        headers: getCorsHeaders(origin),
    })
}

// let mongoosePromise = mongoose.connect(CURRENT_MONGO)

export async function POST(req: NextRequest, ctx: any) {
    let json = await req.json()

    const { name, email, message, clientID } = json

    let results = await dyna
        .send(
            new ScanCommand({
                TableName: Resource.ConnectionTokensTable.name,
                FilterExpression: 'itemID = :itemID',
                ExpressionAttributeValues: {
                    ':itemID': { S: `${clientID}` },
                },
            }),
        )
        .then((r) => {
            return r.Items?.map((r) => unmarshall(r)) || []
        })
        .catch((r) => {
            console.error(r)
            return []
        })

    if (results?.length === 0) {
        return new Response(
            JSON.stringify({
                success: false,
                message: 'bad auth',
            }),
            {
                status: 500,
                headers: getCorsHeaders(req.headers.get('origin') || '*'),
            },
        )
    }

    // Replace with your actual bot token and chat ID
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`

    const text = `
        New message from ${name} \n
        Email: ${email} \n
        Message: ${message}
    `

    try {
        // Send the message via the Telegram Bot API
        const response = await axios.post(telegramUrl, {
            chat_id: chatId,
            text: text,
        })

        if (response.data.ok) {
            return new Response(
                JSON.stringify({
                    success: true,
                    message: 'Message sent successfully!',
                }),
                {
                    status: 200,
                    headers: getCorsHeaders(req.headers.get('origin') || '*'),
                },
            )
        } else {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: 'Failed to send message.',
                }),
                {
                    status: 500,
                    headers: getCorsHeaders(req.headers.get('origin') || '*'),
                },
            )
        }
    } catch (error) {
        console.error('Error sending message to Telegram:', error)
        return new Response(
            JSON.stringify({
                success: false,
                message: 'Error sending message.',
            }),
            {
                status: 500,
                headers: getCorsHeaders(req.headers.get('origin') || '*'),
            },
        )
    }
}
