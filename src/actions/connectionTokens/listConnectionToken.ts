'use server'

import { Resource } from 'sst'
import { dyna } from '../dyna'
import { ScanCommand } from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import { getMySelf } from '../getMySelf'

export const listConnectionToken = async () => {
    let user = await getMySelf()

    if (!['admin'].includes(user.role)) {
        throw new Error('not admin')
    }

    return await dyna
        .send(
            new ScanCommand({
                TableName: Resource.ConnectionTokensTable.name,
            }),
        )
        .then((r) => {
            return r.Items?.map((r) => unmarshall(r))
        })
}
