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
import { CreateNewUser } from './CreateNewUser/CreateNewUser'

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
                <div className='grid gap-4 md:grid-cols-2 auto-rows-min'>
                    <div className='rounded-xl bg-muted/50'>
                        <AddFingerPrint user={user} jwt={jwt}></AddFingerPrint>
                    </div>
                    <div className='rounded-xl bg-muted/50'>
                        <CreateNewUser />
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
