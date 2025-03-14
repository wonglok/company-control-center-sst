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
import { useEffect, useState } from 'react'
import { listConnectionToken } from '@/actions/connectionTokens/listConnectionToken'
import { putTelegramBot } from '@/actions/telegram/putTelegramBot'
import { toast } from 'sonner'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { listTelegramBot } from '@/actions/telegram/listTelegramBot'
import { useBots } from '../useBots'

export function EditBot({ bot }: { bot: BotType }) {
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

                listTelegramBot().then((data: any) => {
                    useBots.setState({ bots: data })
                })
                //
            })
            .catch((r) => {
                console.error(r)
                toast.success('Error While Creating Record')
            })
    }

    let formUI = (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
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
                            <FormLabel>Chat ID for Messaging yourself</FormLabel>
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

                {/* <FormField
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
                /> */}

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
                <Button>Edit Bot</Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle>Edit Bot</DialogTitle>
                    {/* <DialogDescription>
                        Make changes to your profile here. Click save when you're done.
                    </DialogDescription> */}
                </DialogHeader>
                {formUI}
            </DialogContent>
        </Dialog>
    )
}
