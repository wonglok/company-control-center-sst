import { Button } from "@/components/ui/button"
import { useFlow } from "./useFlow"


export function useRemoveUI({ id }) {
    let nodes = useFlow(r => r.nodes)
    let edges = useFlow(r => r.edges)

    let remove = <Button variant={'outline'} onClick={() => {

        let removeEdgeList = edges.filter(r => r.source === id || r.target === id)

        let newEdges = edges.filter(ed => {
            return !removeEdgeList.some(r => r.id === ed.id)
        })

        useFlow.setState({
            nodes: nodes.filter(r => r.id !== id),
            edges: newEdges
        })

    }}>Remove</Button>

    return { remove }
}