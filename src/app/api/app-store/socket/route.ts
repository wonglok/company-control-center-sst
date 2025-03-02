'server only'

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

export async function GET(req: NextRequest, ctx: any) {
    return new Response(
        JSON.stringify({
            socketURL: Resource.SocketAPI.url,
        }),
        {
            headers: getCorsHeaders(req.headers.get('origin') || '*'),
        },
    )
}
