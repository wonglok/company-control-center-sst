'use server'

import { getSessionJWT, jwt2data, jwt2jwtRefreshed } from '@/sst/ws/util/auth'
import { Resource } from 'sst'

export async function getMySelf() {
    let jwt = (await getSessionJWT()) as string

    let result = await jwt2data({ payload: jwt, secretKey: Resource.SESSION_SECRET.value })

    await jwt2jwtRefreshed({ jwt, secretKey: Resource.SESSION_SECRET.value })

    return result
}
