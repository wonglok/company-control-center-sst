import { faClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useConnection,
  useHandleConnections,
  // getSimpleBezierPath,
  // getStraightPath,
  useReactFlow,
} from '@xyflow/react'
import { useEffect } from 'react'
import { useFlow } from '../../../[botID]/useFlow'

export function ButtonEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,

  source,
  target,
  sourceHandleId,
  targetHandleId,
}) {
  const { setEdges } = useReactFlow()

  const [edgePath, labelX, labelY, offsetX, offsetY] = getBezierPath({
    sourcePosition,
    targetPosition,
    sourceX,
    sourceY,
    targetX,
    targetY,
  })

  return (
    <>
      <BaseEdge id={id} path={edgePath} interactionWidth={5} />
      <EdgeLabelRenderer>
        <button
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
          }}
          className='nodrag nopan opacity-25 hover:opacity-100'
          onClick={() => {
            setEdges((es) => es.filter((e) => e.id !== id))
          }}
        >
          <FontAwesomeIcon icon={faClose} color='red'></FontAwesomeIcon>
        </button>
      </EdgeLabelRenderer>
    </>
  )
}
