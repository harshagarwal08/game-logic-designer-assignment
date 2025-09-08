'use client'

import React, { useCallback, useMemo, useState, useEffect } from 'react'
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
import { HistoryManager } from '@/utils/history'
import { saveToLocalStorage } from '@/utils/persistence'

const initialNodes: Node[] = []
const initialEdges: Edge[] = []

interface FlowCanvasProps {
  onNodeAdd?: (nodeType: string) => void
  onNodeSelect?: (node: Node | null) => void
  onNodeUpdate?: (nodeId: string, properties: Record<string, any>) => void
  onFlowChange?: (nodes: Node[], edges: Edge[]) => void
  historyManager: HistoryManager
  onHistoryChange?: (canUndo: boolean, canRedo: boolean) => void
}

export default function FlowCanvas({ 
  onNodeAdd, 
  onNodeSelect, 
  onNodeUpdate, 
  onFlowChange, 
  historyManager,
  onHistoryChange 
}: FlowCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)
  const [selectedNodes, setSelectedNodes] = useState<Node[]>([])
  const [selectedEdges, setSelectedEdges] = useState<Edge[]>([])

  const deleteKeyPressed = useKeyPress('Delete')
  const backspaceKeyPressed = useKeyPress('Backspace')
  const ctrlZPressed = useKeyPress('z', { metaKey: true })
  const ctrlYPressed = useKeyPress('y', { metaKey: true })

  // Autosave to localStorage every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (nodes.length > 0 || edges.length > 0) {
        saveToLocalStorage(nodes, edges)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [nodes, edges])

  // Save to history when nodes or edges change
  useEffect(() => {
    if (nodes.length > 0 || edges.length > 0) {
      historyManager.saveState(nodes, edges)
      onHistoryChange?.(historyManager.canUndo(), historyManager.canRedo())
    }
  }, [nodes, edges, historyManager, onHistoryChange])

  // Handle undo/redo keyboard shortcuts
  useEffect(() => {
    if (ctrlZPressed) {
      const state = historyManager.undo()
      if (state) {
        setNodes(state.nodes)
        setEdges(state.edges)
        onHistoryChange?.(historyManager.canUndo(), historyManager.canRedo())
      }
    }
  }, [ctrlZPressed, historyManager, onHistoryChange])

  useEffect(() => {
    if (ctrlYPressed) {
      const state = historyManager.redo()
      if (state) {
        setNodes(state.nodes)
        setEdges(state.edges)
        onHistoryChange?.(historyManager.canUndo(), historyManager.canRedo())
      }
    }
  }, [ctrlYPressed, historyManager, onHistoryChange])

  // Notify parent of flow changes
  useEffect(() => {
    onFlowChange?.(nodes, edges)
  }, [nodes, edges, onFlowChange])

  // Handle delete key press
  useEffect(() => {
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

  // Expose methods for external undo/redo
  const undo = useCallback(() => {
    const state = historyManager.undo()
    if (state) {
      setNodes(state.nodes)
      setEdges(state.edges)
      onHistoryChange?.(historyManager.canUndo(), historyManager.canRedo())
    }
  }, [historyManager, onHistoryChange])

  const redo = useCallback(() => {
    const state = historyManager.redo()
    if (state) {
      setNodes(state.nodes)
      setEdges(state.edges)
      onHistoryChange?.(historyManager.canUndo(), historyManager.canRedo())
    }
  }, [historyManager, onHistoryChange])

  const loadFlow = useCallback((newNodes: Node[], newEdges: Edge[]) => {
    setNodes(newNodes)
    setEdges(newEdges)
    historyManager.clear()
    historyManager.saveState(newNodes, newEdges)
    onHistoryChange?.(historyManager.canUndo(), historyManager.canRedo())
  }, [setNodes, setEdges, historyManager, onHistoryChange])

  const getDefaultProperties = (type: string) => {
    switch (type) {
      case 'start':
        return { 
          title: 'Game Start', 
          description: 'Welcome to the adventure!', 
          startingHealth: 100,
          startingGold: 0,
          difficulty: 'Medium'
        }
      case 'choice':
        return { 
          question: 'What will you do?', 
          optionA: 'Option A', 
          optionB: 'Option B',
          consequenceA: 'Consequence A',
          consequenceB: 'Consequence B'
        }
      case 'enemy':
        return { 
          name: 'Enemy', 
          health: 50, 
          attack: 10, 
          defense: 5,
          reward: 25,
          experience: 15
        }
      case 'treasure':
        return { 
          name: 'Treasure', 
          value: 10, 
          type: 'gold', 
          rarity: 'common',
          description: 'A valuable item'
        }
      case 'end':
        return { 
          title: 'Game Over', 
          endingType: 'neutral', 
          message: 'Thanks for playing!',
          finalScore: 0
        }
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

export function FlowCanvasWithProvider({ 
  onNodeAdd, 
  onNodeSelect, 
  onNodeUpdate, 
  onFlowChange, 
  historyManager,
  onHistoryChange 
}: FlowCanvasProps) {
  return (
    <ReactFlowProvider>
      <FlowCanvas 
        onNodeAdd={onNodeAdd} 
        onNodeSelect={onNodeSelect} 
        onNodeUpdate={onNodeUpdate} 
        onFlowChange={onFlowChange}
        historyManager={historyManager}
        onHistoryChange={onHistoryChange}
      />
    </ReactFlowProvider>
  )
}
