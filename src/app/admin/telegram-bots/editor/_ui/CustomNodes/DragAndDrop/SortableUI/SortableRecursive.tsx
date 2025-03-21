import { useEffect, useState } from 'react'
import { ReactSortable } from 'react-sortablejs'

//
//

export interface ItemType {
    id: string
    type: string
    name: string
    template: string
    children: ItemType[]
    args: string | undefined
}

export function SortableRecursive({
    list = [],
    level = 0,
    onChange = (list: any, level: number) => {},
}: {
    onChange: (list: any, level: number) => void
    list: ItemType[]
    level: number
}) {
    const [state, setState] = useState<ItemType[]>([...list])

    useEffect(() => {
        onChange(state, level)
    }, [state])

    return (
        <div className='border-4 border-white px-2 pt-2 mb-2 h-full min-w-52 inline-block bg-blue-500 bg-opacity-20'>
            <ReactSortable
                setList={(newState: ItemType[]) => {
                    setState(
                        newState.map((r) => {
                            return {
                                ...r,
                                id: r.id,
                            }
                        }),
                    )
                }}
                animation={400}
                group='shared'
                list={state}
            >
                {/*  */}
                {state.map((item) => (
                    <div className='p-1 h-full w-full text-black bg-opacity-20' key={item.id}>
                        <div className=' text-blue-800 mb-4'>
                            {item.type}: {item.name} {item.args || ''}
                        </div>

                        <div className=''>
                            {item?.children?.length > 0 ? (
                                <SortableRecursive
                                    onChange={(list, lvl) => {
                                        //
                                        //
                                        if (level === lvl - 1) {
                                            setState(
                                                state.map((r) => {
                                                    if (r.id === item.id) {
                                                        return {
                                                            ...item,
                                                            children: list,
                                                        }
                                                    }
                                                    return r
                                                }),
                                            )
                                        }
                                    }}
                                    level={level + 1}
                                    list={item?.children}
                                ></SortableRecursive>
                            ) : (
                                <div className=''></div>
                            )}
                        </div>
                    </div>
                ))}
                {/*  */}
            </ReactSortable>
        </div>
    )
}
