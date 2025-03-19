import { useFlow } from './useFlow'
import { addEdge, applyEdgeChanges, applyNodeChanges, Background, Controls, OnNodeDrag, ReactFlow } from '@xyflow/react'
import { useCallback, useEffect } from 'react'
import { edgeTypes } from '../_ui/CustomEdges'
import { nodeTypes } from '../_ui/CustomNodes'
import { v4 } from 'uuid'
import md5 from 'md5'
import '@xyflow/react/dist/style.css'
import { putTelegramBot } from '@/actions/telegram/putTelegramBot'
import { toast } from 'sonner'
import { getTelegramBot } from '@/actions/telegram/getTelegramBot'
import { useParams } from 'next/navigation'

export const Editor = () => {
    let nodes = useFlow((r) => r.nodes)
    let edges = useFlow((r) => r.edges)

    let setNodes = (func: any) => {
        if (typeof func === 'function') {
            let value = func(useFlow.getState().nodes)
            useFlow.setState({ nodes: value })

            return
        }
        useFlow.setState({ nodes: func })
    }
    let setEdges = (func: any) => {
        if (typeof func === 'function') {
            let value = func(useFlow.getState().edges)
            useFlow.setState({ edges: value })

            return
        }
        useFlow.setState({ edges: func })
    }

    const onNodesChange = useCallback((changes: any) => setNodes((nds: any) => applyNodeChanges(changes, nds)), [])
    const onEdgesChange = useCallback((changes: any) => setEdges((eds: any) => applyEdgeChanges(changes, eds)), [])

    const onConnect = useCallback(
        (connection: any) => {
            const edge = { ...connection, type: 'ButtonEdge' }
            setEdges((eds: any) => addEdge(edge, eds))
        },
        [setEdges],
    )

    const onNodeDrag: OnNodeDrag = (_, node) => {
        // console.log('drag event', node.data)
        setNodes((r: any) => {
            return [...r]
        })
    }

    const onAddWorkNode = () => {
        //
        setNodes((nodes: any) => [
            ...nodes,
            {
                id: `${md5(v4())}`,
                type: 'WorkNode',
                position: {
                    x: 0,
                    y: 0,
                },
                data: {},
            },
        ])

        //
    }

    let save = useCallback(({ bot }: any) => {
        return putTelegramBot({
            item: {
                ...bot,
                itemID: bot.itemID,
            },
        })
            .then(() => {
                toast.success('Successfully Updated')
            })
            .catch((r) => {
                console.error(r)
                toast.success('Error While Saving Record')
            })
    }, [])

    let params = useParams()
    useEffect(() => {
        if (!params.botID) {
            return
        }
        getTelegramBot({ item: { itemID: params.botID } }).then((bot: any) => {
            useFlow.setState({ bot: bot, ready: true, edges: bot.graph.edges, nodes: bot.graph.nodes })
        })
    }, [])

    let ready = useFlow((r) => r.ready)
    useEffect(() => {
        if (!ready) {
            return
        }

        let tt: any = 0
        let clean = useFlow.subscribe((now, before) => {
            if (now.nodes && now.edges) {
                //

                clearTimeout(tt)

                tt = setTimeout(() => {
                    //
                    now.bot.graph = JSON.parse(
                        JSON.stringify({
                            edges: now.edges,
                            nodes: now.nodes,
                        }),
                    )

                    save({ bot: now.bot })
                }, 350)
                //
            }
        })
        return () => {
            clearTimeout(tt)
            clean()
        }
    }, [ready])

    return (
        <>
            <ReactFlow
                onConnect={onConnect}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodes={nodes}
                edges={edges}
                minZoom={0.05}
                maxZoom={10}
                fitView={false}
                onNodeDrag={onNodeDrag}
                fitViewOptions={{
                    padding: 0.25,
                }}
                edgeTypes={edgeTypes}
                nodeTypes={nodeTypes}
            >
                <Background />
                <Controls />
            </ReactFlow>
            <div className=' absolute bottom-36  left-[30px]'>
                <button onClick={onAddWorkNode} className='bg-blue-500 text-white border rounded-lg  px-2 py-3'>
                    +
                </button>
            </div>
        </>
    )
}
