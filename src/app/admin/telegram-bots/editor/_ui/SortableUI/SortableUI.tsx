'use client'
//https://github.com/SortableJS/react-sortablejs

// import { ReactSortable } from 'react-sortablejs'
import { SortableRecursive } from './SortableRecursive'
import { useSort } from './useSort'
import { codeGen } from './codeGen'
import { useEffect } from 'react'
import { useFlow } from '../../[botID]/useFlow'
// import { getTelegramBot } from '@/actions/telegram/getTelegramBot'
// import { useParams } from 'next/navigation'
// import { ReactSortable } from 'react-sortablejs'
// import { ItemArchive } from './ItemArchive'

export const SortableUI = ({ id, data }: any) => {
    let recycle = useSort((r) => r.recycle)
    let list = useSort((r) => r.list)
    let examples = useSort((r) => r.examples)

    let nodes = useFlow((r) => r.nodes)
    let node = nodes.find((r: any) => r.id === id)

    // console.log(node)

    useEffect(() => {
        useSort.setState({
            list: node.data.list || [],
        })

        return useSort.subscribe((now, before) => {
            if (now.list && before.list) {
                node.data.list = now.list

                useFlow.setState({
                    nodes: [...useFlow.getState().nodes],
                })
            }
        })
    }, [node])

    return (
        <>
            <div className=' whitespace-pre-wrap w-full p-4'>{codeGen(list) || ''}</div>
            <div className='p-2 '>
                <div className='w-full ' style={{ minHeight: `100px` }}>
                    <div>
                        <button
                            className='text-xs p-2 bg-blue-500 text-white'
                            onClick={() => {
                                useSort.setState({
                                    recycle: recycle.filter((r) => r.type === 'disabled'),
                                })
                            }}
                        >
                            Empty Recycle Bin
                        </button>
                    </div>

                    <div className=''>
                        <SortableRecursive
                            mode={'recycle'}
                            key={recycle.map((r) => JSON.stringify(r)).join('')}
                            onChange={(list: any, level: any) => {}}
                            level={0}
                            list={recycle}
                        ></SortableRecursive>
                    </div>
                </div>

                <div className='w-full flex' style={{ minHeight: `calc(100px)` }}>
                    <div className='w-1/2 '>
                        <SortableRecursive
                            mode={'clone'}
                            onChange={(list: any, level: any) => {}}
                            level={0}
                            list={examples}
                        ></SortableRecursive>
                    </div>

                    {list && (
                        <>
                            <div className='w-1/2'>
                                <div className='bg-white bg-opacity-40 w-full'>
                                    <SortableRecursive
                                        key={list.map((r) => r.id).join('_')}
                                        mode={'work'}
                                        level={0}
                                        onChange={(lst: any, lvl: any) => {
                                            if (lvl === 0) {
                                                useSort.setState({
                                                    list: [...lst],
                                                })
                                            }
                                        }}
                                        list={[...list]}
                                    ></SortableRecursive>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}
