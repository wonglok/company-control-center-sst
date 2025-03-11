'use client'

import { redirect } from 'next/navigation'
import { logout } from '@/actions/logout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faDoorOpen, faDotCircle, faHamburger, faMobileButton } from '@fortawesome/free-solid-svg-icons'
import { Dashboard } from '../_ui/Dashboard/Dashboard'
// import { ConnectedSockets } from '@/app/app/_ui/ConnectedSockets/ConnectedSockets'
// import { Suspense } from 'react'
// import { Skeleton } from '@/components/ui/skeleton'

export function AppPage({
    config,
    user,
    jwt,
}: {
    config: { socketURL: string; restURL: string }
    user: any
    jwt: string
}) {
    //
    return (
        <>
            <Dashboard title={`Client Connections`}>
                <div className='grid gap-4 md:grid-cols-2 auto-rows-min'>
                    <div className='rounded-xl bg-muted/50'>Client Connections</div>
                    <div className='rounded-xl bg-muted/50'>Client Connections</div>
                </div>
            </Dashboard>
        </>
    )
}
