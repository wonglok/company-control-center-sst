import { fa4, faCheck, faClose, faIceCream, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export function TelegramConnection({ jwt, config, bot }: any) {
    let [matches, setMatch] = useState('loading')
    useEffect(() => {
        //
        let restURL = config.restURL
        fetch(`${restURL}/api/telegram/telegram/getBotHook/${bot.itemID}`, {
            mode: 'cors',
            method: 'POST',
            body: JSON.stringify({
                //
                jwt,
                //
                ...bot,
            }),
        })
            .then((r) => r.json())
            .then((it) => {
                if (it.isWorking) {
                    setMatch('ok')
                    //  toast.success('Webhook is Verfiied')
                } else {
                    setMatch('bad')
                    //  toast.error('Webhook needs activation')
                }
            })
    }, [config, bot])

    return (
        <>
            {matches === 'loading' && (
                <>
                    <FontAwesomeIcon icon={faSpinner} className=' animate-spin'></FontAwesomeIcon>
                </>
            )}
            {matches === 'ok' && (
                <>
                    <FontAwesomeIcon icon={faCheck} className=' animate-in text-green-500'></FontAwesomeIcon>
                </>
            )}
            {matches === 'bad' && (
                <>
                    <FontAwesomeIcon icon={faClose} className=' animate-ping text-red-500'></FontAwesomeIcon>
                </>
            )}
        </>
    )
}
