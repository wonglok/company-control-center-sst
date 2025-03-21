'use client'

import { v4 } from 'uuid'
import { create } from 'zustand'

export const useSort = create<{
    list: any[]
    template: any[]
    examples: any[]
    recycle: any[]
}>(() => {
    return {
        //
        recycle: [],
        examples: [
            {
                //
                id: `__${v4()}`,
                type: 'variable',
                name: 'vari001',
                initVal: 'null',
                let: 'let',
                template: '{{let}} {{ name }} = {{ initVal }};',
            },
            {
                id: `__${v4()}`,
                type: 'funcCall',
                name: 'loadDB',
                result: 'var001',
                let: '',
                template: '{{let}} {{ result }} = await {{name}}();',
            },
        ],

        template: [],

        list: [
            //
        ],
    }
})
