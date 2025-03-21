import {
    faArrowRight,
    faCaretDown,
    faCloud,
    faCode,
    faCodeBranch,
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
import { v4 } from 'uuid'
// import md5 from 'md5'
// import { v4 } from 'uuid'

// let insert = (arr: any, insert: any) => {
//     arr.forEach((it: any, idx: any, nn: any) => {
//         if (it.id === insert.id) {
//             nn[idx] = insert
//         }

//         if (arr.children) {
//             insert(arr.children, insert)
//         }
//     })
// }

export function SortableRecursive({
    mode = 'work',
    list = [],
    level = 0,
    onChange = () => {},
}: {
    onChange: any
    mode: string
    list: any[]
    level: number
}) {
    let setState = (v: any) => {
        onChange(v, level)
    }

    useEffect(() => {
        if (mode === 'recycle') {
            setState(list)
        }
    }, [mode, list])

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

    return (
        <div className='h-full w-full min-w-52 inline-block'>
            <ReactSortable
                clone={(item) => {
                    return {
                        ...item,
                        id: `__${v4()}`,
                    }
                }}
                filter={'.filtered'}
                setList={(newState: any[]) => {
                    onChange([...newState], level)
                }}
                animation={300}
                group={{
                    name: 'shared',
                    ...ext,
                }}
                list={list}
                className={'min-h-[12] pb-12 bg-gradient-to-tr from-white to-gray-200 ' + ``}
            >
                {list.map((item) => {
                    return (
                        <EachItem
                            list={list}
                            level={level}
                            key={item.id}
                            item={item}
                            mode={mode}
                            onSaveItem={(key: string, val: any) => {
                                setState(
                                    list.map((r) => {
                                        if (item.id === r.id) {
                                            return {
                                                ...r,
                                                [key]: val,
                                            }
                                        }
                                        return { ...r }
                                    }),
                                )
                            }}
                        ></EachItem>
                    )
                })}

                {/*  */}
            </ReactSortable>
        </div>
    )
}

function EachItem({ list, item, onSaveItem, level, clone, mode }: any) {
    //

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

    return (
        <>
            {/* {item.disabled && list.length <= 1 && <div className='h-[30px] w-full bg-white opacity-25 filtered'></div>} */}
            {!item.disabled && (
                <div className={`px-2 bg-blue-500 border-4 h-full w-full text-black bg-opacity-20 overflow-hidden`}>
                    {item.type === 'asyncFunc' && (
                        <div className='py-1 flex items-center text-blue-800 text-sm'>
                            <FontAwesomeIcon icon={faCode} className='mx-1 h-3 '></FontAwesomeIcon>
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
                            <FontAwesomeIcon icon={faTerminal} className='mx-1 h-3 '></FontAwesomeIcon>
                            <select
                                name='let'
                                className='mx-2 text-xs'
                                value={item.let}
                                onChange={(ev) => {
                                    onSaveItem('let', ev.target.value)
                                }}
                            >
                                <option value={`let`}>let</option>
                                <option value={`   `}> </option>
                            </select>

                            <select
                                name='result'
                                className='mx-2 text-xs'
                                value={item.result}
                                onChange={(ev) => {
                                    onSaveItem('result', ev.target.value)
                                }}
                            >
                                <option value={`v0`}>custom</option>
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
                            <FontAwesomeIcon icon={faLightbulb} className='mx-1 h-3 '></FontAwesomeIcon>
                            {`let `}
                            <input
                                className='inline-block w-24 appearance-none bg-transparent outline-none ml-2 border-b-2 focus:outline-none'
                                type='text'
                                value={item.name}
                                onChange={(ev) => {
                                    onSaveItem('name', ev.target.value)
                                }}
                            ></input>
                            {` = `}
                            <input
                                className='inline-block w-20 appearance-none bg-transparent ml-2 outline-none border-b-2 focus:outline-none'
                                type='text'
                                value={item.initVal || ''}
                                onChange={(ev) => {
                                    onSaveItem('initVal', ev.target.value)
                                }}
                            ></input>
                            {`;`}
                        </div>
                    )}

                    {item.children && (
                        <SortableRecursive
                            mode={mode}
                            level={level + 1}
                            list={item?.children}
                            onChange={() => {}}
                        ></SortableRecursive>
                    )}
                </div>
            )}
        </>
    )
}
