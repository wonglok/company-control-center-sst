'use server'

import { createSessionByJWT, data2jwt, jwt2data } from '@/sst/ws/util/auth'
import { server } from '@passwordless-id/webauthn'
import { base64url } from 'jose'
import { Resource } from 'sst'
import { dyna } from './dyna'
import { ScanCommand } from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'

export async function verifyLoginPasskey({ username, challenge, origin, pubKeyCred }: any) {
    let originalChallenge: string = new TextDecoder().decode(base64url.decode(challenge))

    let data = await jwt2data({ payload: originalChallenge, secretKey: Resource.SESSION_SECRET.value })

    if (data.challenge === 'challenge') {
        //

        let user = await dyna
            .send(
                new ScanCommand({
                    TableName: Resource.UserTable.name,
                    FilterExpression: 'username = :username',
                    ExpressionAttributeValues: {
                        ':username': { S: `${username}` },
                    },
                }),
            )
            .then((r) => r.Items?.[0] || undefined)
            .then((r) => {
                if (r) {
                    return unmarshall(r)
                }
            })

        if (user) {
            let creds = await dyna
                .send(
                    new ScanCommand({
                        TableName: Resource.CredentialTable.name,
                        FilterExpression: 'userID = :userID',
                        ExpressionAttributeValues: {
                            ':userID': { S: `${user.itemID}` },
                        },
                    }),
                )
                .then((r) => {
                    return r.Items?.map((r) => unmarshall(r))
                })

            let credObject: any = creds?.find((r) => `${r.credential.id}` === `${pubKeyCred.id}`)

            console.log(credObject)

            await server.verifyAuthentication(pubKeyCred, credObject.credential, {
                origin: origin,
                challenge: challenge,
                userVerified: true,
            })

            let jwt = await data2jwt({
                payload: {
                    role: user.role,
                    userID: user.itemID,
                    username: user.username,
                },
                secretKey: Resource.SESSION_SECRET.value,
            })

            await createSessionByJWT({ jwt })

            return {
                ok: true,
            }
        }

        //
    }

    return
}
