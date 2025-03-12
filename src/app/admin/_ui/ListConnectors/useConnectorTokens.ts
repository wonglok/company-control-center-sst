import { create } from 'zustand'

export const useConnectorTokens = create<
    | any
    | {
          tokens: []
      }
>(() => {
    return {
        online: [],
        loading: true,
        tokens: [],
    }
})
