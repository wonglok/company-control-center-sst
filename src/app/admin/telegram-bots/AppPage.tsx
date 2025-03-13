'use client'

import { Dashboard } from '../_ui/Dashboard/Dashboard'
import { CreateBot } from './_ui/CreateBot/CreateBot'
import { ManageBots } from './_ui/ManageBots/ManageBots'
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
            <Dashboard title={`Telegram Bots`}>
                <div className='grid gap-4 md:grid-cols-1 auto-rows-min'>
                    <div className='rounded-xl bg-muted/50'>
                        <div className='mb-3'>
                            <CreateBot></CreateBot>
                        </div>
                        <ManageBots jwt={jwt} config={config}></ManageBots>
                    </div>
                </div>
            </Dashboard>
        </>
    )
}

//
