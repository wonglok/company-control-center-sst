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
import * as mdjs from '@moox/markdown-to-json'

// import { unified } from 'unified'
// import remarkParse from 'remark-parse'

// const processor = unified().use(remarkParse)

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

    let refClose = useRef<any>(<button></button>)

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
                            <FormLabel>Bot Logic</FormLabel>
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
                                    <Editor
                                        className='w-1/2 rounded-2xl overflow-hidden border border-gray-300 p-2'
                                        height={'75vh'}
                                        value={field.value}
                                        onChange={async (value) => {
                                            bot.botSchema = value || ''
                                            field.onChange({ target: { value } })

                                            // let result = processor.parse(value)
                                            // console.log(result)
                                            //toMd

                                            let processed = mdjs.markdownAsJsTree(value)

                                            let traverse = (node: any, parent: any) => {
                                                if (typeof node === 'string') {
                                                    if (parent.children instanceof Array) {
                                                        parent.children.splice(
                                                            parent.children.findIndex((kid: any) => kid === node),
                                                            1,
                                                        )
                                                    }
                                                }

                                                if (node.children) {
                                                    for (let item of node.children) {
                                                        traverse(item, node)
                                                    }
                                                }
                                            }

                                            traverse(processed.body, processed)

                                            bot.json = processed

                                            setJSON(bot.json)

                                            // setJSON(result)

                                            clearTimeout(refTimer.current)
                                            refTimer.current = setTimeout(() => {
                                                save()
                                            }, 1000)
                                        }}
                                    ></Editor>

                                    <div className='w-1/2 rounded-2xl text-xs overflow-hidden border border-gray-300 p-2 shrink-0'>
                                        {/*  */}
                                        <pre className='w-full h-[75vh] whitespace-pre-wrap overflow-y-scroll'>
                                            {JSON.stringify(json, null, '\t')}
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
                    <Button type='submit'>Save changes</Button>
                </DialogFooter>
            </form>
        </Form>
    )

    return (
        <Dialog>
            <DialogClose asChild>
                <button ref={refClose} />
            </DialogClose>
            <DialogTrigger asChild>
                <Button variant={'default'}>Bot Logic Editor</Button>
            </DialogTrigger>
            <DialogContent className=' max-w-[95vw]'>
                <DialogHeader>
                    <DialogTitle>Bot Logic Editor</DialogTitle>

                    {/* <DialogDescription>
                        Make changes to your profile here. Click save when you're done.
                    </DialogDescription> */}
                </DialogHeader>
                {formUI}
            </DialogContent>
        </Dialog>
    )
}
