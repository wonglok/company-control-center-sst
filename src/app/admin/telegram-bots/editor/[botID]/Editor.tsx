import { useFlow } from './useFlow'
import {
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    Background,
    Controls,
    OnNodeDrag,
    ReactFlow,
    useViewport,
} from '@xyflow/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { edgeTypes } from '../_ui/CustomEdges'
import { nodeTypes } from '../_ui/CustomNodes'
import { v4 } from 'uuid'
import md5 from 'md5'
import '@xyflow/react/dist/style.css'
import { putTelegramBot } from '@/actions/telegram/putTelegramBot'
import { toast } from 'sonner'
import { getTelegramBot } from '@/actions/telegram/getTelegramBot'
import { useParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Plus } from 'lucide-react'

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

    let save = useCallback(({ bot }: any) => {
        return putTelegramBot({
            item: {
                ...bot,
                itemID: bot.itemID,
            },
        })
            .then(() => {
                toast.success('Updates are successfully saved')
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
                }, 500)
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
                onNodeDrag={onNodeDrag}
                //

                nodes={nodes}
                edges={edges}
                //
                minZoom={0.05}
                maxZoom={10}
                fitView={false}
                fitViewOptions={{
                    padding: 0.25,
                }}
                edgeTypes={edgeTypes}
                nodeTypes={nodeTypes}
            >
                <Background />
                <Controls />
                <Add setNodes={setNodes}></Add>
            </ReactFlow>
        </>
    )
}

function Add({ setNodes = () => {} }: any) {
    return (
        <>
            <div className=' absolute top-[12px] right-[12px] z-[100]'>
                <SheetDemo setNodes={setNodes}></SheetDemo>
            </div>
        </>
    )
}

export function SheetDemo({ setNodes }: any) {
    //

    const { x, y, zoom } = useViewport()

    const addNode = ({ type = 'WorkNode', dragHandle = undefined }: any) => {
        setNodes((nodes: any) => [
            ...nodes,
            {
                id: `${md5(v4())}`,
                type: type,
                position: {
                    x: -x + zoom * 150,
                    y: -y + zoom * 150,
                },
                data: {
                    //
                },
                dragHandle: dragHandle,
            },
        ])
    }

    let [open, setOpen] = useState(false)

    return (
        <Sheet
            open={open}
            onOpenChange={(v) => {
                console.log(v)
                if (!v) {
                    setOpen(false)
                }
            }}
        >
            <SheetTrigger asChild>
                <button
                    onClick={() => {
                        setOpen(!open)
                    }}
                    className='bg-blue-500 text-white border rounded-full p-3 '
                >
                    <Plus></Plus>
                </button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Add Nodes</SheetTitle>
                    <SheetDescription>Workflow Node</SheetDescription>
                </SheetHeader>
                <div className='grid gap-4 py-4'>
                    <div className='space-x-4 space-y-4'>
                        <Button
                            onClick={() => {
                                setOpen(false)
                                addNode({ type: 'WorkNode' })
                            }}
                        >
                            Work Node
                        </Button>
                        <Button
                            onClick={() => {
                                //
                                setOpen(false)
                                addNode({ type: 'ProcedureNode', dragHandle: '.dragHandle' })
                            }}
                        >
                            Procedure Node
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
