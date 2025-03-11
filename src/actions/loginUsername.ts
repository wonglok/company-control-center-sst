'use server'

import { comparePasswords, createSessionByJWT, data2jwt, hashPassword } from '@/sst/ws/util/auth'
import { PutItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
// import { error } from 'console'
import { Resource } from 'sst'
import { v4 } from 'uuid'
import { z } from 'zod'
import { dyna } from './dyna'
import { cookies } from 'next/headers'

export async function loginUsername(prevState: any, formData: FormData) {
    //

    const schema = z.object({
        username: z.string({
            required_error: 'Missing Username',
            invalid_type_error: 'Invalid Username',
        }),
    })

    const validatedFields = schema.safeParse({
        username: formData.get('username')?.toString()?.toLowerCase(),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    let data = validatedFields.data

    let found = await dyna
        .send(
            new ScanCommand({
                TableName: Resource.UserTable.name,
                FilterExpression: 'username = :username',
                ExpressionAttributeValues: {
                    ':username': { S: `${data.username?.toString()?.toLowerCase()}` },
                },
            }),
        )
        .then((r) => r.Items?.[0] || undefined)
        .then((r) => {
            if (r) {
                return unmarshall(r)
            }
        })

    if (found) {
        let result = dyna.send(
            new ScanCommand({
                TableName: Resource.CredentialTable.name,
                FilterExpression: 'userID = :userID',
                ExpressionAttributeValues: {
                    ':userID': { S: `${found.itemID}` },
                },
            }),
        )

        let results = (await result.then((r) => r.Items?.map((r) => unmarshall(r)))) || []

        let credIDs = results?.map((r) => {
            return r.credential?.id
        })

        let hasPasskey = await result
            .then((r) => (r?.Count || 0) > 0)
            .catch((r) => {
                console.log(r)
                return false
            })

        return { hasPasskey, checkedUsername: true, credIDs, username: data.username }
    } else {
        return {
            errors: {
                username: ['user not found'],
            },
        }
    }
}
