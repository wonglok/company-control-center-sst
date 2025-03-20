
import { useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';
import { useRemoveUI } from '../../../[botID]/removeBtn';

const handleStyle = { left: 10 };

export function WorkNode({ id, data }) {
    let { remove } = useRemoveUI({ id })

    const onChange = useCallback((evt) => {
        console.log(evt.target.value);
    }, []);


    return <>
        <div className='bg-white w-full h-full p-2 rounded-lg  border border-gray-500 '>
            <Handle type="target" position={Position.Top} />
            <div>
                <label htmlFor="text" className='mr-3'>Text:</label>
                <input id="text" name="text" onChange={onChange} className="nodrag border border-gray-300" />
            </div>
            <Handle type="source" position={Position.Bottom} id="a" />
            <Handle
                type="source"
                position={Position.Bottom}
                id="b"
                style={handleStyle}
            />

            {remove}
        </div>
    </>
}
