'use server'

import { jwt2data } from '@/sst/ws/util/auth'
import { verifyRegistration } from '@passwordless-id/webauthn/dist/esm/server'
import { base64url } from 'jose'
import { Resource } from 'sst'
import { dyna } from './dyna'
import { PutItemCommand } from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import { v4 } from 'uuid'

export const addPasskeyToAccount = async ({
    jwt,
    info,
    challenge,
    origin,
}: {
    jwt: string
    info: any
    origin: string
    challenge: string
}) => {
    //
    let originalChallenge: string = new TextDecoder().decode(base64url.decode(challenge))

    let data = await jwt2data({ payload: originalChallenge, secretKey: Resource.SESSION_SECRET.value })

    if (data.challenge === 'challenge') {
        let result = await verifyRegistration(info, {
            origin: origin,
            challenge: challenge,
        })

        let credential = result.credential

        let user = await jwt2data({ payload: jwt, secretKey: Resource.SESSION_SECRET.value })

        await dyna.send(
            new PutItemCommand({
                TableName: Resource.CredentialTable.name,
                Item: marshall({
                    itemID: `${v4()}`,
                    userID: user.userID,
                    credential: credential,
                }),
            }),
        )

        return { ok: true }
    } else {
        return { ok: false }
    }
}
