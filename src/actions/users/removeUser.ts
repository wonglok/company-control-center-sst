'use server'

import { Resource } from 'sst'
import { dyna } from '../dyna'
import { DeleteItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import { getMySelf } from '../getMySelf'

export const removeUser = async ({ item }: any) => {
    let user = await getMySelf()

    if (!['admin'].includes(user.role)) {
        throw new Error('not admin')
    }

    return await dyna
        .send(
            new DeleteItemCommand({
                TableName: Resource.UserTable.name,
                Key: marshall({
                    itemID: item.itemID,
                }),
            }),
        )
        .then((r) => {
            return { ok: true }
            // return r.Items?.map((r) => unmarshall(r)).map((r) => {
            //     let rr = {
            //         ...r,
            //     }
            //     delete rr['passwordHash']
            //     console.log(rr)
            //     return rr
            // })
        })
}
