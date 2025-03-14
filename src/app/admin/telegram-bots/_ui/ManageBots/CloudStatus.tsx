import { getOnlineConnections } from '@/actions/getOnlineConnections'
import { Button } from '@/components/ui/button'
import { faCheck, faClose, faCloud, faRobot, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'

export function CloudStatus({ bot }: any) {
    let [loading, setLoading] = useState(true)
    let [isOnline, setOnline] = useState(false)

    let load = () => {
        setLoading(true)
        getOnlineConnections().then((data) => {
            console.log(data)
            let isOnline = data.online.some((r) => r.clientID === bot.itemID)
            setOnline(isOnline)
            setLoading(false)
        })
    }

    useEffect(() => {
        load()

        let ttt = setInterval(() => {
            load()
        }, 15000)

        return () => {
            clearInterval(ttt)
        }
    }, [bot.itemID])

    return (
        <>
            <Button
                onClick={() => {
                    load()
                }}
                variant={'outline'}
            >
                <div className='inline-flex items-center justify-center h-full'>
                    <FontAwesomeIcon className='mr-2 size-5' icon={faRobot}></FontAwesomeIcon>
                    {loading ? (
                        <>
                            {/*  */}
                            <FontAwesomeIcon className='size-5 ml-2 text-green-500 animate-spin' icon={faSpinner} />
                            {/*  */}
                        </>
                    ) : (
                        <>
                            {isOnline && (
                                <>
                                    <FontAwesomeIcon className='size-5 ml-2 text-green-500 mr-2' icon={faCheck} /> OK
                                </>
                            )}
                            {!isOnline && (
                                <>
                                    <FontAwesomeIcon className='size-5 ml-2 text-red-500 mr-2' icon={faClose} /> Offline
                                </>
                            )}
                        </>
                    )}
                </div>
            </Button>
        </>
    )
}
