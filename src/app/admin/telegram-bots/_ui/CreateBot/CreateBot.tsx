'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { putTelegramBot } from '@/actions/telegram/putTelegramBot'
import { v4 } from 'uuid'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useEffect, useState } from 'react'
import { listConnectionToken } from '@/actions/connectionTokens/listConnectionToken'
import { useBots } from '../useBots'
import { listTelegramBot } from '@/actions/telegram/listTelegramBot'

export const FormSchema = z.object({
    displayName: z.string({
        required_error: 'Display Name is required.',
    }),
    botUserName: z.string().min(2, {
        message: 'botUserName must be at least 2 characters.',
    }),
    botToken: z.string({
        required_error: 'Bot Token is required.',
    }),
    webhookToken: z.string({
        required_error: 'Webhook Token is required.',
    }),
    chatID: z.string({
        required_error: 'Your Chat Number ID is required.',
    }),
    aiDevice: z.string(),
})

export function CreateBot() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            displayName: '',
            botUserName: '',
            botToken: '',
            webhookToken: '',
            chatID: '',
            aiDevice: '',
        },
    })

    let [aiDevices, setDevices] = useState([])
    useEffect(() => {
        listConnectionToken().then((data: any) => {
            setDevices(data)
        })
    }, [])

    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log(data)

        putTelegramBot({
            item: {
                itemID: `${v4()}`,
                ...data,
            },
        })
            .then(() => {
                toast.success('Record Successfully Created')
                //
                form.reset({
                    displayName: '',
                    botUserName: '',
                    botToken: '',
                    webhookToken: '',
                    chatID: '',
                })
                //

                listTelegramBot().then((data: any) => {
                    useBots.setState({ bots: data })
                })
            })
            .catch((r) => {
                console.error(r)
                toast.success('Error While Creating Record')
            })
    }

    let formUI = (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='w-2/3 space-y-6'>
                <FormField
                    control={form.control}
                    name='displayName'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Display Name</FormLabel>
                            <FormControl>
                                <Input placeholder='Display Name' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='botUserName'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bot Username</FormLabel>
                            <FormControl>
                                <Input placeholder='Username' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='botToken'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bot Access Token</FormLabel>
                            <FormControl>
                                <Input placeholder='Access Token' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='webhookToken'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Webhook secret token</FormLabel>
                            <FormControl>
                                <Input placeholder='Token' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='chatID'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Chat ID Number</FormLabel>
                            <FormControl>
                                <Input placeholder='Token' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/*

                console.log(aiDevices)

                */}

                <FormField
                    control={form.control}
                    name='aiDevice'
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormLabel>AI Device</FormLabel>
                                <FormControl>
                                    <Select
                                        //
                                        value={field.value}
                                        onValueChange={(value) => {
                                            //

                                            //
                                            field.onChange({
                                                target: {
                                                    value,
                                                },
                                            })
                                        }}
                                    >
                                        <SelectTrigger className='w-[250px]'>
                                            <SelectValue placeholder={'Please choose a device.'} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {aiDevices.map((ai: any) => {
                                                return (
                                                    <SelectItem key={ai.itemID} value={ai.itemID}>
                                                        {ai.name}
                                                    </SelectItem>
                                                )
                                            })}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )
                    }}
                />

                <Button type='submit'>Submit</Button>
            </form>
        </Form>
    )

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add Bot Record</CardTitle>
                <CardDescription>Telegram Bot</CardDescription>
            </CardHeader>
            <CardContent>{formUI}</CardContent>
        </Card>
    )
}
