'use client'
import { DndContext } from '@dnd-kit/core'
import { Draggable } from './Draggable'
import { Droppable } from './Droppable'

import { Suspense, useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';
import { useRemoveUI } from '../../../[botID]/removeBtn';
import { SortableUI } from './SortableUI/SortableUI';
// import TileList from './ListDnD/TileList';
// import { HorizontalList } from './ListDnD/HorizontalList';
// import { HorizontalList } from './ListDnD/HorizontalList';

const handleStyle = { left: 10 };


export function ProcedureNode({ id, data }) {


    let { remove } = useRemoveUI({ id })

    const onChange = useCallback((evt) => {
        console.log(evt.target.value);
    }, []);


    return <>
        <div className='bg-white w-[300px] h-full p-2 rounded-lg  border border-gray-500 ' onDragStartCapture={(ev) => {
            ev.stopPropagation()
        }}>
            <button className='dragHandle bg-red-500 w-full h-8'></button>
            <Handle type="target" position={Position.Left} />
            <div>
                <label htmlFor="text" className='mr-3'>Text:</label>
                <input id="text" name="text" onChange={onChange} className="nodrag border border-gray-300" />
            </div>
            <Handle type="source" position={Position.Right} id="a" />
            <Handle
                type="source"
                position={Position.Bottom}
                id="b"
                style={handleStyle}
            />

            <div className='w-full hfull relative'>
                <SortableUI ></SortableUI>
                {/* <ReactDnD></ReactDnD> */}

            </div>

            {/* <DndContext
                onDragEnd={(ev) => {
                    console.log('end', ev)
                }}
                onDragStart={(ev) => {
                    console.log('start', ev)
                }}
            >
                <Droppable item={{ _id: 'droppable-01' }}>Dropable 01</Droppable>
                <Droppable item={{ _id: 'droppable-02' }}>Dropable 02</Droppable>

                <Draggable item={{ _id: `drag1` }}>Dragable 01</Draggable>
                <Draggable item={{ _id: `drag2` }}>Dragable 02</Draggable>
            </DndContext> */}

            {remove}
        </div>
    </>
}

