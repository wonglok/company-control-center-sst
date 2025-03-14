import { Button } from '@/components/ui/button'
import {
    fa4,
    faCheck,
    faClose,
    faCloud,
    faCloudBolt,
    faGear,
    faIceCream,
    faPaperPlane,
    faSpinner,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

export function TelegramConnection({ jwt, config, bot }: any) {
    let [matches, setMatch] = useState('loading')

    //
    let load = useCallback((notify = false) => {
        setMatch('loading')
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
                    notify && toast.success('Successfully Setup Webhook')
                } else {
                    notify && toast.error('Offline')
                    setMatch('bad')
                }
            })
    }, [])

    useEffect(() => {
        load()
    }, [config, bot])

    return (
        <>
            <Button
                onClick={() => {
                    load(true)
                }}
                variant={'outline'}
                className='mr-3'
            >
                <FontAwesomeIcon icon={faCloudBolt} className=' mr-3'></FontAwesomeIcon>

                {matches === 'loading' && (
                    <>
                        <FontAwesomeIcon icon={faSpinner} className=' animate-spin'></FontAwesomeIcon>
                    </>
                )}
                {matches === 'ok' && (
                    <>
                        <FontAwesomeIcon icon={faCheck} className=' animate-in text-green-500'></FontAwesomeIcon> OK
                    </>
                )}
                {matches === 'bad' && (
                    <>
                        <FontAwesomeIcon icon={faClose} className=' animate-ping text-red-500'></FontAwesomeIcon> Needs
                        Activation
                    </>
                )}
            </Button>

            <Button
                className='mr-3'
                onClick={(ev: any) => {
                    //
                    let restURL = config.restURL
                    //

                    toast.success('Activaing WebHook....')
                    fetch(`${restURL}/api/telegram/telegram/setupBotHook/${bot.itemID}`, {
                        mode: 'cors',
                        method: 'POST',
                        body: JSON.stringify({
                            ...bot,
                            jwt: jwt,
                        }),
                    })
                        .then((r) => r.json())
                        .then((it) => {
                            // console.log(it)
                            toast.success('Successfully Activated WebHook')
                            load(true)
                        })
                        .catch((r) => {
                            console.error(r)
                            toast('Webhook Seutp Failed')
                        })

                    //
                }}
            >
                <FontAwesomeIcon icon={faGear}></FontAwesomeIcon> Activate
            </Button>
        </>
    )
}
