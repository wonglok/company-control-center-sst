'use client'

import { Dashboard } from '../_ui/Dashboard/Dashboard'
import { AllConnections } from './_ui/AllConnections/AllConnections'
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
                        <AllConnections></AllConnections>
                    </div>
                </div>
            </Dashboard>
        </>
    )
}
