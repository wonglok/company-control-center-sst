import { create } from 'zustand'
export const useConnected = create(() => {

    return {
        socketURL: '',
        online: []
    }
})