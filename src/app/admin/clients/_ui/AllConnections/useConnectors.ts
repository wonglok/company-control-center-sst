import { create } from 'zustand'

export const useConnectors = create<
    | any
    | {
          clients: []
      }
>(() => {
    return {
        loading: true,
        socketURL: false,
        online: [],
        clients: [],
    }
})
