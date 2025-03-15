'use server'

import { Resource } from 'sst'
import { dyna } from '../dyna'
import { GetItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import { getMySelf } from '../getMySelf'

export const getTelegramBot = async ({ item }: { item: { itemID: string } | any }) => {
    let user = await getMySelf()

    if (!['admin'].includes(user.role)) {
        throw new Error('not admin')
    }

    return await dyna
        .send(
            new GetItemCommand({
                TableName: Resource.TelegramBotTable.name,
                Key: marshall({
                    itemID: item.itemID,
                }),
            }),
        )
        .then((r) => {
            if (r.Item) {
                return unmarshall(r.Item)
            }
        })
}
