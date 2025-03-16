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
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import { listConnectionToken } from '@/actions/connectionTokens/listConnectionToken'
// import { putTelegramBot } from '@/actions/telegram/putTelegramBot'
import { Button } from '@/components/ui/button'
// import axios from 'axios'
import { toast } from 'sonner'
// import { getConnectionToken } from '@/actions/connectionTokens/getConnectionToken'
import md5 from 'md5'
import copy from 'copy-to-clipboard'
import { CloudStatus } from './CloudStatus'
import { TelegramConnection } from './TelegramConnection'
import { BotSchema } from './BotSchema'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faTeletype } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'

export type BotType = {
    itemID: string
    displayName: string
    botUserName: string
    botToken: string
    webhookToken: string
    chatID: string
    botSchema: string
    json: any
}

export function ManageBots({ config, jwt }: any) {
    //
    let bots = useBots((r) => r.bots)

    useEffect(() => {
        listTelegramBot().then((data: any) => {
            useBots.setState({ bots: data })
        })
    }, [])

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
                            <TableHead className='text-left'>Edit</TableHead>
                            <TableHead>Schema</TableHead>
                            <TableHead className='text-left'>Telegram Integration</TableHead>
                            <TableHead className='text-left'>Bot Integration</TableHead>
                            <TableHead className='text-left'>Bot Link</TableHead>
                            {/* <TableHead>AI Device</TableHead> */}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bots.map((bot: BotType) => (
                            <TableRow key={bot.itemID}>
                                <TableCell className='text-left'>
                                    <EditBot bot={bot} />
                                </TableCell>

                                <TableCell className='font-medium'>
                                    <Link href={`/admin/telegram-bots/schema/${bot.itemID}`}>
                                        <Button>Logic</Button>
                                    </Link>
                                    {/* <BotSchema key={bot.itemID} bot={bot}></BotSchema> */}
                                </TableCell>

                                <TableCell className='text-left'>
                                    <TelegramConnection jwt={jwt} bot={bot} config={config}></TelegramConnection>

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
                                        <FontAwesomeIcon icon={faPaperPlane}></FontAwesomeIcon> Message Me
                                    </Button>
                                </TableCell>
                                <TableCell className=''>
                                    <CloudStatus key={bot.itemID} bot={bot}></CloudStatus>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        className=''
                                        variant={'outline'}
                                        onClick={() => {
                                            //
                                            copy(
                                                `${location.origin}?clientID=${encodeURIComponent(bot.itemID)}&verify=${encodeURIComponent(`${md5(bot.botToken)}`)}`,
                                            )
                                            //
                                        }}
                                    >
                                        Copy Link
                                    </Button>
                                </TableCell>
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
