import { NodeTypes } from '@xyflow/react'

// @ts-ignore
let ri = require.context('./', true, /\.node\.jsx$/)

let nodeTypes: NodeTypes = {}
ri.keys().forEach((key: string) => {
    let thisMod = ri(key)

    nodeTypes = { ...nodeTypes, ...thisMod }

    if (nodeTypes.getData) {
        delete nodeTypes.getData
    }
})

export const nodeTypesList = Object.keys(nodeTypes)

export { nodeTypes }
