'use client'

import React, { useState } from 'react'
import { Node } from 'reactflow'
import { 
  StartBlockProperties, 
  ChoiceBlockProperties, 
  EnemyBlockProperties, 
  TreasureBlockProperties, 
  EndBlockProperties 
} from '@/types/blockTypes'

interface BlockDetailsPanelProps {
  selectedNode: Node | null
  onUpdateNode: (nodeId: string, properties: Record<string, any>) => void
}

export default function BlockDetailsPanel({ selectedNode, onUpdateNode }: BlockDetailsPanelProps) {
  const [properties, setProperties] = useState<Record<string, any>>(
    selectedNode?.data?.properties || {}
  )

  React.useEffect(() => {
    setProperties(selectedNode?.data?.properties || {})
  }, [selectedNode])

  const handlePropertyChange = (key: string, value: any) => {
    const newProperties = { ...properties, [key]: value }
    setProperties(newProperties)
    if (selectedNode) {
      onUpdateNode(selectedNode.id, newProperties)
    }
  }

  const renderStartProperties = () => (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          value={properties.title || ''}
          onChange={(e) => handlePropertyChange('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Game Start"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={properties.description || ''}
          onChange={(e) => handlePropertyChange('description', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          rows={3}
          placeholder="Welcome to the adventure!"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Starting Health</label>
        <input
          type="number"
          value={properties.startingHealth || 100}
          onChange={(e) => handlePropertyChange('startingHealth', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          min="1"
          max="1000"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Starting Gold</label>
        <input
          type="number"
          value={properties.startingGold || 0}
          onChange={(e) => handlePropertyChange('startingGold', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          min="0"
          max="10000"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
        <select
          value={properties.difficulty || 'Medium'}
          onChange={(e) => handlePropertyChange('difficulty', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>
    </div>
  )

  const renderChoiceProperties = () => (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
        <textarea
          value={properties.question || ''}
          onChange={(e) => handlePropertyChange('question', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={2}
          placeholder="What will you do?"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Option A</label>
        <input
          type="text"
          value={properties.optionA || ''}
          onChange={(e) => handlePropertyChange('optionA', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="First choice"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Consequence A</label>
        <input
          type="text"
          value={properties.consequenceA || ''}
          onChange={(e) => handlePropertyChange('consequenceA', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="What happens with option A"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Option B</label>
        <input
          type="text"
          value={properties.optionB || ''}
          onChange={(e) => handlePropertyChange('optionB', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Second choice"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Consequence B</label>
        <input
          type="text"
          value={properties.consequenceB || ''}
          onChange={(e) => handlePropertyChange('consequenceB', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="What happens with option B"
        />
      </div>
    </div>
  )

  const renderEnemyProperties = () => (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          type="text"
          value={properties.name || ''}
          onChange={(e) => handlePropertyChange('name', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder="Goblin Warrior"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Health</label>
        <input
          type="number"
          value={properties.health || 50}
          onChange={(e) => handlePropertyChange('health', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          min="1"
          max="1000"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Attack Power</label>
        <input
          type="number"
          value={properties.attack || 10}
          onChange={(e) => handlePropertyChange('attack', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          min="1"
          max="100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Defense</label>
        <input
          type="number"
          value={properties.defense || 5}
          onChange={(e) => handlePropertyChange('defense', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          min="0"
          max="100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Gold Reward</label>
        <input
          type="number"
          value={properties.reward || 25}
          onChange={(e) => handlePropertyChange('reward', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          min="0"
          max="1000"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Experience Points</label>
        <input
          type="number"
          value={properties.experience || 15}
          onChange={(e) => handlePropertyChange('experience', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          min="0"
          max="1000"
        />
      </div>
    </div>
  )

  const renderTreasureProperties = () => (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          type="text"
          value={properties.name || ''}
          onChange={(e) => handlePropertyChange('name', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          placeholder="Gold Coin"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
        <input
          type="number"
          value={properties.value || 10}
          onChange={(e) => handlePropertyChange('value', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          min="1"
          max="10000"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
        <select
          value={properties.type || 'gold'}
          onChange={(e) => handlePropertyChange('type', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
        >
          <option value="gold">Gold</option>
          <option value="item">Item</option>
          <option value="experience">Experience</option>
          <option value="weapon">Weapon</option>
          <option value="armor">Armor</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Rarity</label>
        <select
          value={properties.rarity || 'common'}
          onChange={(e) => handlePropertyChange('rarity', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
        >
          <option value="common">Common</option>
          <option value="rare">Rare</option>
          <option value="epic">Epic</option>
          <option value="legendary">Legendary</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={properties.description || ''}
          onChange={(e) => handlePropertyChange('description', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          rows={2}
          placeholder="A shiny gold coin..."
        />
      </div>
    </div>
  )

  const renderEndProperties = () => (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          value={properties.title || ''}
          onChange={(e) => handlePropertyChange('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Game Over"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ending Type</label>
        <select
          value={properties.endingType || 'neutral'}
          onChange={(e) => handlePropertyChange('endingType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="victory">Victory</option>
          <option value="defeat">Defeat</option>
          <option value="neutral">Neutral</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
        <textarea
          value={properties.message || ''}
          onChange={(e) => handlePropertyChange('message', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          rows={3}
          placeholder="Thanks for playing!"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Final Score</label>
        <input
          type="number"
          value={properties.finalScore || 0}
          onChange={(e) => handlePropertyChange('finalScore', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          min="0"
          max="10000"
        />
      </div>
    </div>
  )

  const renderProperties = () => {
    if (!selectedNode) return null

    switch (selectedNode.type) {
      case 'start':
        return renderStartProperties()
      case 'choice':
        return renderChoiceProperties()
      case 'enemy':
        return renderEnemyProperties()
      case 'treasure':
        return renderTreasureProperties()
      case 'end':
        return renderEndProperties()
      default:
        return null
    }
  }

  if (!selectedNode) {
    return (
      <div className="text-gray-500 text-sm">
        Click a block to see its details
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="border-b border-gray-300 pb-3">
        <h3 className="text-lg font-semibold text-gray-800 capitalize">
          {selectedNode.type} Block
        </h3>
        <p className="text-sm text-gray-600">
          ID: {selectedNode.id}
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
        <input
          type="text"
          value={selectedNode.data?.label || ''}
          onChange={(e) => {
            // This would need to be handled by the parent component
            console.log('Label change:', e.target.value)
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
      </div>

      <div>
        <h4 className="text-md font-medium text-gray-700 mb-3">Properties</h4>
        {renderProperties()}
      </div>
    </div>
  )
}
