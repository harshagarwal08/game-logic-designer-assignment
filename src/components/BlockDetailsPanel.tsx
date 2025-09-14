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
  const [properties, setProperties] = useState<Record<string, any>>(() => selectedNode?.data?.properties || {})

  const handlePropertyChange = (key: string, value: any) => {
    const newProperties = { ...properties, [key]: value }
    setProperties(newProperties)
    
    if (selectedNode) {
      onUpdateNode(selectedNode.id, newProperties)
    }
  }

  const renderStartBlockDetails = () => (
    <div className="space-y-4">
      <div>
        <label className="input-label">Title</label>
        <input
          type="text"
          className="input-field"
          value={properties.title || ''}
          onChange={(e) => handlePropertyChange('title', e.target.value)}
          placeholder="Adventure Begins"
        />
      </div>
      <div>
        <label className="input-label">Description</label>
        <textarea
          className="input-field min-h-[80px] resize-none"
          value={properties.description || ''}
          onChange={(e) => handlePropertyChange('description', e.target.value)}
          placeholder="Welcome to your adventure..."
        />
      </div>
      <div>
        <label className="input-label">Starting Health</label>
        <input
          type="number"
          className="input-field"
          value={properties.startingHealth || 100}
          onChange={(e) => handlePropertyChange('startingHealth', parseInt(e.target.value))}
          min="1"
          max="1000"
        />
      </div>
      <div>
        <label className="input-label">Starting Gold</label>
        <input
          type="number"
          className="input-field"
          value={properties.startingGold || 0}
          onChange={(e) => handlePropertyChange('startingGold', parseInt(e.target.value))}
          min="0"
          max="10000"
        />
      </div>
      <div>
        <label className="input-label">Difficulty</label>
        <select
          className="input-field"
          value={properties.difficulty || 'medium'}
          onChange={(e) => handlePropertyChange('difficulty', e.target.value)}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
    </div>
  )

  const renderChoiceBlockDetails = () => (
    <div className="space-y-4">
      <div>
        <label className="input-label">Question</label>
        <textarea
          className="input-field min-h-[80px] resize-none"
          value={properties.question || ''}
          onChange={(e) => handlePropertyChange('question', e.target.value)}
          placeholder="What do you choose?"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="input-label">Option A</label>
          <input
            type="text"
            className="input-field"
            value={properties.optionA || ''}
            onChange={(e) => handlePropertyChange('optionA', e.target.value)}
            placeholder="First choice"
          />
        </div>
        <div>
          <label className="input-label">Option B</label>
          <input
            type="text"
            className="input-field"
            value={properties.optionB || ''}
            onChange={(e) => handlePropertyChange('optionB', e.target.value)}
            placeholder="Second choice"
          />
        </div>
      </div>
      <div>
        <label className="input-label">Consequence A</label>
        <textarea
          className="input-field min-h-[60px] resize-none"
          value={properties.consequenceA || ''}
          onChange={(e) => handlePropertyChange('consequenceA', e.target.value)}
          placeholder="What happens with option A?"
        />
      </div>
      <div>
        <label className="input-label">Consequence B</label>
        <textarea
          className="input-field min-h-[60px] resize-none"
          value={properties.consequenceB || ''}
          onChange={(e) => handlePropertyChange('consequenceB', e.target.value)}
          placeholder="What happens with option B?"
        />
      </div>
    </div>
  )

  const renderEnemyBlockDetails = () => (
    <div className="space-y-4">
      <div>
        <label className="input-label">Name</label>
        <input
          type="text"
          className="input-field"
          value={properties.name || ''}
          onChange={(e) => handlePropertyChange('name', e.target.value)}
          placeholder="Goblin Warrior"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="input-label">Health</label>
          <input
            type="number"
            className="input-field"
            value={properties.health || 50}
            onChange={(e) => handlePropertyChange('health', parseInt(e.target.value))}
            min="1"
            max="1000"
          />
        </div>
        <div>
          <label className="input-label">Attack</label>
          <input
            type="number"
            className="input-field"
            value={properties.attack || 10}
            onChange={(e) => handlePropertyChange('attack', parseInt(e.target.value))}
            min="1"
            max="100"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="input-label">Defense</label>
          <input
            type="number"
            className="input-field"
            value={properties.defense || 5}
            onChange={(e) => handlePropertyChange('defense', parseInt(e.target.value))}
            min="0"
            max="100"
          />
        </div>
        <div>
          <label className="input-label">Gold Reward</label>
          <input
            type="number"
            className="input-field"
            value={properties.goldReward || 25}
            onChange={(e) => handlePropertyChange('goldReward', parseInt(e.target.value))}
            min="0"
            max="1000"
          />
        </div>
      </div>
      <div>
        <label className="input-label">Experience Points</label>
        <input
          type="number"
          className="input-field"
          value={properties.experiencePoints || 15}
          onChange={(e) => handlePropertyChange('experiencePoints', parseInt(e.target.value))}
          min="0"
          max="500"
        />
      </div>
    </div>
  )

  const renderTreasureBlockDetails = () => (
    <div className="space-y-4">
      <div>
        <label className="input-label">Name</label>
        <input
          type="text"
          className="input-field"
          value={properties.name || ''}
          onChange={(e) => handlePropertyChange('name', e.target.value)}
          placeholder="Ancient Sword"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="input-label">Value</label>
          <input
            type="number"
            className="input-field"
            value={properties.value || 100}
            onChange={(e) => handlePropertyChange('value', parseInt(e.target.value))}
            min="1"
            max="10000"
          />
        </div>
        <div>
          <label className="input-label">Type</label>
          <select
            className="input-field"
            value={properties.type || 'gold'}
            onChange={(e) => handlePropertyChange('type', e.target.value)}
          >
            <option value="gold">Gold</option>
            <option value="item">Item</option>
            <option value="experience">Experience</option>
            <option value="weapon">Weapon</option>
            <option value="armor">Armor</option>
          </select>
        </div>
      </div>
      <div>
        <label className="input-label">Rarity</label>
        <select
          className="input-field"
          value={properties.rarity || 'common'}
          onChange={(e) => handlePropertyChange('rarity', e.target.value)}
        >
          <option value="common">Common</option>
          <option value="uncommon">Uncommon</option>
          <option value="rare">Rare</option>
          <option value="epic">Epic</option>
          <option value="legendary">Legendary</option>
        </select>
      </div>
      <div>
        <label className="input-label">Description</label>
        <textarea
          className="input-field min-h-[80px] resize-none"
          value={properties.description || ''}
          onChange={(e) => handlePropertyChange('description', e.target.value)}
          placeholder="A magnificent treasure awaits..."
        />
      </div>
    </div>
  )

  const renderEndBlockDetails = () => (
    <div className="space-y-4">
      <div>
        <label className="input-label">Title</label>
        <input
          type="text"
          className="input-field"
          value={properties.title || ''}
          onChange={(e) => handlePropertyChange('title', e.target.value)}
          placeholder="The End"
        />
      </div>
      <div>
        <label className="input-label">Ending Type</label>
        <select
          className="input-field"
          value={properties.endingType || 'success'}
          onChange={(e) => handlePropertyChange('endingType', e.target.value)}
        >
          <option value="success">Success</option>
          <option value="failure">Failure</option>
          <option value="neutral">Neutral</option>
        </select>
      </div>
      <div>
        <label className="input-label">Message</label>
        <textarea
          className="input-field min-h-[80px] resize-none"
          value={properties.message || ''}
          onChange={(e) => handlePropertyChange('message', e.target.value)}
          placeholder="Congratulations! You have completed your adventure..."
        />
      </div>
      <div>
        <label className="input-label">Final Score</label>
        <input
          type="number"
          className="input-field"
          value={properties.finalScore || 0}
          onChange={(e) => handlePropertyChange('finalScore', parseInt(e.target.value))}
          min="0"
          max="10000"
        />
      </div>
      <div>
        <label className="input-label">Unlock Condition (Optional)</label>
        <input
          type="text"
          className="input-field"
          value={properties.unlockCondition || ''}
          onChange={(e) => handlePropertyChange('unlockCondition', e.target.value)}
          placeholder="Complete all side quests"
        />
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
          <p className="text-sm text-gray-600">Select a block to edit its properties</p>
        </div>
        
        <div className="card">
          <div className="text-center py-8">
            <div className="text-4xl mb-3">🎯</div>
            <div className="text-gray-500 text-sm">
              Click on any block in the canvas to view and edit its details
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
            <div>• Click blocks to select and edit properties</div>
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
          Editing: <span className="font-medium capitalize">{selectedNode.type}</span> block
        </p>
      </div>

      <div className="card">
        <div className="space-y-4">
          <div>
            <label className="input-label">Block Label</label>
            <input
              type="text"
              className="input-field"
              value={selectedNode.data?.label || ''}
              onChange={(e) => {
                if (selectedNode) {
                  onUpdateNode(selectedNode.id, { 
                    ...properties, 
                    label: e.target.value 
                  })
                }
              }}
              placeholder="Enter block label"
            />
          </div>
          
          {renderBlockDetails()}
        </div>
      </div>

      <div className="card bg-green-50 border-green-200">
        <h4 className="text-sm font-semibold text-green-700 mb-2 flex items-center">
          <span className="mr-2">✅</span>
          Changes Saved
        </h4>
        <div className="text-xs text-green-600">
          All changes are automatically saved and will be included in exports
        </div>
      </div>
    </div>
  )
}
