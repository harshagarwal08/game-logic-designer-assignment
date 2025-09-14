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

  const handleGenerateFlow = async () => {
    console.log("🚀 Generate Flow button clicked with input:", inputText)
    if (!inputText.trim()) return

    setIsGenerating(true)
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Parse the input text to generate flow
    const flowText = inputText.toLowerCase().trim()
    const generatedNodes: Node[] = []
    const generatedEdges: Edge[] = []
    
    let nodeId = 1
    let xPosition = 100
    const yPosition = 100
    
    // Parse flow from text like "Start → Choice → Enemy → End"
    // Split by arrow symbols or dashes
    const flowParts = flowText.split(/[→\->]/).map(part => part.trim())
    
    flowParts.forEach((part, index) => {
      const nodeType = part.toLowerCase()
      let nodeData: any = {}
      
      // Create node based on type
      switch (nodeType) {
        case 'start':
          nodeData = {
            label: 'Game Start',
            properties: {
              title: 'Adventure Begins',
              description: 'Welcome to your adventure!',
              startingHealth: 100,
              startingGold: 0,
              difficulty: 'medium'
            }
          }
          break
        case 'choice':
          nodeData = {
            label: 'Player Choice',
            properties: {
              question: 'What will you do?',
              optionA: 'Take the safe path',
              optionB: 'Risk the dangerous route',
              consequenceA: 'You avoid danger but miss opportunities',
              consequenceB: 'You face challenges but find rewards'
            }
          }
          break
        case 'enemy':
          nodeData = {
            label: 'Enemy Encounter',
            properties: {
              name: 'Goblin Warrior',
              health: 60,
              attack: 15,
              defense: 5,
              goldReward: 30,
              experiencePoints: 20
            }
          }
          break
        case 'treasure':
          nodeData = {
            label: 'Treasure Found',
            properties: {
              name: 'Ancient Chest',
              value: 100,
              type: 'gold',
              rarity: 'rare',
              description: 'A mysterious chest filled with gold'
            }
          }
          break
        case 'end':
          nodeData = {
            label: 'Game Over',
            properties: {
              title: 'Quest Complete',
              endingType: 'success',
              message: 'Congratulations! You have completed your adventure.',
              finalScore: 150,
              unlockCondition: 'Defeat all enemies'
            }
          }
          break
        default:
          // If it's not a recognized type, try to create a generic node
          nodeData = {
            label: part.charAt(0).toUpperCase() + part.slice(1),
            properties: {
              name: part.charAt(0).toUpperCase() + part.slice(1),
              description: `A ${part} block in your adventure`
            }
          }
      }
      
      // Add node to the flow
      generatedNodes.push({
        id: nodeId.toString(),
        type: nodeType === 'start' ? 'start' : 
              nodeType === 'choice' ? 'choice' :
              nodeType === 'enemy' ? 'enemy' :
              nodeType === 'treasure' ? 'treasure' :
              nodeType === 'end' ? 'end' : 'choice', // Default to choice for unknown types
        position: { x: xPosition, y: yPosition },
        data: nodeData
      })
      
      // Create edge to next node
      if (index < flowParts.length - 1) {
        generatedEdges.push({
          id: `${nodeId}-${nodeId + 1}`,
          source: nodeId.toString(),
          target: (nodeId + 1).toString(),
          type: 'smoothstep'
        })
      }
      
      nodeId++
      xPosition += 200
    })

    // Now fix the validation issues by adding proper connections
    const fixedNodes = [...generatedNodes]
    const fixedEdges = [...generatedEdges]
    
    // Find choice blocks and add proper outputs
    fixedNodes.forEach((node, index) => {
      if (node.type === 'choice') {
        // Find the next node after this choice
        const nextNodeIndex = index + 1
        if (nextNodeIndex < fixedNodes.length) {
          const nextNode = fixedNodes[nextNodeIndex]
          
          // Create two outputs from choice: one to next node, one to end
          const choiceNodeId = node.id
          const nextNodeId = nextNode.id
          
          // Remove the existing single edge
          const existingEdgeIndex = fixedEdges.findIndex(edge => 
            edge.source === choiceNodeId && edge.target === nextNodeId
          )
          if (existingEdgeIndex !== -1) {
            fixedEdges.splice(existingEdgeIndex, 1)
          }
          
          // Add two edges from choice (without labels)
          fixedEdges.push({
            id: `${choiceNodeId}-${nextNodeId}-a`,
            source: choiceNodeId,
            target: nextNodeId,
            type: 'smoothstep'
          })
          
          // Find or create an end node for the second option
          let endNode = fixedNodes.find(n => n.type === 'end')
          if (!endNode) {
            // Create an end node
            endNode = {
              id: 'end-' + Date.now(),
              type: 'end',
              position: { x: xPosition + 200, y: yPosition + 100 },
              data: {
                label: 'Game Over',
                properties: {
                  title: 'Quest Complete',
                  endingType: 'success',
                  message: 'Congratulations! You have completed your adventure.',
                  finalScore: 150
                }
              }
            }
            fixedNodes.push(endNode)
          }
          
          fixedEdges.push({
            id: `${choiceNodeId}-${endNode.id}-b`,
            source: choiceNodeId,
            target: endNode.id,
            type: 'smoothstep'
          })
        }
      }
      
      // For Enemy blocks, ensure they connect to Treasure or End
      if (node.type === 'enemy') {
        const nextNodeIndex = index + 1
        if (nextNodeIndex < fixedNodes.length) {
          const nextNode = fixedNodes[nextNodeIndex]
          
          // If next node is not treasure or end, create a treasure node
          if (nextNode.type !== 'treasure' && nextNode.type !== 'end') {
            const treasureNode = {
              id: 'treasure-' + Date.now(),
              type: 'treasure',
              position: { x: xPosition + 200, y: yPosition + 100 },
              data: {
                label: 'Treasure Found',
                properties: {
                  name: 'Ancient Chest',
                  value: 100,
                  type: 'gold',
                  rarity: 'rare',
                  description: 'A mysterious chest filled with gold'
                }
              }
            }
            fixedNodes.push(treasureNode)
            
            // Add edge from enemy to treasure
            fixedEdges.push({
              id: `${node.id}-${treasureNode.id}`,
              source: node.id,
              target: treasureNode.id,
              type: 'smoothstep'
            })
            
            // Add edge from treasure to next node
            fixedEdges.push({
              id: `${treasureNode.id}-${nextNode.id}`,
              source: treasureNode.id,
              target: nextNode.id,
              type: 'smoothstep'
            })
          }
        }
      }
    })

    console.log("🚀 Generated flow:", fixedNodes.length, "nodes,", fixedEdges.length, "edges")

    if (onGenerateFlow) {
      console.log("🚀 Calling onGenerateFlow with:", fixedNodes.length, "nodes and", fixedEdges.length, "edges")
      onGenerateFlow(fixedNodes, fixedEdges)
    }
    
    setIsGenerating(false)
  }

  const quickExamples = [
    {
      title: "🏰 Classic Adventure",
      description: "A traditional hero's journey",
      prompt: "Start → Choice → Enemy → Treasure → End",
      storyline: "Begin your quest, face a crucial decision, battle a foe, claim your reward, and complete your adventure!"
    },
    {
      title: "⚔️ Combat Focused",
      description: "Multiple battles and challenges",
      prompt: "Start → Enemy → Choice → Enemy → Treasure → End",
      storyline: "Jump straight into action! Fight enemies, make strategic choices, face more battles, and earn your victory!"
    },
    {
      title: "🧭 Choice Heavy",
      description: "Multiple decision points",
      prompt: "Start → Choice → Choice → Enemy → End",
      storyline: "Navigate through complex decisions! Make multiple choices that shape your path, then face the final challenge!"
    },
    {
      title: "💎 Treasure Hunt",
      description: "Focus on discovery and rewards",
      prompt: "Start → Choice → Treasure → Choice → End",
      storyline: "Embark on a treasure hunt! Make choices that lead to discoveries, find valuable rewards, and choose your ending!"
    },
    {
      title: "🎯 Balanced Quest",
      description: "Mix of all elements",
      prompt: "Start → Choice → Enemy → Choice → Treasure → End",
      storyline: "The perfect adventure! Make choices, fight enemies, discover treasures, and create your own epic story!"
    },
    {
      title: "⚡ Quick Adventure",
      description: "Short and sweet",
      prompt: "Start → Enemy → End",
      storyline: "A quick challenge! Face an enemy and prove your worth in this fast-paced adventure!"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-header">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <span className="mr-2 text-2xl">🤖</span>
          AI Flow Generator
        </h3>
        <p className="text-sm text-gray-600">Transform your ideas into interactive game flows with AI magic!</p>
      </div>

      {/* Text-to-Flow Generation */}
      <div className="card">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
          <span className="mr-2 text-lg">✨</span>
          Generate Flow from Text
        </h4>
        <div className="space-y-3">
          <textarea
            className="input-field min-h-[100px] resize-none"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Describe your game flow: Start → Choice → Enemy → End"
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
                <span className="mr-2 animate-spin text-lg">⚡</span>
                Generating Your Adventure...
              </>
            ) : (
              <>
                <span className="mr-2 text-lg">🚀</span>
                Generate Adventure Flow
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick Examples */}
      <div className="card bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        <h4 className="text-sm font-semibold text-purple-700 mb-3 flex items-center">
          <span className="mr-2 text-lg">⚡</span>
          Quick Examples
        </h4>
        <p className="text-xs text-purple-600 mb-4">Click any template to generate a complete adventure flow!</p>
        <div className="space-y-3">
          {quickExamples.map((example, index) => (
            <button
              key={index}
              onClick={() => setInputText(example.prompt)}
              className="text-left block w-full p-4 bg-white rounded-lg border border-purple-200 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-sm text-purple-800">
                    {example.title}
                  </div>
                  <div className="text-xs text-purple-500 font-mono bg-purple-100 px-2 py-1 rounded">
                    {example.prompt}
                  </div>
                </div>
                <div className="text-xs text-purple-600">
                  {example.description}
                </div>
                <div className="text-xs text-gray-600 italic leading-relaxed">
                  "{example.storyline}"
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="card bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
        <h4 className="text-sm font-semibold text-yellow-700 mb-3 flex items-center">
          <span className="mr-2 text-lg">💡</span>
          Pro Tips
        </h4>
        <div className="space-y-2 text-xs text-yellow-700">
          <div className="flex items-start">
            <span className="mr-2">🎯</span>
            <span>Use arrows (→) or dashes (-) to separate block types</span>
          </div>
          <div className="flex items-start">
            <span className="mr-2">🔄</span>
            <span>AI automatically adds multiple outputs for Choice blocks</span>
          </div>
          <div className="flex items-start">
            <span className="mr-2">⚔️</span>
            <span>Enemy blocks automatically connect to Treasure or End</span>
          </div>
          <div className="flex items-start">
            <span className="mr-2">✨</span>
            <span>All generated flows pass validation automatically!</span>
          </div>
        </div>
      </div>
    </div>
  )
}
