'use client'

import React, { useCallback, useMemo, useState } from 'react'
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
  ReactFlowInstance,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { nodeTypes } from './nodes'
import { v4 as uuidv4 } from 'uuid'

const initialNodes: Node[] = []
const initialEdges: Edge[] = []

interface FlowCanvasProps {
  onNodeAdd?: (nodeType: string) => void
}

export default function FlowCanvas({ onNodeAdd }: FlowCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const type = event.dataTransfer.getData('application/reactflow')
      if (typeof type === 'undefined' || !type) {
        return
      }

      if (!reactFlowInstance) {
        return
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      const newNode: Node = {
        id: uuidv4(),
        type,
        position,
        data: { label: `${type.charAt(0).toUpperCase() + type.slice(1)} Block` },
      }

      setNodes((nds) => nds.concat(newNode))
      onNodeAdd?.(type)
    },
    [reactFlowInstance, setNodes, onNodeAdd]
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Background variant="dots" gap={20} size={1} />
        <Controls />
        <MiniMap
          nodeStrokeColor={(n) => {
            if (n.type === 'start') return '#10b981'
            if (n.type === 'choice') return '#3b82f6'
            if (n.type === 'enemy') return '#ef4444'
            if (n.type === 'treasure') return '#eab308'
            if (n.type === 'end') return '#8b5cf6'
            return '#1a192b'
          }}
          nodeColor={(n) => {
            if (n.type === 'start') return '#10b981'
            if (n.type === 'choice') return '#3b82f6'
            if (n.type === 'enemy') return '#ef4444'
            if (n.type === 'treasure') return '#eab308'
            if (n.type === 'end') return '#8b5cf6'
            return '#1a192b'
          }}
          nodeBorderRadius={2}
        />
      </ReactFlow>
    </div>
  )
}

export function FlowCanvasWithProvider({ onNodeAdd }: FlowCanvasProps) {
  return (
    <ReactFlowProvider>
      <FlowCanvas onNodeAdd={onNodeAdd} />
    </ReactFlowProvider>
  )
}
