import { getOnlineConnections } from '@/actions/getOnlineConnections'
import { useEffect, useState } from 'react'
import { useConnected } from './useConnected'
import { useSearchParams } from 'next/navigation'
import copy from 'copy-to-clipboard'
import { putConnectionToken } from '@/actions/connectionTokens/putConnectionToken'
export function ConnectedSockets({ config }: { config: { restURL: string; socketURL: string } }) {
    //
    let clientID = ''
    let online = useConnected((r) => r.online)
    useEffect(() => {
        //
        if (!clientID) {
            return
        }

        let socket = new WebSocket(`${config.socketURL}?clientID=${clientID}&clientType=datahub`)

        socket.onopen = () => {
            useConnected.setState({ socket: socket })

            getOnlineConnections().then((data) => {
                useConnected.setState({
                    socketURL: data.socketURL,
                    online: (data as any)?.online || [],
                })
            })
        }
    }, [clientID])

    let uniq = new Set()

    online.forEach((item: any) => {
        uniq.add(item.clientID)
    })

    let uniqueClients = []
    for (let cID of uniq.values()) {
        uniqueClients.push(cID)
    }

    return (
        <>
            {uniqueClients.map((cID: any, idx) => {
                return (
                    <div className='flex' key={`${cID}`}>
                        {idx + 1} - {cID}
                        {online
                            .filter((r: { itemID: string; clientType: string; clientID: string }) => r.clientID === cID)
                            .map((onl: { itemID: string; clientType: string; clientID: string }) => {
                                return <div key={onl.itemID}>{onl.clientType}</div>
                            })}
                    </div>
                )
            })}
        </>
    )
}

//
