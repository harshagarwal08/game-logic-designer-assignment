'use client'

import React, { useState, useEffect } from 'react'
import { Node } from 'reactflow'

interface BlockDetailsPanelProps {
  selectedNode: Node | null
  onUpdateNode: (nodeId: string, properties: Record<string, any>) => void
}

export default function BlockDetailsPanel({ selectedNode, onUpdateNode }: BlockDetailsPanelProps) {
  const [properties, setProperties] = useState<Record<string, any>>({})
  const [label, setLabel] = useState<string>('')

  // Sync properties with selectedNode when it changes
  useEffect(() => {
    if (selectedNode?.data?.properties) {
      setProperties(selectedNode.data.properties)
    } else {
      setProperties({})
    }
    
    if (selectedNode?.data?.label) {
      setLabel(selectedNode.data.label)
    } else {
      setLabel('')
    }
  }, [selectedNode])

  const handlePropertyChange = (key: string, value: any) => {
    const newProperties = { ...properties, [key]: value }
    setProperties(newProperties)
    
    if (selectedNode) {
      onUpdateNode(selectedNode.id, newProperties)
    }
  }

  const handleLabelChange = (newLabel: string) => {
    setLabel(newLabel)
    
    if (selectedNode) {
      onUpdateNode(selectedNode.id, { 
        ...properties, 
        label: newLabel 
      })
    }
  }

  const renderStartBlockDetails = () => (
    <div className="space-y-4">
      <div>
        <label className="input-label">Title</label>
        <div className="input-field bg-gray-50 border-gray-200">
          {properties.title || 'Adventure Begins'}
        </div>
      </div>
      <div>
        <label className="input-label">Description</label>
        <div className="input-field bg-gray-50 border-gray-200 min-h-[80px]">
          {properties.description || 'Welcome to your adventure...'}
        </div>
      </div>
      <div>
        <label className="input-label">Starting Health</label>
        <div className="input-field bg-gray-50 border-gray-200">
          {properties.startingHealth || 100}
        </div>
      </div>
      <div>
        <label className="input-label">Starting Gold</label>
        <div className="input-field bg-gray-50 border-gray-200">
          {properties.startingGold || 0}
        </div>
      </div>
      <div>
        <label className="input-label">Difficulty</label>
        <div className="input-field bg-gray-50 border-gray-200">
          {properties.difficulty || 'medium'}
        </div>
      </div>
    </div>
  )

  const renderChoiceBlockDetails = () => (
    <div className="space-y-4">
      <div>
        <label className="input-label">Question</label>
        <div className="input-field bg-gray-50 border-gray-200 min-h-[80px]">
          {properties.question || 'What do you choose?'}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="input-label">Option A</label>
          <div className="input-field bg-gray-50 border-gray-200">
            {properties.optionA || 'First choice'}
          </div>
        </div>
        <div>
          <label className="input-label">Option B</label>
          <div className="input-field bg-gray-50 border-gray-200">
            {properties.optionB || 'Second choice'}
          </div>
        </div>
      </div>
      <div>
        <label className="input-label">Consequence A</label>
        <div className="input-field bg-gray-50 border-gray-200 min-h-[60px]">
          {properties.consequenceA || 'What happens with option A?'}
        </div>
      </div>
      <div>
        <label className="input-label">Consequence B</label>
        <div className="input-field bg-gray-50 border-gray-200 min-h-[60px]">
          {properties.consequenceB || 'What happens with option B?'}
        </div>
      </div>
    </div>
  )

  const renderEnemyBlockDetails = () => (
    <div className="space-y-4">
      <div>
        <label className="input-label">Name</label>
        <div className="input-field bg-gray-50 border-gray-200">
          {properties.name || 'Goblin Warrior'}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="input-label">Health</label>
          <div className="input-field bg-gray-50 border-gray-200">
            {properties.health || 50}
          </div>
        </div>
        <div>
          <label className="input-label">Attack</label>
          <div className="input-field bg-gray-50 border-gray-200">
            {properties.attack || 10}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="input-label">Defense</label>
          <div className="input-field bg-gray-50 border-gray-200">
            {properties.defense || 5}
          </div>
        </div>
        <div>
          <label className="input-label">Gold Reward</label>
          <div className="input-field bg-gray-50 border-gray-200">
            {properties.goldReward || 25}
          </div>
        </div>
      </div>
      <div>
        <label className="input-label">Experience Points</label>
        <div className="input-field bg-gray-50 border-gray-200">
          {properties.experiencePoints || 15}
        </div>
      </div>
    </div>
  )

  const renderTreasureBlockDetails = () => (
    <div className="space-y-4">
      <div>
        <label className="input-label">Name</label>
        <div className="input-field bg-gray-50 border-gray-200">
          {properties.name || 'Ancient Sword'}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="input-label">Value</label>
          <div className="input-field bg-gray-50 border-gray-200">
            {properties.value || 100}
          </div>
        </div>
        <div>
          <label className="input-label">Type</label>
          <div className="input-field bg-gray-50 border-gray-200">
            {properties.type || 'gold'}
          </div>
        </div>
      </div>
      <div>
        <label className="input-label">Rarity</label>
        <div className="input-field bg-gray-50 border-gray-200">
          {properties.rarity || 'common'}
        </div>
      </div>
      <div>
        <label className="input-label">Description</label>
        <div className="input-field bg-gray-50 border-gray-200 min-h-[80px]">
          {properties.description || 'A magnificent treasure awaits...'}
        </div>
      </div>
    </div>
  )

  const renderEndBlockDetails = () => (
    <div className="space-y-4">
      <div>
        <label className="input-label">Title</label>
        <div className="input-field bg-gray-50 border-gray-200">
          {properties.title || 'The End'}
        </div>
      </div>
      <div>
        <label className="input-label">Ending Type</label>
        <div className="input-field bg-gray-50 border-gray-200">
          {properties.endingType || 'success'}
        </div>
      </div>
      <div>
        <label className="input-label">Message</label>
        <div className="input-field bg-gray-50 border-gray-200 min-h-[80px]">
          {properties.message || 'Congratulations! You have completed your adventure...'}
        </div>
      </div>
      <div>
        <label className="input-label">Final Score</label>
        <div className="input-field bg-gray-50 border-gray-200">
          {properties.finalScore || 0}
        </div>
      </div>
      <div>
        <label className="input-label">Unlock Condition (Optional)</label>
        <div className="input-field bg-gray-50 border-gray-200">
          {properties.unlockCondition || 'Complete all side quests'}
        </div>
      </div>
    </div>
  )

  const renderBlockDetails = () => {
    if (!selectedNode) return null

    switch (selectedNode.type) {
      case 'start':
        return renderStartBlockDetails()
      case 'choice':
        return renderChoiceBlockDetails()
      case 'enemy':
        return renderEnemyBlockDetails()
      case 'treasure':
        return renderTreasureBlockDetails()
      case 'end':
        return renderEndBlockDetails()
      default:
        return null
    }
  }

  if (!selectedNode) {
    return (
      <div className="space-y-6">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <span className="mr-2">📝</span>
            Block Details
          </h3>
          <p className="text-sm text-gray-600">Select a block to view its properties</p>
        </div>
        
        <div className="card">
          <div className="text-center py-8">
            <div className="text-4xl mb-3">🎯</div>
            <div className="text-gray-500 text-sm">
              Click on any block in the canvas to view its details
            </div>
          </div>
        </div>

        <div className="card bg-blue-50 border-blue-200">
          <h4 className="text-sm font-semibold text-blue-700 mb-2 flex items-center">
            <span className="mr-2">💡</span>
            Tips
          </h4>
          <div className="text-xs text-blue-600 space-y-1">
            <div>• Drag blocks from the palette to create them</div>
            <div>• Click blocks to select and view properties</div>
            <div>• Connect blocks with arrows for flow</div>
            <div>• Use Delete key to remove selected items</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="card-header">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <span className="mr-2">📝</span>
          Block Details
        </h3>
        <p className="text-sm text-gray-600">
          Viewing: <span className="font-medium capitalize">{selectedNode.type}</span> block
        </p>
      </div>

      <div className="card">
        <div className="space-y-4">
          <div>
            <label className="input-label">Block Label</label>
            <div className="input-field bg-gray-50 border-gray-200">
              {label || 'Enter block label'}
            </div>
          </div>
          
          {renderBlockDetails()}
        </div>
      </div>

      <div className="card bg-blue-50 border-blue-200">
        <h4 className="text-sm font-semibold text-blue-700 mb-2 flex items-center">
          <span className="mr-2">ℹ️</span>
          Read-Only View
        </h4>
        <div className="text-xs text-blue-600">
          This is a read-only view of the block properties. Properties are set when blocks are created.
        </div>
      </div>
    </div>
  )
}
