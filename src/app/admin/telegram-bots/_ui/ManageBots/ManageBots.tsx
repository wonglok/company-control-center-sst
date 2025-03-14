import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { useBots } from '../useBots'
import { useEffect, useState } from 'react'
import { listTelegramBot } from '@/actions/telegram/listTelegramBot'
import { EditBot } from './EditBot'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { listConnectionToken } from '@/actions/connectionTokens/listConnectionToken'
import { putTelegramBot } from '@/actions/telegram/putTelegramBot'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { getConnectionToken } from '@/actions/connectionTokens/getConnectionToken'
import md5 from 'md5'
import copy from 'copy-to-clipboard'
import { CloudStatus } from './CloudStatus'

export type BotType = {
    itemID: string
    displayName: string
    botUserName: string
    botToken: string
    webhookToken: string
    chatID: string
    aiDevice: string
}

export function ManageBots({ config, jwt }: any) {
    //
    let bots = useBots((r) => r.bots)

    useEffect(() => {
        listTelegramBot().then((data: any) => {
            useBots.setState({ bots: data })
        })
    }, [])

    // let [aiDevices, setDevices] = useState([])
    // useEffect(() => {
    //     listConnectionToken().then((data: any) => {
    //         setDevices(data)
    //     })
    // }, [])

    return (
        <Card>
            <CardHeader>
                <CardTitle>Manage Bots</CardTitle>
                <CardDescription>{`Access Tokens, Config & Settings`}</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableCaption>{`A list of telegram bots.`}</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='text-left'>WebHook</TableHead>
                            <TableHead className='text-left'>Edit</TableHead>
                            {/* <TableHead className='w-[150px]'>DisplayName</TableHead> */}
                            <TableHead>Bot Username</TableHead>
                            {/* <TableHead>AI Device</TableHead> */}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bots.map((bot: BotType) => (
                            <TableRow key={bot.itemID}>
                                <TableCell className='text-left'>
                                    <Button
                                        className='mr-3'
                                        onClick={() => {
                                            //
                                            let restURL = config.restURL
                                            //

                                            fetch(`${restURL}/api/telegram/telegram/setupBotHook/${bot.itemID}`, {
                                                mode: 'cors',
                                                method: 'POST',
                                                body: JSON.stringify({
                                                    ...bot,
                                                    jwt: jwt,
                                                }),
                                            })
                                                .then((r) => r.json())
                                                .then((it) => {
                                                    // console.log(it)
                                                    toast.success('Successfully Activated WebHook')

                                                    //
                                                    let restURL = config.restURL
                                                    fetch(`${restURL}/api/telegram/telegram/getBotHook/${bot.itemID}`, {
                                                        mode: 'cors',
                                                        method: 'POST',
                                                        body: JSON.stringify({
                                                            ...bot,
                                                            jwt: jwt,
                                                        }),
                                                    })
                                                        .then((r) => r.json())
                                                        .then((it) => {
                                                            if (it.isWorking) {
                                                                toast.success('Webhook is Verfiied')
                                                            } else {
                                                                toast.error('Webhook needs activation')
                                                            }
                                                        })
                                                })
                                                .catch((r) => {
                                                    console.error(r)
                                                    toast('Webhook Seutp Failed')
                                                })

                                            //
                                        }}
                                    >
                                        Activate
                                    </Button>

                                    <Button
                                        className='mr-3'
                                        variant={'outline'}
                                        onClick={() => {
                                            //
                                            let restURL = config.restURL
                                            //

                                            fetch(`${restURL}/api/telegram/telegram/sendMessage/${bot.itemID}`, {
                                                mode: 'cors',
                                                method: 'POST',
                                                body: JSON.stringify({
                                                    ...bot,
                                                    clientID: bot.itemID,
                                                    chatID: `${bot.chatID}`,
                                                    message: 'sending a test message from admin panel',
                                                }),
                                            })
                                                .then((r) => r.json())
                                                .then((it) => {
                                                    console.log(it.success)
                                                    if (it.success) {
                                                        toast.success('Successfully Sent Message')
                                                    } else {
                                                        toast.success('Failed Sending Message')
                                                    }
                                                })
                                                .catch((r) => {
                                                    console.error(r)
                                                    toast('Webhook Seutp Failed')
                                                })
                                        }}
                                    >
                                        Message Me
                                    </Button>

                                    <Button
                                        className=''
                                        variant={'outline'}
                                        onClick={() => {
                                            //
                                            copy(`${location.origin}?clientID=${bot.itemID}`)
                                            //
                                        }}
                                    >
                                        Copy Bot Link
                                    </Button>

                                    <Button variant={'link'}>
                                        Cloud Status: <CloudStatus bot={bot}></CloudStatus>
                                    </Button>
                                </TableCell>
                                <TableCell className='text-left'>
                                    <EditBot bot={bot} />
                                </TableCell>
                                {/* <TableCell className='font-medium'>{bot.displayName}</TableCell> */}
                                <TableCell className='font-medium'>{bot.botUserName}</TableCell>
                                {/* <TableCell className='text-right'>
                                    <Select
                                        //
                                        value={bot.aiDevice}
                                        onValueChange={(value) => {
                                            bot.aiDevice = value
                                            putTelegramBot({ item: bot })
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
                                </TableCell> */}
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        {/* <TableRow>
                            <TableCell colSpan={3}>Total</TableCell>
                            <TableCell className='text-right'>$2,500.00</TableCell>
                        </TableRow> */}
                    </TableFooter>
                </Table>
            </CardContent>
        </Card>
    )
}
