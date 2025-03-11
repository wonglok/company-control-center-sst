'use server'

import { Resource } from 'sst'
import { dyna } from '../dyna'
import { PutItemCommand } from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'

export const putConnectionToken = async ({ item }: { item: { itemID: string } | any }) => {
    await dyna.send(
        new PutItemCommand({
            TableName: Resource.ConnectionTokensTable.name,
            Item: marshall(item),
        }),
    )
}
