'use server'

import { Resource } from 'sst'
import { dyna } from '../dyna'
import { PutItemCommand } from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import { getMySelf } from '../getMySelf'

export const putTelegramBot = async ({ item }: { item: { itemID: string } | any }) => {
    let user = await getMySelf()

    if (!['admin'].includes(user.role)) {
        throw new Error('not admin')
    }

    await dyna.send(
        new PutItemCommand({
            TableName: Resource.TelegramBotTable.name,
            Item: marshall(item, {
                convertClassInstanceToMap: true,
            }),
        }),
    )
}
