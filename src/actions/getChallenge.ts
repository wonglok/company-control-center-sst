'use server'
import { data2jwt } from '@/sst/ws/util/auth'
import { base64url } from 'jose'
import { Resource } from 'sst'

export async function getChallenge() {
    return base64url.encode(
        await data2jwt({
            payload: {
                challenge: 'challenge',
                timestamp: Date.now(),
            },
            secretKey: Resource.SESSION_SECRET.value,
        }),
    )
}
