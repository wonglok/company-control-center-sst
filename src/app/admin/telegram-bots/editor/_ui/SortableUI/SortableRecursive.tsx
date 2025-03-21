import {
    faArrowRight,
    faCaretDown,
    faCloud,
    faCode,
    faDotCircle,
    faFileCode,
    faGear,
    faLightbulb,
    faMultiply,
    faTerminal,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useMemo, useState } from 'react'
import { ReactSortable } from 'react-sortablejs'
import { useSort } from './useSort'
import md5 from 'md5'
import { v4 } from 'uuid'

export function SortableRecursive({
    mode = 'work',
    list = [],
    level = 0,
    onChange = (list: any, level: number) => {},
}: {
    mode: string
    onChange: (list: any, level: number) => void
    list: any[]
    level: number
}) {
    const [state, setState] = useState<any[]>([...list])

    useEffect(() => {
        if (mode === 'recycle') {
            setState(list)
        }
    }, [mode, list])

    useEffect(() => {
        onChange(state, level)
    }, [state])

    let ext = {}

    if (mode === 'clone') {
        ext = {
            pull: 'clone',
            put: false,
        }
    }
    if (mode === 'recycle') {
        ext = {
            put: true,
        }
    }

    let attr = {
        clone: (v: any) => v,
    }

    if (mode === 'clone') {
        attr.clone = (currentItem: any) => {
            return { ...currentItem, id: `__${v4()}` }
        }
    }
    return (
        <div className='h-full w-full min-w-52 inline-block'>
            <ReactSortable
                {...attr}
                filter={'.filtered'}
                setList={(newState: any[]) => {
                    setState(
                        newState
                            .map((r) => {
                                return {
                                    ...r,
                                    id: r.id,
                                }
                            })
                            .sort((a, b) => {
                                if (a.disabled) {
                                    return -1111111
                                } else {
                                    return 0
                                }
                            }),
                    )
                }}
                //
                //
                animation={300}
                group={{
                    name: 'shared',
                    ...ext,
                }}
                list={state}
                className='min-h-24  bg-gradient-to-tr from-white to-gray-200'
            >
                {state.map((item) => {
                    return (
                        <EachItem
                            list={list}
                            level={level}
                            key={item.id}
                            item={item}
                            mode={mode}
                            onChange={onChange}
                            onSaveItem={(key: string, val: any) => {
                                setState((state) => {
                                    return [
                                        ...state.map((r) => {
                                            if (item.id === r.id) {
                                                return {
                                                    ...r,
                                                    [key]: val,
                                                }
                                            }
                                            return r
                                        }),
                                    ]
                                })
                            }}
                        ></EachItem>
                    )
                })}

                {/*  */}
            </ReactSortable>
        </div>
    )
}

function EachItem({ list, item, onSaveItem, level, onChange, clone, mode }: any) {
    let listRoot = useSort((r) => r.list)
    let linearList = useMemo(() => {
        let arr: any = []

        let walk = (list: any) => {
            list.forEach((it: any) => {
                arr.push(it)
                if (list.children) {
                    walk(list.children)
                }
            })
        }

        walk(listRoot)

        return arr
    }, [listRoot])

    useEffect(() => {
        onChange(list, level)
    }, [item])

    return (
        <>
            {/* {item.disabled && list.length <= 1 && <div className='h-[30px] w-full bg-white opacity-25 filtered'></div>} */}
            {!item.disabled && (
                <div className={`px-2 bg-blue-500 border-4 h-full w-full text-black bg-opacity-20 `}>
                    {item.type === 'asyncFunc' && (
                        <div className='py-1 pb-5 flex items-center text-blue-800 text-sm'>
                            <FontAwesomeIcon icon={faTerminal} className='mx-1 '></FontAwesomeIcon>
                            <input
                                className='inline-block w-24 appearance-none bg-transparent ml-2 outline-none border-b-2 focus:outline-none'
                                type='text'
                                value={item.name}
                                onChange={(ev) => {
                                    onSaveItem('name', ev.target.value)
                                }}
                            ></input>
                            {`(`}
                            <input
                                className='inline-block w-10 appearance-none bg-transparent outline-none ml-2 border-b-2 focus:outline-none'
                                type='text'
                                value={item.args}
                                onChange={(ev) => {
                                    onSaveItem('args', ev.target.value)
                                }}
                            ></input>
                            {`)`}
                        </div>
                    )}

                    {item.type === 'funcCall' && (
                        <div className='py-1 flex items-center text-blue-800 text-sm'>
                            {`let `}
                            <select
                                name='result'
                                className='mx-2'
                                value={item.result}
                                onChange={(ev) => {
                                    onSaveItem('result', ev.target.value)
                                }}
                            >
                                <option value={`__${md5(item)}`}>default variable</option>
                                <option value={`v0`}>custom variable</option>
                                {linearList
                                    .filter((r: any) => r.type === 'variable')
                                    .map((li: any) => {
                                        return (
                                            <option key={li.id} value={li.name}>
                                                {li.name}
                                            </option>
                                        )
                                    })}
                            </select>
                            <input
                                className='inline-block w-24 appearance-none bg-transparent outline-none ml-2 border-b-2 focus:outline-none'
                                type='text'
                                value={item.result || ``}
                                onChange={(ev) => {
                                    onSaveItem('result', ev.target.value)
                                }}
                            ></input>
                            {`=`}
                            <input
                                className='inline-block w-24 appearance-none bg-transparent outline-none ml-2 border-b-2 focus:outline-none'
                                type='text'
                                value={item.name}
                                onChange={(ev) => {
                                    onSaveItem('name', ev.target.value)
                                }}
                            ></input>

                            {`(`}
                            <input
                                className='inline-block w-6 appearance-none bg-transparent outline-none border-b-2 focus:outline-none'
                                type='text'
                                value={item.args || ''}
                                onChange={(ev) => {
                                    onSaveItem('args', ev.target.value)
                                }}
                            ></input>
                            {`)`}
                        </div>
                    )}

                    {item.type === 'variable' && (
                        <div className='py-1 flex items-center text-blue-800 text-sm'>
                            <FontAwesomeIcon icon={faLightbulb} className='mx-1 '></FontAwesomeIcon>
                            <input
                                className='inline-block w-24 appearance-none bg-transparent outline-none ml-2 border-b-2 focus:outline-none'
                                type='text'
                                value={item.name}
                                onChange={(ev) => {
                                    onSaveItem('name', ev.target.value)
                                }}
                            ></input>
                        </div>
                    )}

                    {item.children && (
                        <SortableRecursive
                            mode={mode}
                            level={level + 1}
                            list={item?.children}
                            onChange={onChange}
                        ></SortableRecursive>
                    )}
                </div>
            )}
        </>
    )
}
