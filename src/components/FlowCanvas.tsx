'use client'

import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react'
import ReactFlow, {
  BackgroundVariant,
  Background,
  Controls,
  MiniMap,
  addEdge,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
  ReactFlowInstance,
  ConnectionMode,
  NodeMouseHandler,
  useKeyPress,
  useNodesState,
  useEdgesState,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { nodeTypes } from './nodes'
import { v4 as uuidv4 } from 'uuid'
import { HistoryManager } from '@/utils/history'
import { saveToLocalStorage } from '@/utils/persistence'

interface FlowCanvasProps {
  nodes?: Node[]
  edges?: Edge[]
  onNodeAdd?: (nodeType: string) => void
  onNodeSelect?: (node: Node | null) => void
  onNodeUpdate?: (nodeId: string, properties: Record<string, any>) => void
  onFlowChange?: (nodes: Node[], edges: Edge[]) => void
  historyManager: HistoryManager
  onHistoryChange?: (canUndo: boolean, canRedo: boolean) => void
}

export default function FlowCanvas({ 
  nodes: externalNodes = [],
  edges: externalEdges = [],
  onNodeAdd, 
  onNodeSelect, 
  onNodeUpdate, 
  onFlowChange, 
  historyManager,
  onHistoryChange 
}: FlowCanvasProps) {
  // Use ReactFlow's built-in state management to prevent strobing
  const [nodes, setNodes, onNodesChange] = useNodesState(externalNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(externalEdges)
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)
  const [selectedNodes, setSelectedNodes] = useState<Node[]>([])
  const [selectedEdges, setSelectedEdges] = useState<Edge[]>([])
  
  // Use refs to prevent infinite loops and track changes
  const isUpdatingFromExternal = useRef(false)
  const lastExternalNodes = useRef<Node[]>([])
  const lastExternalEdges = useRef<Edge[]>([])
  const hasInitialized = useRef(false)
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const deleteKeyPressed = useKeyPress('Delete')
  const backspaceKeyPressed = useKeyPress('Backspace')
  const ctrlZPressed = useKeyPress('z', {})
  const ctrlYPressed = useKeyPress('y', {})

  // Initialize with external data only once
  useEffect(() => {
    if (!hasInitialized.current) {
      setNodes(externalNodes)
      setEdges(externalEdges)
      lastExternalNodes.current = externalNodes
      lastExternalEdges.current = externalEdges
      hasInitialized.current = true
    }
  }, [])

  // Sync with external nodes and edges only when they actually change
  useEffect(() => {
    if (!hasInitialized.current) return
    
    const nodesChanged = JSON.stringify(externalNodes) !== JSON.stringify(lastExternalNodes.current)
    const edgesChanged = JSON.stringify(externalEdges) !== JSON.stringify(lastExternalEdges.current)
    
    if (nodesChanged || edgesChanged) {
      isUpdatingFromExternal.current = true
      setNodes(externalNodes)
      setEdges(externalEdges)
      lastExternalNodes.current = externalNodes
      lastExternalEdges.current = externalEdges
      
      // Reset the flag after state update
      setTimeout(() => {
        isUpdatingFromExternal.current = false
      }, 0)
    }
  }, [externalNodes, externalEdges])

  // Debounced autosave to localStorage
  useEffect(() => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current)
    }
    
    updateTimeoutRef.current = setTimeout(() => {
      if (nodes.length > 0 || edges.length > 0) {
        saveToLocalStorage(nodes, edges)
      }
    }, 2000) // Debounce for 2 seconds

    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }
    }
  }, [nodes, edges])

  // Debounced history save
  useEffect(() => {
    if (!isUpdatingFromExternal.current && hasInitialized.current && (nodes.length > 0 || edges.length > 0)) {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }
      
      updateTimeoutRef.current = setTimeout(() => {
        historyManager.saveState(nodes, edges)
        onHistoryChange?.(historyManager.canUndo(), historyManager.canRedo())
      }, 500) // Debounce for 500ms
    }
  }, [nodes, edges])

  // Debounced parent notification
  useEffect(() => {
    if (!isUpdatingFromExternal.current && hasInitialized.current) {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }
      
      updateTimeoutRef.current = setTimeout(() => {
        onFlowChange?.(nodes, edges)
      }, 100) // Debounce for 100ms
    }
  }, [nodes, edges])

  // Handle undo/redo keyboard shortcuts
  useEffect(() => {
    if (ctrlZPressed) {
      const state = historyManager.undo()
      if (state) {
        isUpdatingFromExternal.current = true
        setNodes(state.nodes)
        setEdges(state.edges)
        onHistoryChange?.(historyManager.canUndo(), historyManager.canRedo())
        onFlowChange?.(state.nodes, state.edges)
        setTimeout(() => {
          isUpdatingFromExternal.current = false
        }, 0)
      }
    }
  }, [ctrlZPressed])

  useEffect(() => {
    if (ctrlYPressed) {
      const state = historyManager.redo()
      if (state) {
        isUpdatingFromExternal.current = true
        setNodes(state.nodes)
        setEdges(state.edges)
        onHistoryChange?.(historyManager.canUndo(), historyManager.canRedo())
        onFlowChange?.(state.nodes, state.edges)
        setTimeout(() => {
          isUpdatingFromExternal.current = false
        }, 0)
      }
    }
  }, [ctrlYPressed])

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
  }, [deleteKeyPressed, backspaceKeyPressed, selectedNodes, selectedEdges])

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
      console.log('🎯 Drop event triggered')

      const type = event.dataTransfer.getData('application/reactflow')
      console.log('🎯 Dropped type:', type)
      
      if (typeof type === 'undefined' || !type) {
        console.log('❌ No type found in dataTransfer')
        return
      }

      if (!reactFlowInstance) {
        console.log('❌ No reactFlowInstance')
        return
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      console.log('🎯 Creating node at position:', position)

      const newNode: Node = {
        id: uuidv4(),
        type,
        position,
        data: { 
          label: `${type.charAt(0).toUpperCase() + type.slice(1)} Block`,
          properties: getDefaultProperties(type)
        },
      }

      console.log('🎯 New node created:', newNode)
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
        onInit={(instance) => {
          console.log('🎯 ReactFlow initialized:', instance)
          setReactFlowInstance(instance)
        }}
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
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
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
  nodes,
  edges,
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
        nodes={nodes}
        edges={edges}
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
