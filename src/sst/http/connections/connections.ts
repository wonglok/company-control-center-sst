import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { LambdaFunctionURLEvent } from 'aws-lambda'
import { Resource } from 'sst'

import { v4 } from 'uuid'
import md5 from 'md5'

const SESSION_SECRET = process.env.SESSION_SECRET || ''

export const getOnlineClients = async (event: LambdaFunctionURLEvent) => {
    //
    //

    return {
        //
        //
    }
}
