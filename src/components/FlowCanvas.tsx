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
  ConnectionMode,
  NodeMouseHandler,
  useKeyPress,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { nodeTypes } from './nodes'
import { v4 as uuidv4 } from 'uuid'

const initialNodes: Node[] = []
const initialEdges: Edge[] = []

interface FlowCanvasProps {
  onNodeAdd?: (nodeType: string) => void
  onNodeSelect?: (node: Node | null) => void
  onNodeUpdate?: (nodeId: string, properties: Record<string, any>) => void
}

export default function FlowCanvas({ onNodeAdd, onNodeSelect, onNodeUpdate }: FlowCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)
  const [selectedNodes, setSelectedNodes] = useState<Node[]>([])
  const [selectedEdges, setSelectedEdges] = useState<Edge[]>([])

  const deleteKeyPressed = useKeyPress('Delete')
  const backspaceKeyPressed = useKeyPress('Backspace')

  // Handle delete key press
  React.useEffect(() => {
    if (deleteKeyPressed || backspaceKeyPressed) {
      if (selectedNodes.length > 0) {
        setNodes((nds) => nds.filter((node) => !selectedNodes.find((selected) => selected.id === node.id)))
        setSelectedNodes([])
        onNodeSelect?.(null)
      }
      if (selectedEdges.length > 0) {
        setEdges((eds) => eds.filter((edge) => !selectedEdges.find((selected) => selected.id === edge.id)))
        setSelectedEdges([])
      }
    }
  }, [deleteKeyPressed, backspaceKeyPressed, selectedNodes, selectedEdges, setNodes, setEdges, onNodeSelect])

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        id: uuidv4(),
        type: 'smoothstep',
        animated: false,
        style: { stroke: '#374151', strokeWidth: 2 },
      }
      setEdges((eds) => addEdge(newEdge, eds))
    },
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
        data: { 
          label: `${type.charAt(0).toUpperCase() + type.slice(1)} Block`,
          properties: getDefaultProperties(type)
        },
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

  const onNodeClick: NodeMouseHandler = useCallback((event, node) => {
    onNodeSelect?.(node)
  }, [onNodeSelect])

  const onPaneClick = useCallback(() => {
    onNodeSelect?.(null)
  }, [onNodeSelect])

  const onSelectionChange = useCallback(({ nodes: selectedNodes, edges: selectedEdges }: { nodes: Node[], edges: Edge[] }) => {
    setSelectedNodes(selectedNodes)
    setSelectedEdges(selectedEdges)
    
    // If a single node is selected, show its details
    if (selectedNodes.length === 1) {
      onNodeSelect?.(selectedNodes[0])
    } else if (selectedNodes.length === 0) {
      onNodeSelect?.(null)
    }
  }, [onNodeSelect])

  const handleNodeUpdate = useCallback((nodeId: string, properties: Record<string, any>) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, properties } }
          : node
      )
    )
    onNodeUpdate?.(nodeId, properties)
  }, [setNodes, onNodeUpdate])

  const getDefaultProperties = (type: string) => {
    switch (type) {
      case 'start':
        return { title: 'Game Start', description: 'Welcome to the adventure!', startingHealth: 100 }
      case 'choice':
        return { question: 'What will you do?', optionA: 'Option A', optionB: 'Option B' }
      case 'enemy':
        return { name: 'Enemy', health: 50, attack: 10, reward: 25 }
      case 'treasure':
        return { name: 'Treasure', value: 10, type: 'gold', rarity: 'common' }
      case 'end':
        return { title: 'Game Over', endingType: 'neutral', message: 'Thanks for playing!' }
      default:
        return {}
    }
  }

  const edgeOptions = useMemo(
    () => ({
      animated: false,
      style: { stroke: '#374151', strokeWidth: 2 },
    }),
    []
  )

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
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onSelectionChange={onSelectionChange}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        defaultEdgeOptions={edgeOptions}
        deleteKeyCode={['Delete', 'Backspace']}
        multiSelectionKeyCode={['Meta', 'Control']}
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

export function FlowCanvasWithProvider({ onNodeAdd, onNodeSelect, onNodeUpdate }: FlowCanvasProps) {
  return (
    <ReactFlowProvider>
      <FlowCanvas onNodeAdd={onNodeAdd} onNodeSelect={onNodeSelect} onNodeUpdate={onNodeUpdate} />
    </ReactFlowProvider>
  )
}
