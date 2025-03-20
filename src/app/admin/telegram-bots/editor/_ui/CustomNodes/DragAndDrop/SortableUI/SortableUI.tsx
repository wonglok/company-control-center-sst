//https://github.com/SortableJS/react-sortablejs

import React, { useState } from 'react'
// import { ReactSortable } from 'react-sortablejs'
import { ItemType, SortableRecursive } from './SortableRecursive'
import { useSort } from './useSort'

export const SortableUI = ({}) => {
    let list = useSort((r) => r.list)

    return (
        <>
            <div>
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
        </>
    )
}
