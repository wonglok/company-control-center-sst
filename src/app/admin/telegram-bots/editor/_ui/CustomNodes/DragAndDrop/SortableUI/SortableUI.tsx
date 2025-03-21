'use client'
//https://github.com/SortableJS/react-sortablejs

import React, { useState } from 'react'
// import { ReactSortable } from 'react-sortablejs'
import { SortableRecursive } from './SortableRecursive'
import { useSort } from './useSort'
import { codeGen } from './codeGen'

export const SortableUI = ({}) => {
    let list = useSort((r) => r.list)

    return (
        <>
            <div className='bg-white bg-opacity-40'>
                <SortableRecursive
                    onChange={(list, level) => {
                        console.log(list, level)

                        if (level === 0) {
                            useSort.setState({
                                list: list,
                            })
                        }
                    }}
                    level={0}
                    list={list}
                ></SortableRecursive>
            </div>

            <div className=' whitespace-pre-wrap'>{codeGen(list)}</div>
        </>
    )
}
