'use client'

import React, { useState, useEffect } from 'react'
import { FlowCanvasWithProvider } from './FlowCanvas'
import BlockDetailsPanel from './BlockDetailsPanel'
import ValidationPanel from './ValidationPanel'
import SaveLoadPanel from './SaveLoadPanel'
import UndoRedoPanel from './UndoRedoPanel'
import ComputationPanel from './ComputationPanel'
import { Node, Edge } from 'reactflow'
import { HistoryManager } from '@/utils/history'
import { loadFromLocalStorage } from '@/utils/persistence'

export default function GameFlowDesigner() {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [activeTab, setActiveTab] = useState<'details' | 'validation' | 'save' | 'undo' | 'computation'>('details')
  const [historyManager] = useState(() => new HistoryManager(20))
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)

  // Load from localStorage on component mount
  useEffect(() => {
    const savedFlow = loadFromLocalStorage()
    if (savedFlow) {
      setNodes(savedFlow.nodes)
      setEdges(savedFlow.edges)
      historyManager.clear()
      historyManager.saveState(savedFlow.nodes, savedFlow.edges)
      setCanUndo(historyManager.canUndo())
      setCanRedo(historyManager.canRedo())
    }
  }, [historyManager])

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  const onNodeAdd = (nodeType: string) => {
    console.log(`Added ${nodeType} node`)
  }

  const onNodeSelect = (node: Node | null) => {
    setSelectedNode(node)
  }

  const onNodeUpdate = (nodeId: string, properties: Record<string, any>) => {
    console.log(`Updated node ${nodeId} with properties:`, properties)
  }

  const onFlowChange = (newNodes: Node[], newEdges: Edge[]) => {
    setNodes(newNodes)
    setEdges(newEdges)
  }

  const onHistoryChange = (undoAvailable: boolean, redoAvailable: boolean) => {
    setCanUndo(undoAvailable)
    setCanRedo(redoAvailable)
  }

  const handleLoadFlow = (newNodes: Node[], newEdges: Edge[]) => {
    setNodes(newNodes)
    setEdges(newEdges)
    historyManager.clear()
    historyManager.saveState(newNodes, newEdges)
    setCanUndo(historyManager.canUndo())
    setCanRedo(historyManager.canRedo())
  }

  const handleUndo = () => {
    const state = historyManager.undo()
    if (state) {
      setNodes(state.nodes)
      setEdges(state.edges)
      setCanUndo(historyManager.canUndo())
      setCanRedo(historyManager.canRedo())
    }
  }

  const handleRedo = () => {
    const state = historyManager.redo()
    if (state) {
      setNodes(state.nodes)
      setEdges(state.edges)
      setCanUndo(historyManager.canUndo())
      setCanRedo(historyManager.canRedo())
    }
  }

  return (
    <div className="flex h-full w-full">
      {/* Side Panel */}
      <div className="w-80 bg-gray-100 border-r border-gray-300 flex flex-col">
        <div className="p-4 border-b border-gray-300">
          <h1 className="text-xl font-bold text-gray-800">Game Flow Designer</h1>
        </div>
        
        {/* Block Palette */}
        <div className="p-4 border-b border-gray-300">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Block Palette</h2>
          <div className="space-y-2">
            <div 
              className="bg-green-500 text-white p-2 rounded cursor-grab hover:bg-green-600 active:cursor-grabbing"
              draggable
              onDragStart={(event) => onDragStart(event, 'start')}
            >
              Start
            </div>
            <div 
              className="bg-blue-500 text-white p-2 rounded cursor-grab hover:bg-blue-600 active:cursor-grabbing"
              draggable
              onDragStart={(event) => onDragStart(event, 'choice')}
            >
              Choice
            </div>
            <div 
              className="bg-red-500 text-white p-2 rounded cursor-grab hover:bg-red-600 active:cursor-grabbing"
              draggable
              onDragStart={(event) => onDragStart(event, 'enemy')}
            >
              Enemy
            </div>
            <div 
              className="bg-yellow-500 text-white p-2 rounded cursor-grab hover:bg-yellow-600 active:cursor-grabbing"
              draggable
              onDragStart={(event) => onDragStart(event, 'treasure')}
            >
              Treasure
            </div>
            <div 
              className="bg-purple-500 text-white p-2 rounded cursor-grab hover:bg-purple-600 active:cursor-grabbing"
              draggable
              onDragStart={(event) => onDragStart(event, 'end')}
            >
              End
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-300">
          <button 
            onClick={() => setActiveTab('details')}
            className={`flex-1 px-1 py-2 text-xs font-medium ${
              activeTab === 'details' 
                ? 'text-gray-700 bg-white border-b-2 border-blue-500' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Details
          </button>
          <button 
            onClick={() => setActiveTab('validation')}
            className={`flex-1 px-1 py-2 text-xs font-medium ${
              activeTab === 'validation' 
                ? 'text-gray-700 bg-white border-b-2 border-blue-500' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Validation
          </button>
          <button 
            onClick={() => setActiveTab('computation')}
            className={`flex-1 px-1 py-2 text-xs font-medium ${
              activeTab === 'computation' 
                ? 'text-gray-700 bg-white border-b-2 border-blue-500' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Analysis
          </button>
          <button 
            onClick={() => setActiveTab('save')}
            className={`flex-1 px-1 py-2 text-xs font-medium ${
              activeTab === 'save' 
                ? 'text-gray-700 bg-white border-b-2 border-blue-500' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Save/Load
          </button>
          <button 
            onClick={() => setActiveTab('undo')}
            className={`flex-1 px-1 py-2 text-xs font-medium ${
              activeTab === 'undo' 
                ? 'text-gray-700 bg-white border-b-2 border-blue-500' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Undo/Redo
          </button>
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'details' && (
            <div className="p-4">
              <BlockDetailsPanel 
                selectedNode={selectedNode} 
                onUpdateNode={onNodeUpdate}
              />
            </div>
          )}
          
          {activeTab === 'validation' && (
            <div className="p-4">
              <ValidationPanel nodes={nodes} edges={edges} />
            </div>
          )}
          
          {activeTab === 'computation' && (
            <div className="p-4">
              <ComputationPanel nodes={nodes} edges={edges} />
            </div>
          )}
          
          {activeTab === 'save' && (
            <div className="p-4">
              <SaveLoadPanel 
                nodes={nodes} 
                edges={edges} 
                onLoadFlow={handleLoadFlow}
              />
            </div>
          )}
          
          {activeTab === 'undo' && (
            <div className="p-4">
              <UndoRedoPanel 
                historyManager={historyManager}
                onUndo={handleUndo}
                onRedo={handleRedo}
              />
            </div>
          )}
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 bg-white">
        <FlowCanvasWithProvider 
          onNodeAdd={onNodeAdd} 
          onNodeSelect={onNodeSelect}
          onNodeUpdate={onNodeUpdate}
          onFlowChange={onFlowChange}
          historyManager={historyManager}
          onHistoryChange={onHistoryChange}
        />
      </div>
    </div>
  )
}
