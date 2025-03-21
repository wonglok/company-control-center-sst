'use client'
import { DndContext } from '@dnd-kit/core'
import { Draggable } from './Draggable'
import { Droppable } from './Droppable'

import { Suspense, useCallback, useEffect, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { useRemoveUI } from '../../../[botID]/removeBtn';
import dynamic from 'next/dynamic';
// import { SortableDnD } from './SortableDnD/SortableDnD';
import { BotEditorIn } from '../../../[botID]/AppPage';
import { Button } from '@/components/ui/button';
// import { useFlow } from '../../../[botID]/useFlow';
import { SortableUI } from '../../SortableUI/SortableUI';
import { SortableRecursive } from '../../SortableUI/SortableRecursive';
// import TileList from './ListDnD/TileList';
// import { HorizontalList } from './ListDnD/HorizontalList';
// import { HorizontalList } from './ListDnD/HorizontalList';

const handleStyle = { left: 10 };


// let SortableUI = dynamic(() => import('../../SortableUI/SortableUI').then(r => r.SortableUI), { ssr: false })

export function ProcedureNode({ id, data }) {
    let { remove } = useRemoveUI({ id })

    // const onChange = useCallback((evt) => {
    //     console.log(evt.target.value);
    // }, []);

    let [show, setShow] = useState(false)

    useEffect(() => {
        //

        let hh = (ev) => {
            if (ev.key === 'Escape') {
                setShow(false)

            }
        }

        window.addEventListener('keydown', hh)

        return () => {
            window.removeEventListener('keydown', hh)
        }        //
    }, [])

    return <>
        <div className='bg-white w-[450px] h-full p-2 rounded-lg  border border-gray-500 ' onDragStartCapture={(ev) => {
            ev.stopPropagation()
        }}>
            <button className='dragHandle bg-sky-300 w-full h-8'></button>
            <Handle type="target" position={Position.Left} />

            {/* <div>
                <label htmlFor="text" className='mr-3'>Text:</label>
                <input id="text" name="text" onChange={onChange} className="nodrag border border-gray-300" />
            </div> */}

            <Handle type="source" position={Position.Right} id="a" />
            <Handle
                type="source"
                position={Position.Bottom}
                id="b"
                style={handleStyle}
            />

            <div className='w-full hfull relative'>
                {/* <SortableUI></SortableUI> */}
                <Button onClick={() => {
                    setShow(!show)
                }}>Edit</Button>

                {remove}

                <SortableRecursive
                    key={JSON.stringify([data, show])}
                    mode={'clone'}
                    onChange={(list, level) => { }}
                    level={0}
                    list={data.list || []}
                ></SortableRecursive>
            </div>

            {show && <BotEditorIn>
                <div className=' absolute z-[2000] top-0 left-0 w-full h-full bg-gray-200 rounded-xl '>
                    <div className=' absolute top-0 right-0'>
                        <Button variant={'destructive'} onClick={() => {
                            setShow(false)
                        }}>Close</Button>
                    </div>
                    <SortableUI id={id} data={data}></SortableUI>
                </div>
            </BotEditorIn>}

        </div>
    </>
}

