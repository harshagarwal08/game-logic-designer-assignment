'use client'

import React, { useState } from 'react'
import { FlowCanvasWithProvider } from './FlowCanvas'
import BlockDetailsPanel from './BlockDetailsPanel'
import ValidationPanel from './ValidationPanel'
import { Node, Edge } from 'reactflow'

export default function GameFlowDesigner() {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])

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
          <button className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border-b-2 border-blue-500">
            Details
          </button>
          <button className="flex-1 px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
            Validation
          </button>
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <BlockDetailsPanel 
              selectedNode={selectedNode} 
              onUpdateNode={onNodeUpdate}
            />
          </div>
          <div className="p-4 border-t border-gray-300">
            <ValidationPanel nodes={nodes} edges={edges} />
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
        />
      </div>
    </div>
  )
}
