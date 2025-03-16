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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { listTelegramBot } from '@/actions/telegram/listTelegramBot'
import { useBots } from '../useBots'
import { Editor } from '@monaco-editor/react'
import { DialogClose } from '@radix-ui/react-dialog'

// @ts-ignore
import md2json from 'md-2-json'

// @ts-ignore
import * as mdjs from '@moox/markdown-to-json'

import { unified } from 'unified'
import remarkParse from 'remark-parse'
// import { generateTasks } from '@/actions/taskAI/generateTasks'
// import { UnControlled as CodeMirror } from 'react-codemirror2'
import { CodeMirrorCompo } from './CodeMirrorCompo'
import { procFQL } from './procFQL'
import { useBot } from '../../schema/[botID]/useBot'

const processor = unified().use(remarkParse)

export function BotSchema() {
    let bot = useBot((r) => r.bot)
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
                        save({ bot })
                    }
                }}
            >
                <div className='w-2/3 rounded-2xl overflow-hidden border border-gray-300 p-2 shrink-0'>
                    {bot && (
                        <CodeMirrorCompo
                            save={({ bot }: any) => {
                                clearTimeout(refTimer.current)
                                refTimer.current = setTimeout(() => {
                                    save({ bot })
                                }, 500)
                            }}
                        ></CodeMirrorCompo>
                    )}
                </div>

                <div className='w-1/3 rounded-2xl overflow-hidden border border-gray-300 p-2 shrink-0'>
                    {/*  */}
                    <pre className='w-full text-[12px] h-full whitespace-pre-wrap overflow-y-scroll'>
                        {JSON.stringify(bot.json, null, 2)}
                    </pre>
                    {/*  */}
                </div>
            </div>
        </form>
    )

    return <>{formUI}</>
}

//
