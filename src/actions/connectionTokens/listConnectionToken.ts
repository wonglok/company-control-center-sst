'use server'

import { Resource } from 'sst'
import { dyna } from '../dyna'
import { PutItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'

export const listConnectionToken = async () => {
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
