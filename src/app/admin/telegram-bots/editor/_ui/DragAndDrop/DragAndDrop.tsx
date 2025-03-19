'use client'
import { DndContext } from '@dnd-kit/core'
import { Draggable } from './Draggable'
import { Droppable } from './Droppable'

export function DragAndDrop() {
    return (
        <>
            <DndContext
                onDragEnd={(ev) => {
                    console.log(ev)
                }}
            >
                <Droppable>Dropable</Droppable>

                {/*  */}
                <Draggable item={{ _id: `drag1` }}>Dragable</Draggable>
                <Draggable item={{ _id: `drag2` }}>Dragable</Draggable>
            </DndContext>
        </>
    )
}
