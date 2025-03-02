import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

export const dyna = new DynamoDBClient({
    region: process.env.SST_AWS_REGION,
})
