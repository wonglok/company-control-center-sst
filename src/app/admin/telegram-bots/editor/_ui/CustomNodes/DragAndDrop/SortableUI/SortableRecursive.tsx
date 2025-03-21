import {
    faArrowRight,
    faCaretDown,
    faCloud,
    faCode,
    faGear,
    faLightbulb,
    faMultiply,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
        <div className='h-full min-w-52 inline-block  pb-4'>
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
                //
                animation={300}
                group='shared'
                list={state}
            >
                {state.map((item) => (
                    <div
                        className='px-2 bg-blue-500 border-4 h-full w-full text-black bg-opacity-20  mb-1'
                        key={item.id}
                    >
                        {item.type === 'asyncFunc' && (
                            <div className='py-1 pb-5 flex items-center text-blue-800 text-sm'>
                                <FontAwesomeIcon icon={faCode} className='mr-2'></FontAwesomeIcon>{' '}
                                <input
                                    className='inline-block w-24 appearance-none bg-transparent outline-none ml-2 border-b-2 focus:outline-none'
                                    type='text'
                                    value={item.name}
                                    onChange={(ev) => {
                                        setState((state) => {
                                            return [
                                                ...state.map((r) => {
                                                    if (item.id === r.id) {
                                                        return {
                                                            ...r,
                                                            name: ev.target.value,
                                                        }
                                                    }
                                                    return r
                                                }),
                                            ]
                                        })
                                    }}
                                ></input>{' '}
                                <input
                                    className='inline-block w-24 appearance-none bg-transparent outline-none ml-2 border-b-2 focus:outline-none'
                                    type='text'
                                    value={item.args}
                                    onChange={(ev) => {
                                        setState((state) => {
                                            return [
                                                ...state.map((r) => {
                                                    if (item.id === r.id) {
                                                        return {
                                                            ...r,
                                                            args: ev.target.value,
                                                        }
                                                    }
                                                    return r
                                                }),
                                            ]
                                        })
                                    }}
                                ></input>
                            </div>
                        )}

                        {item.type === 'funcCall' && (
                            <div className='py-1 flex items-center text-blue-800 text-sm'>
                                <FontAwesomeIcon icon={faGear} className='mr-2'></FontAwesomeIcon>{' '}
                                <input
                                    className='inline-block w-24 appearance-none bg-transparent outline-none ml-2 border-b-2 focus:outline-none'
                                    type='text'
                                    value={item.name}
                                    onChange={(ev) => {
                                        setState((state) => {
                                            return [
                                                ...state.map((r) => {
                                                    if (item.id === r.id) {
                                                        return {
                                                            ...r,
                                                            name: ev.target.value,
                                                        }
                                                    }
                                                    return r
                                                }),
                                            ]
                                        })
                                    }}
                                ></input>
                                <input
                                    className='inline-block w-24 appearance-none bg-transparent outline-none ml-2 border-b-2 focus:outline-none'
                                    type='text'
                                    value={item.args}
                                    onChange={(ev) => {
                                        setState((state) => {
                                            return [
                                                ...state.map((r) => {
                                                    if (item.id === r.id) {
                                                        return {
                                                            ...r,
                                                            args: ev.target.value,
                                                        }
                                                    }
                                                    return r
                                                }),
                                            ]
                                        })
                                    }}
                                ></input>
                            </div>
                        )}

                        {item.type === 'variable' && (
                            <div className='py-1 flex items-center text-blue-800 text-sm'>
                                <FontAwesomeIcon icon={faLightbulb} className='mr-2'></FontAwesomeIcon>
                                <input
                                    className='inline-block w-24 appearance-none bg-transparent outline-none ml-2 border-b-2 focus:outline-none'
                                    type='text'
                                    value={item.name}
                                    onChange={(ev) => {
                                        setState((state) => {
                                            return [
                                                ...state.map((r) => {
                                                    if (item.id === r.id) {
                                                        return {
                                                            ...r,
                                                            name: ev.target.value,
                                                        }
                                                    }
                                                    return r
                                                }),
                                            ]
                                        })
                                    }}
                                ></input>
                            </div>
                        )}

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
