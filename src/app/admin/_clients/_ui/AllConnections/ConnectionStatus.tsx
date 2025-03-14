import { getOnlineConnections } from '@/actions/getOnlineConnections'
import { faClose, faCloud, faCloudBolt, faCloudRain, faCross, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect } from 'react'
import { useConnectors } from './useConnectors'

export function ConnectionStatus({ client }: any) {
    let online = useConnectors((r) => r.online)

    let isOnline = online.some((li: any) => {
        return li.clientID === client.itemID
    })

    let loading = useConnectors((r) => r.loading)
    return (
        <>
            {loading ? (
                <>
                    {/*  */}
                    <FontAwesomeIcon className='size-5 text-green-500 animate-spin' icon={faSpinner} />
                    {/*  */}
                </>
            ) : (
                <>
                    {isOnline && <FontAwesomeIcon className='size-5 text-green-500' icon={faCloud} />}
                    {!isOnline && <FontAwesomeIcon className='size-5 text-red-500' icon={faClose} />}
                </>
            )}
        </>
    )
}
