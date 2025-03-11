import { create } from 'zustand'
export const useConnected = create<{
    socket: WebSocket
    socketURL: string
    online: any[]
}>((set: any, get: any): any => {
    return {
        socket: false,
        socketURL: '',
        online: [],
    }
})
