import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BotType } from './ManageBots'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormSchema } from '../CreateBot/CreateBot'
import { array, z } from 'zod'
import { useEffect, useRef, useState } from 'react'
import { listConnectionToken } from '@/actions/connectionTokens/listConnectionToken'
import { putTelegramBot } from '@/actions/telegram/putTelegramBot'
import { toast } from 'sonner'

import { unified } from 'unified'
import remarkParse from 'remark-parse'
// import { generateTasks } from '@/actions/taskAI/generateTasks'
// import { UnControlled as CodeMirror } from 'react-codemirror2'
import { CodeMirrorCompo } from './CodeMirrorCompo'
import { useBot } from '../../schema/[botID]/useBot'

export function BotSchema({ bot }: any) {
    let save = ({ bot }: any) => {
        putTelegramBot({
            item: {
                ...bot,
                itemID: bot.itemID,
            },
        })
            .then(() => {
                toast.success('Successfully Updated')
            })
            .catch((r) => {
                console.error(r)
                toast.success('Error While Saving Record')
            })
    }

    let refTimer = useRef<any>(-1)

    let formUI = (
        <form
            //
            onSubmit={(ev) => {
                ev.preventDefault()
            }}
            //
            className='space-y-2'
        >
            <div
                className='w-full h-[78vh] flex space-x-3'
                onKeyDownCapture={(ev) => {
                    if (ev.metaKey && ev.key === 's') {
                        ev.stopPropagation()
                        ev.preventDefault()

                        let bot = useBot.getState().bot

                        if (bot) {
                            clearTimeout(refTimer.current)
                            refTimer.current = setTimeout(() => {
                                save({ bot })
                            }, 1000)
                        }
                    }
                }}
            >
                <div className='w-1/2 rounded-2xl overflow-hidden border border-gray-300 p-2 shrink-0'>
                    {
                        <CodeMirrorCompo
                            autoSave={({ bot }: any) => {
                                clearTimeout(refTimer.current)
                                refTimer.current = setTimeout(() => {
                                    save({ bot })
                                }, 1000)
                            }}
                        ></CodeMirrorCompo>
                    }
                </div>

                <div className='w-1/2 rounded-2xl border border-gray-300 p-2 shrink-0 overflow-auto'>
                    {/*  */}
                    <pre className='w-full text-[10px] h-full whitespace-pre'>{JSON.stringify(bot.json, null, 4)}</pre>
                    {/*  */}
                </div>
            </div>
        </form>
    )

    return <>{formUI}</>
}

//
