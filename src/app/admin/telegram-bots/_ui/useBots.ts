import { create } from 'zustand'

export const useBots = create<{
    bots: []
}>(() => {
    return {
        bots: [],
    }
})
