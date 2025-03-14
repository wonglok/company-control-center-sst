import { listConnectionToken } from '@/actions/connectionTokens/listConnectionToken'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCaption,
    TableFooter,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { useEffect } from 'react'

import { useConnectorTokens } from './useConnectorTokens'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
// import { Terminal } from 'lucide-react'
import copy from 'copy-to-clipboard'
import { Input } from '@/components/ui/input'
import { putConnectionToken } from '@/actions/connectionTokens/putConnectionToken'
import Link from 'next/link'
import { getOnlineConnections } from '@/actions/getOnlineConnections'
import { ConnectionStatus } from './ConnectionStatus'
import md5 from 'md5'

// Declare putConnectionTokenTimer on the window object
declare global {
    interface Window {
        putConnectionTokenTimer: any
    }
}

export function ListConnectors() {
    useEffect(() => {
        listConnectionToken().then((data) => {
            useConnectorTokens.setState({ tokens: data })
        })
    }, [])
    let tokens = useConnectorTokens((r) => r.tokens)

    useEffect(() => {
        let hh = () => {
            getOnlineConnections().then((data) => {
                useConnectorTokens.setState({
                    socketURL: data.socketURL,
                    online: (data as any)?.online || [],
                })
                useConnectorTokens.setState({ loading: false })
            })
        }
        useConnectorTokens.setState({ loading: true })
        hh()
        let tt = setInterval(hh, 15000)

        return () => {
            clearInterval(tt)
        }
    }, [])

    return (
        <Card className='size-full'>
            <CardHeader>
                <CardTitle>AI Devices</CardTitle>
                <CardDescription>Recent Devices</CardDescription>
            </CardHeader>
            <CardContent>
                {tokens && tokens.length === 0 && (
                    <>
                        <Alert>
                            <AlertTitle>Heads up!</AlertTitle>
                            <AlertDescription>Please create a new Token.</AlertDescription>
                        </Alert>
                    </>
                )}

                {tokens && tokens.length > 0 && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Status</TableHead>
                                <TableHead>Name</TableHead>
                                {/* <TableHead className='text-center'>Copy</TableHead> */}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tokens.slice(0, 3).map((token: { itemID: string; name: string; secret: string }) => (
                                <TableRow key={token.itemID}>
                                    <TableCell className='flex justify-center items-center flex-col'>
                                        <div className='h-2 w-full'></div>
                                        <ConnectionStatus client={token}></ConnectionStatus>
                                    </TableCell>
                                    <TableCell className='w-full'>
                                        <Input
                                            value={token.name}
                                            onChange={async (ev) => {
                                                token.name = ev.target.value
                                                useConnectorTokens.setState((r: any) => {
                                                    return { ...r, tokens: [...r.tokens] }
                                                })

                                                clearTimeout(window.putConnectionTokenTimer)
                                                window.putConnectionTokenTimer = setTimeout(() => {
                                                    putConnectionToken({ item: token })
                                                }, 1000)
                                            }}
                                        ></Input>
                                    </TableCell>
                                    {/* <TableCell className='text-center w-36'>
                                        <Button
                                            onClick={(ev: any) => {
                                                //
                                                let url = `${location.origin}?clientID=${encodeURIComponent(
                                                    `${token.itemID}`,
                                                )}&verify=${`${md5(token.secret)}`}`

                                                copy(url)

                                                console.log(url)

                                                ev.target.innerText = 'Copied'

                                                setTimeout(() => {
                                                    ev.target.innerText = 'Copy'
                                                }, 1000)
                                            }}
                                        >
                                            Copy
                                        </Button>
                                    </TableCell> */}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
            <CardFooter className='flex justify-end'>
                <Link href={'/admin/clients'}>
                    <Button variant={'outline'} className=''>
                        Manage All Connections
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    )
}
