import { SignJWT, jwtVerify } from 'jose'
import { scrypt, randomBytes, timingSafeEqual } from 'crypto'
import { promisify } from 'util'
import { cookies } from 'next/headers'

const scryptAsync = promisify(scrypt)

export async function hashPassword(password: string) {
    const salt = randomBytes(16).toString('hex')
    const buf = (await scryptAsync(password, salt, 64)) as Buffer
    return `${buf.toString('hex')}.${salt}`
}

export async function comparePasswords(supplied: string, stored: string) {
    const [hashed, salt] = stored.split('.')
    const hashedBuf = Buffer.from(hashed, 'hex')
    const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer
    return timingSafeEqual(hashedBuf, suppliedBuf)
}

export async function encrypt(payload: any, secretKey: string) {
    const encodedKey = new TextEncoder().encode(secretKey)

    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('500 years')
        .sign(encodedKey)
}

export async function decrypt(str: string, secretKey: string) {
    const encodedKey = new TextEncoder().encode(secretKey)

    try {
        const { payload } = await jwtVerify(`${str}`, encodedKey, {
            // algorithms: ["HS256"],
        })
        return payload
    } catch (error) {
        console.log(error, 'Failed to verify session')
    }
}

export async function jwt2data({ payload, secretKey }: { payload: string; secretKey: string }) {
    const data: any = await decrypt(payload, secretKey)
    return data
}

export async function data2jwt({ payload, secretKey }: { payload: any; secretKey: string }) {
    const jwt: string = await encrypt(payload, secretKey)
    return jwt
}

export async function jwt2jwtRefreshed({ jwt, secretKey }: { jwt: string; secretKey: string }) {
    const payload = await decrypt(jwt, secretKey)

    const jwt2 = await encrypt(payload, secretKey)
    return jwt2
}

export async function createSessionByJWT({ jwt }: { jwt: string }) {
    const cookieStore = await cookies()

    cookieStore.set('session', jwt, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
    })
}

export async function closeSession() {
    const cookieStore = await cookies()
    cookieStore.delete('session')
}
