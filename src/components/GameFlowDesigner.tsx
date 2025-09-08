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

  const tabs = [
    { id: 'details', label: 'Details', icon: '📝' },
    { id: 'validation', label: 'Validation', icon: '✅' },
    { id: 'computation', label: 'Analysis', icon: '📊' },
    { id: 'save', label: 'Save/Load', icon: '💾' },
    { id: 'undo', label: 'History', icon: '↩️' }
  ] as const

  return (
    <div className="flex h-full w-full bg-gray-50">
      {/* Side Panel */}
      <div className="w-96 bg-white shadow-lg border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="panel-header">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GF</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Game Flow Designer</h1>
              <p className="text-sm text-gray-500">Design interactive game flows</p>
            </div>
          </div>
        </div>
        
        {/* Block Palette */}
        <div className="panel-content border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <span className="mr-2">🎮</span>
            Block Palette
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div 
              className="block-palette-item bg-gradient-to-br from-green-500 to-green-600"
              draggable
              onDragStart={(event) => onDragStart(event, 'start')}
            >
              <div className="text-sm font-medium">🚀 Start</div>
              <div className="text-xs opacity-90">Begin adventure</div>
            </div>
            <div 
              className="block-palette-item bg-gradient-to-br from-blue-500 to-blue-600"
              draggable
              onDragStart={(event) => onDragStart(event, 'choice')}
            >
              <div className="text-sm font-medium">🤔 Choice</div>
              <div className="text-xs opacity-90">Player decision</div>
            </div>
            <div 
              className="block-palette-item bg-gradient-to-br from-red-500 to-red-600"
              draggable
              onDragStart={(event) => onDragStart(event, 'enemy')}
            >
              <div className="text-sm font-medium">⚔️ Enemy</div>
              <div className="text-xs opacity-90">Combat encounter</div>
            </div>
            <div 
              className="block-palette-item bg-gradient-to-br from-yellow-500 to-yellow-600"
              draggable
              onDragStart={(event) => onDragStart(event, 'treasure')}
            >
              <div className="text-sm font-medium">💰 Treasure</div>
              <div className="text-xs opacity-90">Reward chest</div>
            </div>
            <div 
              className="block-palette-item bg-gradient-to-br from-purple-500 to-purple-600 col-span-2"
              draggable
              onDragStart={(event) => onDragStart(event, 'end')}
            >
              <div className="text-sm font-medium">🏁 End</div>
              <div className="text-xs opacity-90">Adventure conclusion</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          {tabs.map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-button ${activeTab === tab.id ? 'active' : 'inactive'}`}
            >
              <span className="mr-1">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="fade-in">
            {activeTab === 'details' && (
              <div className="panel-content">
                <BlockDetailsPanel 
                  selectedNode={selectedNode} 
                  onUpdateNode={onNodeUpdate}
                />
              </div>
            )}
            
            {activeTab === 'validation' && (
              <div className="panel-content">
                <ValidationPanel nodes={nodes} edges={edges} />
              </div>
            )}
            
            {activeTab === 'computation' && (
              <div className="panel-content">
                <ComputationPanel nodes={nodes} edges={edges} />
              </div>
            )}
            
            {activeTab === 'save' && (
              <div className="panel-content">
                <SaveLoadPanel 
                  nodes={nodes} 
                  edges={edges} 
                  onLoadFlow={handleLoadFlow}
                />
              </div>
            )}
            
            {activeTab === 'undo' && (
              <div className="panel-content">
                <UndoRedoPanel 
                  historyManager={historyManager}
                  onUndo={handleUndo}
                  onRedo={handleRedo}
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="panel-header bg-gray-50">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Nodes: {nodes.length}</span>
            <span>Connections: {edges.length}</span>
            <span>v1.0.0</span>
          </div>
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
