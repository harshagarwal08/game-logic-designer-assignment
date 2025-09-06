'use client'

import React, { useCallback, useMemo } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
} from 'reactflow'
import 'reactflow/dist/style.css'

const initialNodes: Node[] = []
const initialEdges: Edge[] = []

export default function FlowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const nodeTypes = useMemo(() => ({}), [])

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Background variant="dots" gap={20} size={1} />
        <Controls />
        <MiniMap
          nodeStrokeColor={(n) => {
            if (n.type === 'input') return '#0041d0'
            if (n.type === 'output') return '#ff0072'
            return '#1a192b'
          }}
          nodeColor={(n) => {
            if (n.type === 'input') return '#0041d0'
            return '#1a192b'
          }}
          nodeBorderRadius={2}
        />
      </ReactFlow>
    </div>
  )
}

export function FlowCanvasWithProvider() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  )
}
