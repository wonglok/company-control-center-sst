import { create } from 'zustand'

export const useUsers = create(() => {
    return {
        users: [],
    }
})
