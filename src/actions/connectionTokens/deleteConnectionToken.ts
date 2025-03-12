'use server'

import { Resource } from 'sst'
import { dyna } from '../dyna'
import { DeleteItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import { getMySelf } from '../getMySelf'

export const deleteConnectionToken = async ({ item }: { item: { itemID: string } | any }) => {
    let user = await getMySelf()

    if (!['admin'].includes(user.role)) {
        throw new Error('not admin')
    }

    await dyna.send(
        new DeleteItemCommand({
            TableName: Resource.ConnectionTokensTable.name,
            Key: marshall({ itemID: item.itemID }),
        }),
    )
}
