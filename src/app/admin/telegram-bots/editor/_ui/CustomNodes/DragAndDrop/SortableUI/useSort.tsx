import { create } from 'zustand'
import { ItemType } from './SortableRecursive'

export const useSort = create<{
    list: ItemType[]
}>(() => {
    return {
        list: [
            {
                id: 'sort1',
                name: 'shrek1',
                children: [
                    {
                        id: 'sort31',
                        name: 'shrek31',
                        children: [
                            { id: 'sort22', name: 'shrek2', children: [] },
                            { id: 'sort32', name: 'shrek3', children: [] },
                            { id: 'sort42', name: 'shrek4', children: [] },
                            { id: 'sort52', name: 'fiona5', children: [] },
                        ],
                    },
                    { id: 'sort41', name: 'shrek41', children: [] },
                    { id: 'sort51', name: 'fiona51', children: [] },
                ],
            },
            { id: 'sort2', name: 'shrek2', children: [] },
            { id: 'sort3', name: 'shrek3', children: [] },
            { id: 'sort4', name: 'shrek4', children: [] },
            { id: 'sort5', name: 'fiona5', children: [] },
        ],
    }
})
