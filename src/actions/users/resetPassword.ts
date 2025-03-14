'use server'

import { Resource } from 'sst'
import { dyna } from '../dyna'
import { PutItemCommand } from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import { getMySelf } from '../getMySelf'
import { hashPassword } from '@/sst/ws/util/auth'

export const resetPassword = async ({ user, newPassword }: any) => {
    let myself = await getMySelf()

    if (!['admin'].includes(myself.role)) {
        throw new Error('not admin')
    }

    let pwhash = await hashPassword(newPassword)

    let obj = {
        ...user,
        passwordHash: pwhash,
    }

    await dyna.send(
        new PutItemCommand({
            TableName: Resource.UserTable.name,
            Item: marshall(obj),
        }),
    )

    return { ok: true }
}
