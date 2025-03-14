import { getOnlineConnections } from '@/actions/getOnlineConnections'
import { faCheck, faClose, faCloud, faRobot, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'

export function CloudStatus({ bot }: any) {
    let [loading, setLoading] = useState(true)
    let [isOnline, setOnline] = useState(false)
    useEffect(() => {
        setLoading(true)
        getOnlineConnections().then((data) => {
            console.log(data)
            let isOnline = data.online.some((r) => r.clientID === bot.itemID)
            setOnline(isOnline)
            setLoading(false)
        })
    }, [bot.itemID])

    return (
        <>
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
                        {isOnline && <FontAwesomeIcon className='size-5 ml-2 text-green-500' icon={faCheck} />}
                        {!isOnline && <FontAwesomeIcon className='size-5 ml-2 text-red-500' icon={faClose} />}
                    </>
                )}
            </div>
        </>
    )
}
