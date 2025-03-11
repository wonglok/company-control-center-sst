import { getOnlineConnections } from '@/actions/getOnlineConnections'
import { useEffect, useState } from 'react'
import { useConnected } from './useConnected'

export function ConnectedSockets({ config }: { config: { restURL: string; socketURL: string } }) {
    //

    let online = useConnected((r) => r.online)
    useEffect(() => {
        //
        getOnlineConnections().then((data) => {
            console.log(data.online)
            useConnected.setState({
                socketURL: data.socketURL,
                online: (data as any)?.online || [],
            })
        })
        //
    }, [])

    let uniq = new Set()

    online.forEach((item: any) => {
        uniq.add(item.clientID)
    })

    let groups = []
    for (let gp of uniq.values()) {
        groups.push(gp)
    }

    return (
        <>
            {groups.map((gp, idx) => {
                return (
                    <div className='flex' key={`${gp}`}>
                        {online
                            .filter((r: { itemID: string; clientType: string; clientID: string }) => r.clientID === gp)
                            .map((onl: { itemID: string; clientType: string; clientID: string }) => {
                                return (
                                    <div key={onl.itemID}>
                                        {idx + 1}. {onl.clientType}
                                    </div>
                                )
                            })}
                    </div>
                )
            })}
        </>
    )
}
