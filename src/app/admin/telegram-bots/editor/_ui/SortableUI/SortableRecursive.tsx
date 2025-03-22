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
    let ext = {}

    if (mode === 'clone') {
        ext = {
            pull: 'clone',
            put: false,
        }
    }
    if (mode === 'recycle') {
        ext = {}
    }

    let clone: any = (v: any) => v

    if (mode === 'clone') {
        clone = (raw: any) => {
            let item = JSON.parse(JSON.stringify(raw))
            item.id = `__${v4()}`

            let walk = (list: any) => {
                list.forEach((it: any) => {
                    it.id = `__${v4()}`
                    if (it.children) {
                        walk(it.children)
                    }
                })
            }

            if (item.children) {
                walk(item.children)
            }
            return item
        }
    }

    return (
        <div className='h-full w-full min-w-52 inline-block'>
            <ReactSortable
                id={`__${v4()}`}
                clone={(item: any) => {
                    return {
                        ...item,
                        id: `__${v4()}`,
                    }
                }}
                filter={'.filtered'}
                setList={(newState: any[]) => {
                    onChange(newState, level)
                }}
                animation={300}
                group={{
                    name: 'shared',
                    ...ext,
                }}
                list={list}
                className={
                    'min-h-[100px] pb-12 ' +
                    `${mode === 'recycle' ? `bg-gradient-to-tr from-sky-200 to-teal-500 ` : ` bg-gradient-to-tr from-white to-gray-200  `}`
                }
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
                                onChange(
                                    list.map((r) => {
                                        if (item.id === r.id) {
                                            return {
                                                ...r,
                                                [key]: val,
                                            }
                                        }
                                        return { ...r }
                                    }),
                                    level,
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

function EachItem({ item, onSaveItem, level, mode }: any) {
    //

    let listRoot = useSort((r) => r.list)

    let linearList = useMemo(() => {
        let arr: any = []

        let walk = (list: any) => {
            list.forEach((it: any) => {
                arr.push(it)
                if (it.children) {
                    walk(it.children)
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
                        <>
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

                            {/* {item.children && (
                                <SortableRecursive
                                    mode={mode}
                                    level={level + 1}
                                    list={item?.children}
                                    onChange={(lst: any, lvl: any) => {
                                        if (lvl === level) {
                                            onSaveItem('children', lst)
                                        }
                                    }}
                                ></SortableRecursive>
                            )} */}
                        </>
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
                                name='varName'
                                className='mx-2 text-xs w-14'
                                value={item.varName}
                                onChange={(ev) => {
                                    onSaveItem('varName', ev.target.value)
                                }}
                            >
                                <option value={`v0`}>custom</option>
                                {linearList
                                    .filter((r: any) => r.type === 'variable')
                                    .map((li: any) => {
                                        return (
                                            <option key={li.id} value={li.varName}>
                                                {li.varName}
                                            </option>
                                        )
                                    })}
                            </select>
                            <input
                                className='inline-block w-24 appearance-none bg-transparent outline-none ml-2 border-b-2 focus:outline-none'
                                type='text'
                                value={item.varName || ``}
                                onChange={(ev) => {
                                    onSaveItem('varName', ev.target.value)
                                }}
                            ></input>
                            {`=`}
                            <input
                                className='inline-block w-24 appearance-none bg-transparent outline-none ml-2 border-b-2 focus:outline-none'
                                type='text'
                                value={item.methodName}
                                onChange={(ev) => {
                                    onSaveItem('methodName', ev.target.value)
                                }}
                            ></input>

                            {`(`}
                            <input
                                className='inline-block w-20 appearance-none bg-transparent outline-none border-b-2 focus:outline-none'
                                type='text'
                                value={item.methodArgs || ''}
                                onChange={(ev) => {
                                    onSaveItem('methodArgs', ev.target.value)
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
                                value={item.varName}
                                onChange={(ev) => {
                                    onSaveItem('varName', ev.target.value)
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
                </div>
            )}
        </>
    )
}
