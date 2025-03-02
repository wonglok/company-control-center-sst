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

export async function loginAdmin(prevState: any, formData: FormData) {
    //

    console.log(formData.get('username'))

    const schema = z.object({
        username: z.string({
            required_error: 'Missing Username',
            invalid_type_error: 'Invalid Username',
        }),
        password: z.string({
            required_error: 'Missing Password',
            invalid_type_error: 'Invalid Password',
        }),
    })

    const validatedFields = schema.safeParse({
        username: formData.get('username'),
        password: formData.get('password'),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    let data = validatedFields.data

    if (data.password === '') {
        return {
            errors: {
                password: ['Missing Password'],
            },
        }
    }

    let found = await dyna
        .send(
            new ScanCommand({
                TableName: Resource.UserTable.name,
                FilterExpression: 'username = :username',
                ExpressionAttributeValues: {
                    ':username': { S: `${data.username}` },
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
        let ok = await comparePasswords(data.password, found.passwordHash)

        if (ok) {
            let jwt = await data2jwt({
                payload: {
                    //
                    userID: found.itemID,
                    username: found.username,
                    role: 'admin',
                    //
                },
                secretKey: Resource.SESSION_SECRET.value,
            })

            await createSessionByJWT({ jwt })

            return { ok: true, jwt }
        } else {
            return {
                errors: {
                    password: ['password not found'],
                },
            }
        }
    } else {
        return {
            errors: {
                username: ['user not found'],
            },
        }
    }
}
