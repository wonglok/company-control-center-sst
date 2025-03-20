import md5 from 'md5'
import { useEffect, useState } from 'react'
import { ReactSortable } from 'react-sortablejs'
import { v4 } from 'uuid'

//

export interface ItemType {
    id: string
    name: string
    children: ItemType[]
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
    const [state, setState] = useState<ItemType[]>(list)

    useEffect(() => {
        onChange(list, level)
    }, [state])

    //

    //

    return (
        <div className='border-l-4 border-t-4 pl-4 pt-4 mb-4 h-full min-w-52 inline-block bg-blue-500 bg-opacity-20'>
            <ReactSortable
                setList={(newState: ItemType[]) => {
                    setState(
                        newState.map((r) => {
                            return r
                        }),
                    )
                }}
                animation={400}
                group='shared'
                list={state}
            >
                {/*  */}
                {state.map((item) => (
                    <div className='h-full w-full text-black bg-opacity-20' key={item.id}>
                        <div className=' text-blue-800 mb-4'>{item.name}</div>

                        <div className=''>
                            {item?.children?.length > 0 ? (
                                <SortableRecursive
                                    onChange={(list, level) => {
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
