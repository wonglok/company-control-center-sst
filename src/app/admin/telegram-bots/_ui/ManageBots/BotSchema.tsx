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

const processor = unified().use(remarkParse)

export function BotSchema({ bot }: { bot: BotType }) {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            ...bot,
        },
    })

    const [json, setJSON] = useState(bot.json)

    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log(data)

        putTelegramBot({
            item: {
                itemID: bot.itemID,
                ...data,
            },
        })
            .then(() => {
                toast.success('Successfully Updated')
                if (refClose?.current && typeof refClose?.current?.click === 'function') {
                    refClose?.current?.click()
                }
            })
            .catch((r) => {
                console.error(r)
                toast.success('Error While Saving Record')
            })
    }

    let refClose = useRef<any>(<></>)

    let refTimer = useRef<number | NodeJS.Timeout>(0)

    let save = () => {
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

    let formUI = (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
                <FormField
                    control={form.control}
                    name='botSchema'
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div
                                    className='w-full flex space-x-3'
                                    onKeyDownCapture={(ev) => {
                                        if (ev.metaKey && ev.key === 's') {
                                            ev.stopPropagation()
                                            ev.preventDefault()
                                            save()
                                        }
                                    }}
                                >
                                    <div className='w-1/2 rounded-2xl overflow-hidden border border-gray-300 p-2 shrink-0'>
                                        <Editor
                                            className='w-1/2 rounded-2xl overflow-hidden border border-gray-300 p-2'
                                            height={'85vh'}
                                            value={field.value}
                                            language={'markdown'}
                                            onChange={async (value) => {
                                                bot.botSchema = value || ''
                                                field.onChange({ target: { value } })

                                                // // let result = processor.parse(value)
                                                // // console.log(result)
                                                // //toMd

                                                // // let processed = mdjs.markdownAsJsTree(value)

                                                let processText = async (rawText: string) => {
                                                    //
                                                    // return rawText
                                                }

                                                let simpleJSON = md2json.parse(value)

                                                let walk = async (obj: any) => {
                                                    for (let kn in obj) {
                                                        if (kn === 'raw') {
                                                            let rawText = obj[kn]
                                                            obj['json'] = await processText(rawText as string)
                                                        } else {
                                                            await walk(obj[kn])
                                                        }
                                                    }
                                                }

                                                await walk(simpleJSON)

                                                bot.json = simpleJSON

                                                setJSON(bot.json)

                                                // setJSON(result)

                                                clearTimeout(refTimer.current)
                                                refTimer.current = setTimeout(() => {
                                                    save()
                                                }, 5000)
                                            }}
                                        ></Editor>
                                    </div>

                                    <div className='w-1/2 rounded-2xl overflow-hidden border border-gray-300 p-2 shrink-0'>
                                        {/*  */}
                                        <pre className='w-full text-[12px] h-[85vh] whitespace-pre-wrap overflow-y-scroll'>
                                            {JSON.stringify(json, null, '  ')}
                                        </pre>
                                        {/*  */}
                                    </div>
                                </div>
                                {/* <Input placeholder='Display Name' {...field} /> */}
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <DialogFooter className=''>
                    <div className='h-3'></div>
                    <Button
                        type='button'
                        onClick={() => {
                            save()
                        }}
                    >
                        Save changes
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    )

    return <>{formUI}</>
}

//
