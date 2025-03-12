import { faCheck, faClose, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useConnectorTokens } from './useConnectorTokens'

export function ConnectionStatus({ client }: any) {
    let online = useConnectorTokens((r) => r.online)

    let isOnline = online.some((li: any) => {
        return li.clientID === client.itemID
    })

    let loading = useConnectorTokens((r) => r.loading)
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
                    {isOnline && (
                        <>
                            {/* <FontAwesomeIcon icon={faCloud} /> */}
                            <FontAwesomeIcon className='size-5 text-green-500' icon={faCheck}></FontAwesomeIcon>
                        </>
                    )}
                    {!isOnline && <FontAwesomeIcon className='size-5 text-red-500' icon={faClose} />}
                </>
            )}
        </>
    )
}
