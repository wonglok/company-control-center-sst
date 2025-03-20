'use client'

import React, { useEffect, useState } from 'react'

const Item = props => {
    const dnd = props.dnd

    let classes = 'el no-select';
    if (props.itemInDrag) classes += ' active'

    return (
        <li
            style={{ ...dnd.item.styles, ...dnd.handler.styles }}
            className={dnd.item.classes}
            ref={dnd.item.ref}
            {...dnd.handler.listeners}
        >
            <div
                className={classes}
                style={{ ...props.item.style }}
            >
                {props.item.value}
            </div>
        </li>
    )
}

const TileList = props => {
    const [list, setList] = useState(props.items)

    let [DnDListInst, setDND] = useState(null)
    useEffect(() => {
        import('react-dnd-list').then(r => {
            console.log(r)
            setDND(<r.default
                items={list}
                itemComponent={Item}
                setList={setList}
                setSwapThreshold={size => size * .75}
                setOverflowThreshold={() => 50}
            />)
        })
    }, [list])

    return (
        <ul className="w-full h-full">
            {DnDListInst}
            {/* {DnDList && } */}
        </ul>
    )
}

export default TileList