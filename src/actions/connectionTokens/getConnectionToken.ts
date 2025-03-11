'use server'

import { Resource } from 'sst'
import { dyna } from '../dyna'
import { GetItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'

export const putConnectionToken = async ({ item }: { item: { itemID: string } | any }) => {
    await dyna.send(
        new GetItemCommand({
            TableName: Resource.ConnectionTokensTable.name,
            Key: marshall({
                itemID: item.itemID,
            }),
        }),
    )
}
