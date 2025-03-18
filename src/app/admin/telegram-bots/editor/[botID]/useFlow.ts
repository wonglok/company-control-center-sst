import { create } from 'zustand'

export const useFlow = create<any>(() => {
    return {
        //
        bot: false,
        //

        nodes: [],
        edges: [],
        //
        //
    }
})
