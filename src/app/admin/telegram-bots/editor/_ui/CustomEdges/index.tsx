import { EdgeTypes } from '@xyflow/react'

// @ts-ignore
let ri = require.context('./', true, /\.edge\.jsx$/)

let edgeTypes: EdgeTypes = {}
ri.keys().forEach((key: string) => {
    let thisMod = ri(key)

    edgeTypes = { ...edgeTypes, ...thisMod }
})

export { edgeTypes }
