import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { LambdaFunctionURLEvent } from 'aws-lambda'
import { Resource } from 'sst'

// import { jwt2data } from '../auth/lib/session'
// import { checkAdminUsername } from "../auth/lib/admins";
// import { marshall } from "@aws-sdk/util-dynamodb";

import { v4 } from 'uuid'
import md5 from 'md5'

const SESSION_SECRET = process.env.SESSION_SECRET || ''

const CURRENT_STAGE = process.env.CURRENT_STAGE || 'debug'
//
const s3 = new S3Client({})

export const signGenericFile = async (event: LambdaFunctionURLEvent | any) => {
    const install = event.headers['install']

    // const data = await jwt2data({ payload: jwt, secretKey: SESSION_SECRET })

    // if (!data || !data.username || !data.userID) {
    //     throw { error: 'bad-jwt' }
    // }

    // ===============
    // can insert check code here if you stored the install.....
    // ===============

    // works
    // const fileKey = `/uploads/ai-respond/${CURRENT_STAGE}/${md5(`${install}`)}/${v4()}`

    // cleaner
    const fileKey = `ai-respond/${CURRENT_STAGE}/${md5(`${install}`)}/${v4()}`

    const cmd = new PutObjectCommand({
        Key: fileKey,
        Bucket: Resource.AppDataBucket.name,
    })

    const cdn = Resource.AppDataCDN.url

    const uploadURL = await getSignedUrl(s3, cmd)

    // const accessURL = await getSignedUrl(
    //     s3,
    //     new GetObjectCommand({
    //         Key: fileKey,
    //         Bucket: Resource.AppDataBucket.name,
    //     }),
    // )

    return {
        bucket: s3.config.endpoint,
        // accessURL,
        fileURL: `${cdn}/${fileKey}`,
        fileKey,
        cdn,
        uploadURL,
    }
}

export const removeUserGenericFile = async (event: LambdaFunctionURLEvent | any) => {
    let install = event.headers['install']

    // let data = await jwt2data({ payload: jwt, secretKey: SESSION_SECRET })

    // if (!data || !data.username || !data.userID) {
    //     throw { error: 'bad-jwt' }
    // }

    let inbound = JSON.parse((event.body as string) || '{}')

    // ===============
    // can insert check code here if you stored the install.....
    // ===============

    let fileKey = inbound.fileKey

    const cmd = new DeleteObjectCommand({
        Key: fileKey,
        Bucket: Resource.AppDataBucket.name,
    })

    await s3.send(cmd)

    //

    // const cdn = Resource.MyCDN.url;

    // const url = await getSignedUrl(s3, cmd);

    //
    return {
        // fileKey,
        // cdn,
        // url,
    }
}

// export const getFileLink = async (event: LambdaFunctionURLEvent | any) => {
//     // let install = event.headers['install']
//     let fileKey = event.queryStringParameters.query

//     // let data = await jwt2data({ payload: jwt, secretKey: SESSION_SECRET })

//     // if (!data || !data.username || !data.userID) {
//     //     throw { error: 'bad-jwt' }
//     // }

//     // let inbound = JSON.parse((event.body as string) || '{}')

//     // ===============
//     // can insert check code here if you stored the install.....
//     // ===============

//     // let fileKey = inbound.fileKey

//     const cmd = new GetObjectCommand({
//         Key: fileKey,
//         Bucket: Resource.AppDataBucket.name,
//     })

//     const url = await getSignedUrl(s3, cmd)

//     return url
// }
