'use client'

import { v4 } from 'uuid'
import { create } from 'zustand'

export const useSort = create<{
    list: any[]
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
                varName: 'peter',
                initVal: 'null',
                let: 'let',
                template: '{{ let }} {{ varName }} = {{ initVal }};',
            },
            {
                id: `__${v4()}`,
                type: 'funcCall',
                let: '',
                varName: 'var001',
                methodName: 'loadDB',
                methodArgs: '',
                template: '{{ let }} {{ varName }} = await {{methodName}}({{methodArgs}});',
            },
        ],

        list: [],
    }
})
