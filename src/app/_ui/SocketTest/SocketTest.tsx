'use client';

import { useEffect, useRef, useState } from "react"
// import { v4 } from "uuid";
// import copy from 'copy-to-clipboard';
import WebSocket from 'reconnecting-websocket'
import { TextQueryImage } from "./TextQueryImage";
import { useSearchParams } from "next/navigation";

export function SocketTest({ socketURL = '', clientID = ''}) {
    let [status, setStatus] = useState('loading')
    let [logs, setLogs] = useState([])
    let [wss, setWss] = useState<any>(false)
    let [images, setImages] = useState([])
    let params = useSearchParams()

    let connectionURL = `${socketURL}?clientID=${clientID}`
    useEffect(() => {  
        if (!socketURL) {
            return
        }

        console.log('clientID', clientID)

        let clean = () => {}

        let wss = new WebSocket(connectionURL);

        wss.onopen = () => {
            //

            setStatus('open')

            console.log('opened')

            setWss(wss)
        }

        clean = () => {
            wss.close();
        }

        wss.onmessage = (ev) => {
            console.log('raw msg =====\n',ev.data);

            let rawString = ev.data;
            let rawJSON = JSON.parse(rawString);
            let payload = rawJSON.payload;
            let action = rawJSON.action;

            if (action === 'respondAI') {
                setImages(payload.answer)
            }
            setLogs((prev): any => {
                return [...prev, JSON.stringify(rawJSON, null, 2)]
            })
        }

        return () => {
            clean()
        }
    }, [connectionURL])

    //

    return <>
        {status === 'loading' && <>
            <div className="mb-3">
                <BlueBlock value={connectionURL} text="Loading..." color="blue"></BlueBlock>
            </div>
        </>}
        {status === 'open' && <>
            <div className="mb-3">
                <GreenBlock value={connectionURL} text="Ready!" color="blue"></GreenBlock>
            </div>

            <div className="mb-3">
                {wss && <>
                    <TextQueryImage wss={wss} clientID={clientID}></TextQueryImage>
                </>}
            </div>

            <div className="flex space-x-4 space-y-4 flex-wrap">
                {images.map((r: any)=>{
                    return <div key={r.fileKey}>
                        <img alt={'img'} className="w-[200px] h-[200px] shrink-0 object-contain" src={r.contentURL}></img>
                    </div>
                })}
            </div>
    
            <pre>{logs.join('\n')}</pre>
        </>}
    
    </>
}


function BlueBlock ({value = '', color = 'blue', text= 'Loading...' }) {
    let refStatus = useRef<HTMLSpanElement>(null)


    //

    return  <div onClick={() =>{
    }} className={`rounded-lg py-2 px-3 bg-blue-200 text-blue-800 cursor-pointer  flex`}>
        <span ref={refStatus} className={`bg-blue-100 px-3 text-sm py-1 mx-2 select-none`}>{text}</span>
        <span className={`bg-blue-100 px-3 text-sm py-1 block`}>{value}</span>
    </div> 
}

function GreenBlock ({value = '', color = 'blue', text= 'Loading...' }) {
    let refStatus = useRef<HTMLSpanElement>(null)

    return  <div onClick={() =>{
    }} className={`rounded-lg py-2 px-3 bg-green-200 text-green-800 cursor-pointer  flex`}>
        <span ref={refStatus} className={`bg-green-100 px-3 text-sm py-1 mx-2 select-none`}>{text}</span>
        <span className={`bg-green-100 px-3 text-sm py-1 block`}>{value}</span>
    </div> 
}