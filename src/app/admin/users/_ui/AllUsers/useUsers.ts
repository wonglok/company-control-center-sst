import { create } from 'zustand'

export const useUsers = create(() => {
    return {
        loading: true,
        users: [],
    }
})
