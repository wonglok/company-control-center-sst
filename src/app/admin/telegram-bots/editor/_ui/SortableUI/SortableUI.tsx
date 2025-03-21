'use client'
//https://github.com/SortableJS/react-sortablejs

// import { ReactSortable } from 'react-sortablejs'
import { SortableRecursive } from './SortableRecursive'
import { useSort } from './useSort'
import { codeGen } from './codeGen'
import { useEffect } from 'react'
import { getTelegramBot } from '@/actions/telegram/getTelegramBot'
import { useParams } from 'next/navigation'
import { ReactSortable } from 'react-sortablejs'
import { ItemArchive } from './ItemArchive'

export const SortableUI = ({}) => {
    let recycle = useSort((r) => r.recycle)
    let list = useSort((r) => r.list)
    let examples = useSort((r) => r.examples)

    let params = useParams()
    useEffect(() => {
        getTelegramBot({ item: { itemID: params.botID } }).then((data: any) => {
            useSort.setState({
                list: data.procedure || useSort.getState().template,
            })
        })
    }, [])

    return (
        <>
            <div>
                <div className='w-full ' style={{ minHeight: `100px` }}>
                    <div>
                        <button
                            onClick={() => {
                                useSort.setState({
                                    recycle: recycle.filter((r) => r.type === 'disabled'),
                                })
                            }}
                        >
                            Empty
                        </button>
                    </div>

                    <div>
                        <SortableRecursive
                            mode={'recycle'}
                            key={recycle.map((r) => JSON.stringify(r)).join('')}
                            onChange={(list, level) => {}}
                            level={0}
                            list={recycle}
                        ></SortableRecursive>
                    </div>
                </div>

                <div className='w-full flex' style={{ height: `calc(100% - 100px)` }}>
                    <div className='w-1/2'>
                        <SortableRecursive
                            mode={'clone'}
                            onChange={(list, level) => {}}
                            level={0}
                            list={examples}
                        ></SortableRecursive>
                    </div>

                    {list && list.length && (
                        <>
                            <div className='w-1/2'>
                                <div className='bg-white bg-opacity-40 w-full'>
                                    <SortableRecursive
                                        key={list.map((r) => r.id).join('___')}
                                        mode={'work'}
                                        onChange={(list, level) => {
                                            if (level === 0) {
                                                console.log(list, level)
                                                useSort.setState({
                                                    list: JSON.parse(JSON.stringify(list)),
                                                })
                                            }
                                        }}
                                        level={0}
                                        list={[...list]}
                                    ></SortableRecursive>
                                </div>

                                <div className=' whitespace-pre-wrap w-full'>{codeGen(list) || ''}</div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}
