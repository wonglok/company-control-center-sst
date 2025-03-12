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

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
// import { Terminal } from 'lucide-react'
import copy from 'copy-to-clipboard'
import { Input } from '@/components/ui/input'
import { putConnectionToken } from '@/actions/connectionTokens/putConnectionToken'
import Link from 'next/link'
import { useConnectors } from './useConnectors'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudBolt } from '@fortawesome/free-solid-svg-icons'
import { ConnectionStatus } from './ConnectionStatus'
import { getOnlineConnections } from '@/actions/getOnlineConnections'
import { RemoveDialogue } from './RemoveDialogue'
import { deleteConnectionToken } from '@/actions/connectionTokens/deleteConnectionToken'

// Declare putConnectionTokenTimer on the window object
declare global {
    interface Window {
        putConnectionTimer: any
    }
}

export function AllConnections() {
    useEffect(() => {
        listConnectionToken().then((data) => {
            useConnectors.setState({ clients: data })
        })
    }, [])

    useEffect(() => {
        let hh = () => {
            getOnlineConnections().then((data) => {
                useConnectors.setState({
                    socketURL: data.socketURL,
                    online: (data as any)?.online || [],
                })
                useConnectors.setState({ loading: false })
            })
        }
        useConnectors.setState({ loading: true })
        hh()
        let tt = setInterval(hh, 15000)

        return () => {
            clearInterval(tt)
        }
    }, [])

    let clients = useConnectors((r) => r.clients)

    return (
        <Card className='size-full'>
            <CardHeader>
                <CardTitle>Connections to DataHub</CardTitle>
                <CardDescription>All Connection Links</CardDescription>
            </CardHeader>
            <CardContent>
                {clients && clients.length === 0 && (
                    <>
                        <Alert>
                            <AlertTitle>Heads up!</AlertTitle>
                            <AlertDescription>Please create a new Token.</AlertDescription>
                        </Alert>
                    </>
                )}

                {clients && clients.length > 0 && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Status</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead className='text-center'>Remove</TableHead>
                                <TableHead className='text-center'>Copy</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {clients.map((client: { itemID: string; name: string }) => (
                                <TableRow key={client.itemID}>
                                    <TableCell className='flex justify-center items-center flex-col'>
                                        <div className='h-2 w-full'></div>
                                        <ConnectionStatus client={client}></ConnectionStatus>
                                    </TableCell>
                                    <TableCell className='w-full'>
                                        <Input
                                            value={client.name}
                                            onChange={async (ev) => {
                                                client.name = ev.target.value
                                                useConnectors.setState((r: any) => {
                                                    return { ...r, clients: [...r.clients] }
                                                })

                                                clearTimeout(window.putConnectionTimer)
                                                window.putConnectionTimer = setTimeout(() => {
                                                    putConnectionToken({ item: client })
                                                }, 1000)
                                            }}
                                        ></Input>
                                    </TableCell>
                                    <TableHead>
                                        <RemoveDialogue
                                            onConfirm={() => {
                                                //
                                                deleteConnectionToken({
                                                    item: client,
                                                }).then(() => {
                                                    listConnectionToken().then((data) => {
                                                        useConnectors.setState({ clients: data })
                                                    })
                                                })
                                                //
                                            }}
                                        ></RemoveDialogue>
                                    </TableHead>
                                    <TableCell className='text-center w-36'>
                                        <Button
                                            onClick={(ev: any) => {
                                                //
                                                let url = `${location.origin}?clientID=${encodeURIComponent(
                                                    `${client.itemID}`,
                                                )}`

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
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
            <CardFooter className='flex justify-end'></CardFooter>
        </Card>
    )
}
