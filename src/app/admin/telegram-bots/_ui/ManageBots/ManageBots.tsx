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
import { useEffect } from 'react'
import { listTelegramBot } from '@/actions/telegram/listTelegramBot'
import { Button } from '@/components/ui/button'

export type Bot = {
    itemID: string
    displayName: string
    botUserName: string
    botToken: string
    webhookToken: string
    chatID: string
    aiDevice: string
}

export function ManageBots() {
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
                            <TableHead className='w-[150px]'>DisplayName</TableHead>
                            <TableHead>Bot Username</TableHead>
                            <TableHead>AI Device</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bots.map((bot: Bot) => (
                            <TableRow key={bot.itemID}>
                                <TableCell className='text-left'>
                                    <Button
                                        onClick={() => {
                                            //
                                            //
                                        }}
                                    >
                                        Edit
                                    </Button>
                                </TableCell>
                                <TableCell className='font-medium'>{bot.displayName}</TableCell>
                                <TableCell className='font-medium'>{bot.botUserName}</TableCell>
                                <TableCell className='text-right'>{bot.aiDevice}</TableCell>
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
