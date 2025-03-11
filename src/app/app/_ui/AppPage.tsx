'use client'

import { redirect } from 'next/navigation'
import { logout } from '@/actions/logout'
import { AddFingerPrint } from './AddFingerPrint/AddFingerPrint'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faDoorOpen, faDotCircle, faHamburger, faMobileButton } from '@fortawesome/free-solid-svg-icons'
// import { ConnectedSockets } from '@/app/app/_ui/ConnectedSockets/ConnectedSockets'
// import { Suspense } from 'react'
import { ListConnectors } from './ListConnectors/ListConnectors'
// import { Skeleton } from '@/components/ui/skeleton'
import { AddConnector } from './ListConnectors/AddConnector'
import { Dashboard } from './Dashboard/Dashboard'

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
            <Dashboard>
                <div className='grid auto-rows-min gap-4 md:grid-cols-3'>
                    <div className='rounded-xl bg-muted/50'>
                        <AddFingerPrint user={user} jwt={jwt}></AddFingerPrint>
                    </div>
                    <div className='rounded-xl bg-muted/50'>
                        <AddConnector />
                    </div>
                    <div className='rounded-xl bg-muted/50'>
                        <ListConnectors />
                    </div>
                </div>
            </Dashboard>
        </>
    )
}
