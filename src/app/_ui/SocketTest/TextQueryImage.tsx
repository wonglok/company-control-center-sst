import { useRef } from "react"
import { v4 } from "uuid"
import md5 from "md5"

export function TextQueryImage({ wss , clientID}: { clientID:string, wss: WebSocket }) {
    let refInput = useRef<HTMLInputElement>(null)

    return <>

        <input type="text" ref={refInput} className="w-full bg-gray-200 p-2 mx-3 mb-3" defaultValue={'what is your favrouite food?'}></input>
        <br/>
        
        <button className="mx-3 px-3 py-1 bg-blue-100 text-sm text-blue-800 border-blue-500 border rounded-lg" onClick={() =>{
            wss.send(JSON.stringify({
                action: 'requestAI',
                payload: {
                    requestID: `${md5(`${v4}`)}`,
                    clientID: clientID,
                    type: 'text-search-image',
                    query: refInput.current?.value
                }
            }))
        }}>text-search-image</button>
    </>
}

