import { useState } from 'react'
import { ReactSortable } from 'react-sortablejs'
import { useSort } from './useSort'

export function ItemArchive() {
    let examples = useSort(r => r.examples)
    let [list, setList] = useState(examples)

    return <>
        <ReactSortable
            setList={setList}
            animation={300}
            group='shared'
            list={list}
        >
            {list.map((item) => {
                return (
                    <div key={item.id}></div>
                )
            })}
        </ReactSortable>
    </>
}
