'use server'

import { ScanCommand } from '@aws-sdk/client-dynamodb'
import { Resource } from 'sst'
import { dyna } from './dyna'

export async function getAppMode() {
    let count = await dyna
        .send(
            new ScanCommand({
                TableName: Resource.UserTable.name,
                // FilterExpression: 'username = :username',
                // FilterExpression: '',
                // ExpressionAttributeValues: {
                //     // ':username': { S: `${data.username}` },
                // },
                ScanFilter: {},
                Select: 'COUNT',
            }),
        )
        .then((r: any) => r.Count)
        .catch((r) => {
            console.log(r)
            return 'unknown'
        })

    if (count === 0) {
        return 'oobe'
    } else {
        return 'app'
    }
}
