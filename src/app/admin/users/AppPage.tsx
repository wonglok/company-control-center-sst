'use client'

import { Dashboard } from '../_ui/Dashboard/Dashboard'
import { AllUsers } from './_ui/AllUsers/AllUsers'
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
                <div className='grid gap-4 md:grid-cols-1 auto-rows-min'>
                    <div className='rounded-xl bg-muted/50'>
                        <AllUsers></AllUsers>
                    </div>
                </div>
            </Dashboard>
        </>
    )
}

//
