'use client'

import { redirect } from 'next/navigation'
import { logout } from '@/actions/logout'
import { AddFingerPrint } from './AddFingerPrint'

export function AppPage({ user, jwt }: { user: any; jwt: string }) {
    return (
        <>
            <AddFingerPrint user={user} jwt={jwt}></AddFingerPrint>

            <button
                onClick={() => {
                    logout().then(() => {
                        redirect('/')
                    })
                }}
            >
                Logout
            </button>
        </>
    )
}
