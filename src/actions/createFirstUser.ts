'use server'

import { comparePasswords, createSessionByJWT, data2jwt, hashPassword } from '@/sst/ws/util/auth'
import { PutItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
// import { error } from 'console'
import { Resource } from 'sst'
import { v4 } from 'uuid'
import { z } from 'zod'
import { dyna } from './dyna'

export async function createFirstUser(prevState: any, formData: FormData) {
    //

    const schema = z.object({
        username: z.string({
            required_error: 'Missing Username',
            invalid_type_error: 'Invalid Username',
        }),
        password: z.string({
            required_error: 'Missing Password',
            invalid_type_error: 'Invalid Password',
        }),
        password2: z.string({
            required_error: 'Missing Confirm Password',
            invalid_type_error: 'Invalid Confirm Password',
        }),
    })

    //

    const validatedFields = schema.safeParse({
        username: formData.get('username'),
        password: formData.get('password'),
        password2: formData.get('password2'),
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

    if (data.password2 === '') {
        return {
            errors: {
                password2: ['Missing Confirm Password'],
            },
        }
    }

    if (data.password !== data.password2) {
        return {
            errors: {
                password: ['Password Not Match'],
                password2: ['Password Not Match'],
            },
        }
    }

    let count =
        (await dyna
            .send(
                new ScanCommand({
                    TableName: Resource.UserTable.name,
                    // FilterExpression: 'username = :username',
                    // FilterExpression: '',
                    // ExpressionAttributeValues: {
                    //     // ':username': { S: `${data.username}` },
                    // },
                    Select: 'COUNT',
                }),
            )
            .then((r: any) => r.Count)) || false

    if (count && count > 0) {
        return {
            errors: {
                username: ['admin is created'],
            },
        }
    }

    let pwhash = await hashPassword(data.password)

    let obj = {
        role: 'admin',
        itemID: `${v4()}`,
        username: data.username,
        passwordHash: pwhash,
    }

    await dyna.send(
        new PutItemCommand({
            TableName: Resource.UserTable.name,
            Item: marshall(obj),
        }),
    )

    //
    let jwt = await data2jwt({
        payload: {
            //
            userID: obj.itemID,
            username: data.username,
            role: 'admin',
            //
        },
        secretKey: Resource.SESSION_SECRET.value,
    })

    await createSessionByJWT({ jwt })

    return { ok: true, jwt }
}
