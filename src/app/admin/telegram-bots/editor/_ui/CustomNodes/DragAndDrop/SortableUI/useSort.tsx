'use client'

import { create } from 'zustand'

export const useSort = create<{
    list: any[]
}>(() => {
    return {
        list: [
            { id: 'sort2', type: 'variable', name: 'variable1', template: 'let {{ name }};', children: [] },
            { id: 'sort3', type: 'variable', name: 'variable2', template: 'let {{ name }};', children: [] },
            { id: 'sort4', type: 'variable', name: 'variable3', template: 'let {{ name }};', children: [] },
            {
                id: 'sort1',
                type: 'asyncFunc',
                name: 'myFunction',
                args: ``,
                template: `let {{name}} = async ({{args}}) => {
{{body}} 
}`,
                children: [
                    {
                        id: 'sort41',
                        type: 'funcCall',
                        name: 'method1A',
                        result: '',
                        template: 'let {{ result }} = await {{name}}();',
                        children: [],
                    },
                    {
                        id: 'sort42',
                        type: 'funcCall',
                        name: 'method2A',
                        result: '',
                        template: 'let {{ result }} = await {{name}}();',
                        children: [],
                    },
                    {
                        id: 'sort43',
                        type: 'funcCall',
                        name: 'method3A',
                        result: '',
                        template: 'let {{ result }} = await {{name}}();',
                        children: [],
                    },
                ],
            },
            {
                id: 'sort17',
                type: 'funcCall',
                name: 'myFunction',
                result: 'output',
                template: 'let {{ result }} = await {{name}}();',
                children: [],
            },
        ],
    }
})
