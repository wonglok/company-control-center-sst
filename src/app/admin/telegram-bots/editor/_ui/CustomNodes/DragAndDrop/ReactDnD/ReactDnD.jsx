import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { Container } from "./Container"

export const ReactDnD = () => {
    return <>

        <DndProvider backend={HTML5Backend}>
            <Container></Container>
        </DndProvider>

    </>
}