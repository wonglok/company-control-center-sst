'use client'

import { Dashboard } from '@/app/admin/_ui/Dashboard/Dashboard'
import { useFlow } from './useFlow'
import { useEffect } from 'react'
import { getTelegramBot } from '@/actions/telegram/getTelegramBot'
import { BotType } from '../../_ui/ManageBots/ManageBots'
import Link from 'next/link'
import { Editor } from './Editor'
// import { SidebarRight } from '@/components/sidebar-right'

// import { ConnectedSockets } from '@/app/app/_ui/ConnectedSockets/ConnectedSockets'
// import { Suspense } from 'react'
// import { Skeleton } from '@/components/ui/skeleton'
// import { DndContext } from '@dnd-kit/core'
// import { SortableUI } from '../_ui/SortableUI/SortableUI'

import tunnel from 'tunnel-rat'

const tn = tunnel()
export const BotEditorIn = ({ children }: any) => {
    return <tn.In>{children}</tn.In>
}

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

    // let bot = useFlow((r) => r.bot)

    // useEffect(() => {
    //     getTelegramBot({ item: { itemID: botID } }).then((data) => {
    //         if (data) {
    //             useFlow.setState({ bot: data as BotType })
    //         }
    //     })
    // }, [botID])

    return (
        <>
            <Dashboard
                title={
                    <>
                        <Link href={'/admin/telegram-bots'}>Telegram Bots</Link>
                    </>
                }
                title2={<>{`Editor`}</>}
                // sidebar={<SidebarRight side='right' />}
            >
                <div className='w-full h-full bg-gray-200 rounded-xl  relative'>
                    {/* <SortableUI></SortableUI> */}
                    <Editor></Editor>

                    {/*  */}
                    <tn.Out></tn.Out>
                </div>
            </Dashboard>
        </>
    )
}

//
