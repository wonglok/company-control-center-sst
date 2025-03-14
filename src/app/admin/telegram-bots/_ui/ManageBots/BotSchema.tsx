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
import { z } from 'zod'
import { useEffect, useRef, useState } from 'react'
import { listConnectionToken } from '@/actions/connectionTokens/listConnectionToken'
import { putTelegramBot } from '@/actions/telegram/putTelegramBot'
import { toast } from 'sonner'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { listTelegramBot } from '@/actions/telegram/listTelegramBot'
import { useBots } from '../useBots'
import { Editor } from '@monaco-editor/react'

export function BotSchema({ bot }: { bot: BotType }) {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            ...bot,
        },
    })

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
            })
            .catch((r) => {
                console.error(r)
                toast.success('Error While Creating Record')
            })
    }

    let refTimer = useRef<number | NodeJS.Timeout>(0)

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
                                <Editor
                                    className=' rounded-2xl overflow-hidden border border-gray-300 p-2'
                                    height={'500px'}
                                    value={field.value}
                                    onChange={(value) => {
                                        bot.botSchema = value || ''
                                        field.onChange({ target: { value } })

                                        clearTimeout(refTimer.current)
                                        refTimer.current = setTimeout(() => {
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
                                                    toast.success('Error While Creating Record')
                                                })
                                        }, 1000)
                                    }}
                                ></Editor>
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
            <DialogTrigger asChild>
                <Button variant={'default'}>Bot Logic Editor</Button>
            </DialogTrigger>
            <DialogContent className=''>
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
