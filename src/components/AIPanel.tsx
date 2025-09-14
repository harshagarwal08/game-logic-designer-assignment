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

  const examplePrompts = [
    "Start → Choice → Enemy → End",
    "Start → Choice → Treasure → End",
    "Start → Enemy → Choice → Treasure → End",
    "Start → Choice → Enemy → Choice → End"
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-header">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <span className="mr-2">🤖</span>
          AI Assistant
        </h3>
        <p className="text-sm text-gray-600">Generate flows from text descriptions</p>
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
            placeholder="Type your flow: Start → Choice → Enemy → End"
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
                <span className="mr-2">��</span>
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
    </div>
  )
}
