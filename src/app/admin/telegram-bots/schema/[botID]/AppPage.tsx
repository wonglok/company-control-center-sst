'use client'

import { Dashboard } from '@/app/admin/_ui/Dashboard/Dashboard'
import { useBot } from './useBot'
import { useEffect } from 'react'
import { getTelegramBot } from '@/actions/telegram/getTelegramBot'
import { BotType } from '../../_ui/ManageBots/ManageBots'
import { BotSchema } from '../../_ui/ManageBots/BotSchema'

// import { ConnectedSockets } from '@/app/app/_ui/ConnectedSockets/ConnectedSockets'
// import { Suspense } from 'react'
// import { Skeleton } from '@/components/ui/skeleton'

export function AppPage({
    botID,
    config,
    user,
    jwt,
}: {
    botID: string
    config: { socketURL: string; restURL: string }
    user: any
    jwt: string
}) {
    //

    let bot = useBot((r) => r.bot)

    useEffect(() => {
        getTelegramBot({ item: { itemID: botID } }).then((data) => {
            if (data) {
                useBot.setState({ bot: data as BotType })
            }
        })
    }, [botID])

    return (
        <>
            <Dashboard title={`Telegram Bots`}>
                <div className='grid gap-4 md:grid-cols-1 auto-rows-min'>
                    <div className='rounded-xl bg-muted/50'>
                        {bot && <BotSchema bot={bot}></BotSchema>}
                        {/* <pre className='text-xs'>{JSON.stringify(bot, null, '  ')}</pre> */}
                    </div>
                </div>
            </Dashboard>
        </>
    )
}

//
