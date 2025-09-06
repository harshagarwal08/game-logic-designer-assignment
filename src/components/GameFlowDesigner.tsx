'use client'

import React, { useState } from 'react'
import { FlowCanvasWithProvider } from './FlowCanvas'

export default function GameFlowDesigner() {
  const [selectedNode, setSelectedNode] = useState<any>(null)

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  const onNodeAdd = (nodeType: string) => {
    console.log(`Added ${nodeType} node`)
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

        {/* Block Details Panel */}
        <div className="p-4 flex-1">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Block Details</h2>
          {selectedNode ? (
            <div className="space-y-2">
              <div className="text-sm text-gray-600">
                <strong>Type:</strong> {selectedNode.type}
              </div>
              <div className="text-sm text-gray-600">
                <strong>Label:</strong> {selectedNode.data?.label}
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-sm">
              Click a block to see its details
            </div>
          )}
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 bg-white">
        <FlowCanvasWithProvider onNodeAdd={onNodeAdd} />
      </div>
    </div>
  )
}
