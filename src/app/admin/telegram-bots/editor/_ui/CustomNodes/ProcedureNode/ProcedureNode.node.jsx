'use client'
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { useRemoveUI } from '../../../[botID]/removeBtn';
import { BotEditorIn } from '../../../[botID]/AppPage';
import { Button } from '@/components/ui/button';
import { MenuIcon } from 'lucide-react';
import { useFlow } from '../../../[botID]/useFlow';
import { CodeMirrorNodeEditor } from './CodeMirrorNodeEditor';
import { v4 } from 'uuid';
import { useParams } from 'next/navigation';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { getTelegramBot } from '@/actions/telegram/getTelegramBot';
import md5 from 'md5';

const handleStyle = { left: 10 };


// let SortableUI = dynamic(() => import('../../SortableUI/SortableUI').then(r => r.SortableUI), { ssr: false })

export function ProcedureNode({ id, data }) {
    let { remove } = useRemoveUI({ id })

    // const onChange = useCallback((evt) => {
    //     console.log(evt.target.value);
    // }, []);

    let [show, setShow] = useState(false)

    useEffect(() => {
        //

        let hh = (ev) => {
            if (ev.key === 'Escape') {
                setShow(false)
            }
        }

        window.addEventListener('keydown', hh)

        return () => {
            window.removeEventListener('keydown', hh)
        }        //
    }, [])

    //

    return <>
        <div className='bg-white min-w-[320px] h-full p-2 rounded-lg  border border-gray-500  cursor-auto' onDragStartCapture={(ev) => {
            ev.stopPropagation()
        }}>
            <button className='dragHandle bg-sky-200 w-full h-8 cursor-grab rounded-lg'>
                <MenuIcon className='ml-2 size-4'></MenuIcon>
            </button>

            <Handle type="target" position={Position.Top} id="b" />

            {/* <div>
                <label htmlFor="text" className='mr-3'>Text:</label>
                <input id="text" name="text" onChange={onChange} className="nodrag border border-gray-300" />
            </div> */}

            <Handle type="source" position={Position.Bottom} id="a" />

            <div className='w-full hfull relative'>

                <div className='mb-2 flex justify-between'>
                    <Button onClick={() => {
                        setShow(!show)
                    }}>Edit</Button>

                    {remove}
                </div>

                <div className='w-full text-[10px] max-h-[250px] overflow-y-auto p-2 bg-gray-100 border  rounded-2xl h-full'>
                    <pre className=' whitespace-pre-wrap'>{data?.bot?.botSchema || ''}</pre>
                </div>

                {/* <SortableRecursive
                    key={JSON.stringify([data, show])}
                    mode={'clone'}
                    onChange={(list, level) => {

                    }}
                    level={0}
                    list={data.list || []}
                ></SortableRecursive> */}

            </div>

            {show && <BotEditorIn>
                <div className=' absolute z-[2000] top-0 left-0 w-full h-full bg-gray-200 rounded-xl '>
                    <div className=' absolute top-2 right-2'>
                        <button className='text-xs p-2 bg-red-500 text-white'
                            onClick={() => {
                                setShow(false)
                            }}>Close</button>
                    </div>
                    <CodeMirrorAdapter id={id} data={data}></CodeMirrorAdapter>
                    {/* <SortableUI id={id} data={data}></SortableUI> */}
                </div>
            </BotEditorIn>}

        </div>
    </>
}


function CodeMirrorAdapter({ id, data }) {
    data.bot = data.bot || {
        botSchema: '',
        json: {}
    }

    const execID = useMemo(() => {
        return `_${v4()}`
    }, [])

    let { botID } = useParams()

    let [askBot, setSendData] = useState(false)

    useEffect(() => {

        console.log(botID)
        if (!botID) {
            return
        }

        let clean = () => { }

        let run = async () => {

            console.log('setup-webhook')
            let telegram = await getTelegramBot({
                item: { itemID: botID }
            })
            let clientID = telegram.itemID
            let verify = `${md5(telegram.botToken)}`

            let { wsURL, httpURL } = await fetch(`/api/services`, { mode: 'cors', method: 'GET' })
                .then((r) => r.json())
                .then((r) => {
                    return {
                        httpURL: r.httpURL,
                        wsURL: `${r.socketURL}?clientID=${encodeURIComponent(clientID)}&verify=${encodeURIComponent(verify)}&clientType=client`,
                    }
                })

            let webSocket = new ReconnectingWebSocket(wsURL)
            webSocket.onmessage = (event) => {
                let rawData = JSON.parse(event.data)
                console.log('socket-data', rawData)

                if (rawData.execID === execID) {
                    if (rawData.route === 'response') {

                        console.log('response arrived')
                    }
                }
            }

            let timer = -1

            webSocket.onopen = () => {
                console.log('socket-open')

                setSendData(() => {
                    return (v) => {
                        clearTimeout(timer)
                        timer = setTimeout(() => {
                            webSocket.send(JSON.stringify(v))
                        }, 500)
                    }
                })
            }

            clean = () => {
                webSocket.close()
                console.log('cleand')
            }
        }
        run()

        return () => {
            clean()
            setSendData(false)
        }
    }, [botID])

    useEffect(() => {
        if (askBot) {
            askBot({
                route: 'request',
                type: 'parse_logic_request',
                clientID: botID,

                botID: `${botID}`,
                execID: execID,
                question: data.bot,
            })
        }
    }, [askBot, data.bot])

    return <>
        <div className='w-full h-full flex'>
            <div className='w-1/2 h-full'>
                {!askBot && <><div className='w-full h-full flex items-center justify-center'>Loading...</div></>}
                {askBot && <CodeMirrorNodeEditor bot={data.bot} autoSave={({ bot }) => {
                    data.bot = bot
                    useFlow.setState({ nodes: [...(useFlow.getState()?.nodes || [])] })
                    askBot({
                        route: 'request',
                        type: 'parse_logic_request',
                        clientID: botID,

                        botID: `${botID}`,
                        execID: execID,
                        question: data.bot,
                    })
                }}></CodeMirrorNodeEditor>}
            </div>

            <div className='w-1/2 h-full text-xs overflow-y-scroll'>
                {askBot && <pre className=' whitespace-pre-wrap p-4'>{JSON.stringify(data?.bot?.json, null, 2)}</pre>}
            </div>
        </div>
    </>
}

//