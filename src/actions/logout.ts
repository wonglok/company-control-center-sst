'use server'
import { closeSession } from '@/sst/ws/util/auth'

export async function logout() {
    await closeSession()
}
