'use client'

import React, { useState } from 'react'
import { Node, Edge } from 'reactflow'

interface AIPanelProps {
  nodes: Node[]
  edges: Edge[]
  onGenerateFlow?: (nodes: Node[], edges: Edge[]) => void
}

export default function AIPanel({ nodes, edges, onGenerateFlow }: AIPanelProps) {
  const [inputText, setInputText] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedBlock, setSelectedBlock] = useState<Node | null>(null)
  const [explanation, setExplanation] = useState('')

  const handleGenerateFlow = async () => {
    if (!inputText.trim()) return

    setIsGenerating(true)
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock AI-generated flow based on input
    const generatedNodes: Node[] = [
      {
        id: '1',
        type: 'start',
        position: { x: 100, y: 100 },
        data: {
          label: 'Adventure Begins',
          properties: {
            title: 'Hero\'s Journey',
            description: 'A brave hero embarks on an epic quest',
            startingHealth: 100,
            startingGold: 50,
            difficulty: 'medium'
          }
        }
      },
      {
        id: '2',
        type: 'choice',
        position: { x: 300, y: 100 },
        data: {
          label: 'First Decision',
          properties: {
            question: 'Which path do you choose?',
            optionA: 'Take the safe route',
            optionB: 'Risk the dangerous path',
            consequenceA: 'You avoid danger but miss treasure',
            consequenceB: 'You face challenges but find rewards'
          }
        }
      },
      {
        id: '3',
        type: 'enemy',
        position: { x: 500, y: 50 },
        data: {
          label: 'Goblin Warrior',
          properties: {
            name: 'Goblin Warrior',
            health: 60,
            attack: 15,
            defense: 5,
            goldReward: 30,
            experiencePoints: 20
          }
        }
      },
      {
        id: '4',
        type: 'treasure',
        position: { x: 500, y: 150 },
        data: {
          label: 'Ancient Chest',
          properties: {
            name: 'Ancient Chest',
            value: 100,
            type: 'gold',
            rarity: 'rare',
            description: 'A mysterious chest filled with gold'
          }
        }
      },
      {
        id: '5',
        type: 'end',
        position: { x: 700, y: 100 },
        data: {
          label: 'Victory!',
          properties: {
            title: 'Quest Complete',
            endingType: 'success',
            message: 'Congratulations! You have completed your adventure.',
            finalScore: 150,
            unlockCondition: 'Defeat all enemies'
          }
        }
      }
    ]

    const generatedEdges: Edge[] = [
      { id: '1-2', source: '1', target: '2', type: 'smoothstep' },
      { id: '2-3', source: '2', target: '3', type: 'smoothstep' },
      { id: '2-4', source: '2', target: '4', type: 'smoothstep' },
      { id: '3-5', source: '3', target: '5', type: 'smoothstep' },
      { id: '4-5', source: '4', target: '5', type: 'smoothstep' }
    ]

    if (onGenerateFlow) {
      onGenerateFlow(generatedNodes, generatedEdges)
    }
    
    setIsGenerating(false)
  }

  const handleExplainBlock = async (block: Node) => {
    setSelectedBlock(block)
    setIsGenerating(true)
    
    // Simulate AI explanation
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const explanations: Record<string, string> = {
      start: `The Start block "${block.data?.label}" begins your adventure. It sets the initial conditions with ${block.data?.properties?.startingHealth || 100} health and ${block.data?.properties?.startingGold || 0} gold. The ${block.data?.properties?.difficulty || 'medium'} difficulty level will affect the overall challenge.`,
      choice: `The Choice block "${block.data?.label}" presents a decision: "${block.data?.properties?.question}". Players can choose between "${block.data?.properties?.optionA}" or "${block.data?.properties?.optionB}". Each choice leads to different consequences, creating branching narratives.`,
      enemy: `The Enemy block "${block.data?.label}" represents a combat encounter. This ${block.data?.properties?.name} has ${block.data?.properties?.health || 50} health and ${block.data?.properties?.attack || 10} attack power. Defeating it rewards ${block.data?.properties?.goldReward || 25} gold and ${block.data?.properties?.experiencePoints || 15} experience points.`,
      treasure: `The Treasure block "${block.data?.label}" contains valuable loot. This ${block.data?.properties?.name} is worth ${block.data?.properties?.value || 100} points and is of ${block.data?.properties?.rarity || 'common'} rarity. It provides ${block.data?.properties?.type || 'gold'} rewards to enhance the player's capabilities.`,
      end: `The End block "${block.data?.label}" concludes the adventure. This ${block.data?.properties?.endingType || 'success'} ending gives players a final score of ${block.data?.properties?.finalScore || 0} points. The message "${block.data?.properties?.message}" provides closure to the player's journey.`
    }
    
    setExplanation(explanations[block.type] || 'This block is part of your game flow.')
    setIsGenerating(false)
  }

  const examplePrompts = [
    "Create a simple adventure with a choice between fighting a dragon or finding treasure",
    "Design a mystery game where players investigate clues and make decisions",
    "Build a fantasy quest with multiple enemy encounters and magical treasures",
    "Make a survival game with resource management and difficult choices"
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-header">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <span className="mr-2">🤖</span>
          AI Assistant
        </h3>
        <p className="text-sm text-gray-600">Generate flows from text or get block explanations</p>
      </div>

      {/* Text-to-Flow Generation */}
      <div className="card">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
          <span className="mr-2">✨</span>
          Generate Flow from Text
        </h4>
        <div className="space-y-3">
          <textarea
            className="input-field min-h-[100px] resize-none"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Describe the game flow you want to create..."
          />
          <button
            onClick={handleGenerateFlow}
            disabled={!inputText.trim() || isGenerating}
            className={`btn-primary w-full flex items-center justify-center ${
              !inputText.trim() || isGenerating ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isGenerating ? (
              <>
                <span className="mr-2 animate-spin">⏳</span>
                Generating Flow...
              </>
            ) : (
              <>
                <span className="mr-2">🚀</span>
                Generate Flow
              </>
            )}
          </button>
        </div>
      </div>

      {/* Example Prompts */}
      <div className="card bg-blue-50 border-blue-200">
        <h4 className="text-sm font-semibold text-blue-700 mb-3 flex items-center">
          <span className="mr-2">💡</span>
          Example Prompts
        </h4>
        <div className="space-y-2">
          {examplePrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => setInputText(prompt)}
              className="text-xs text-blue-600 hover:text-blue-800 text-left block w-full p-2 bg-white rounded border hover:bg-blue-50 transition-colors"
            >
              "{prompt}"
            </button>
          ))}
        </div>
      </div>

      {/* Block Explanation */}
      <div className="card">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
          <span className="mr-2">🔍</span>
          Explain Selected Block
        </h4>
        <div className="space-y-3">
          {selectedBlock ? (
            <div className="space-y-2">
              <div className="p-3 bg-gray-50 rounded border">
                <div className="text-sm font-medium text-gray-800 mb-1">
                  Selected: {selectedBlock.data?.label}
                </div>
                <div className="text-xs text-gray-600">
                  Type: {selectedBlock.type} • ID: {selectedBlock.id}
                </div>
              </div>
              <button
                onClick={() => handleExplainBlock(selectedBlock)}
                disabled={isGenerating}
                className={`btn-secondary w-full flex items-center justify-center ${
                  isGenerating ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isGenerating ? (
                  <>
                    <span className="mr-2 animate-spin">⏳</span>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <span className="mr-2">🧠</span>
                    Explain This Block
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="text-sm text-gray-500 text-center py-4">
              Select a block in the canvas to get an AI explanation
            </div>
          )}
        </div>
      </div>

      {/* Explanation Display */}
      {explanation && (
        <div className="card bg-green-50 border-green-200">
          <h4 className="text-sm font-semibold text-green-700 mb-3 flex items-center">
            <span className="mr-2">📖</span>
            AI Explanation
          </h4>
          <div className="text-sm text-green-800 leading-relaxed">
            {explanation}
          </div>
        </div>
      )}

      {/* AI Info */}
      <div className="card bg-gray-50">
        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
          <span className="mr-2">ℹ️</span>
          About AI Features
        </h4>
        <div className="text-xs text-gray-600 space-y-1">
          <div>• Text-to-flow generates complete game flows from descriptions</div>
          <div>• Block explanations provide context and design insights</div>
          <div>• AI suggestions help improve flow design and balance</div>
          <div>• Generated flows follow validation rules and best practices</div>
        </div>
      </div>
    </div>
  )
}
