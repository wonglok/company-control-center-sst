import React, { useEffect, useState } from 'react'

import TileList from './TileList'

const Item = props => {
    const dnd = props.dnd
    const cardClasses = props.itemInDrag ? ' in-drag' : ' card'

    return (
        <div
            style={dnd.item.styles}
            className={dnd.item.classes + ' w-full'}
            ref={dnd.item.ref}
        >
            <div className={cardClasses}>
                <div className="card-header">
                    <span>List {props.item.index}</span>
                    <span
                        className="drag-handler no-select"
                        style={dnd.handler.styles}
                        {...dnd.handler.listeners}
                    >=</span>
                </div>
                {props.item.component}
            </div>
        </div>
    )
}

export const HorizontalList = () => {
    let [DnDListInst, setDND] = useState(false)
    useEffect(() => {
        import('react-dnd-list').then(r => {
            console.log(r)

            setDND(<r.default
                horizontal
                items={list}
                itemComponent={Item}
                setList={setList}
                setSwapThreshold={size => size * .5}
                setOverflowThreshold={() => 100}
            />)
        })
    }, [])

    return (
        <div className="flex w-full h-full">
            <TileList
                items={[
                    { value: 1, style: { width: '100%', backgroundColor: `hsl(${10}, 50%, 50%)`, height: `75px` } },
                    { value: 2, style: { width: '100%', backgroundColor: `hsl(${20}, 50%, 50%)`, height: `75px` } },
                    { value: 3, style: { width: '100%', backgroundColor: `hsl(${30}, 50%, 50%)`, height: `75px` } },
                    { value: 4, style: { width: '100%', backgroundColor: `hsl(${40}, 50%, 50%)`, height: `75px` } },
                    { value: 5, style: { width: '100%', backgroundColor: `hsl(${50}, 50%, 50%)`, height: `75px` } },
                ]}
            />
        </div>
    )
}

