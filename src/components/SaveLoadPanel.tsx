'use client'

import React, { useState } from 'react'
import { Node, Edge } from 'reactflow'
import { 
  exportFlowToJSON, 
  importFlowFromJSON, 
  downloadJSON, 
  uploadJSON,
  saveToLocalStorage,
  loadFromLocalStorage,
  clearLocalStorage,
  FlowData
} from '@/utils/persistence'

interface SaveLoadPanelProps {
  nodes: Node[]
  edges: Edge[]
  onLoadFlow: (nodes: Node[], edges: Edge[]) => void
}

export default function SaveLoadPanel({ nodes, edges, onLoadFlow }: SaveLoadPanelProps) {
  const [flowName, setFlowName] = useState('Untitled Flow')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleExport = () => {
    try {
      const jsonString = exportFlowToJSON(nodes, edges, flowName)
      downloadJSON(jsonString, `${flowName.replace(/\s+/g, '-').toLowerCase()}.json`)
      showMessage('success', 'Flow exported successfully!')
    } catch (error) {
      showMessage('error', `Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleImport = async () => {
    try {
      setIsLoading(true)
      const jsonString = await uploadJSON()
      const flowData = importFlowFromJSON(jsonString)
      
      onLoadFlow(flowData.nodes, flowData.edges)
      
      if (flowData.metadata?.name) {
        setFlowName(flowData.metadata.name)
      }
      
      showMessage('success', 'Flow imported successfully!')
    } catch (error) {
      showMessage('error', `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveToLocalStorage = () => {
    try {
      saveToLocalStorage(nodes, edges)
      showMessage('success', 'Flow saved to browser storage!')
    } catch (error) {
      showMessage('error', `Save failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleLoadFromLocalStorage = () => {
    try {
      const flowData = loadFromLocalStorage()
      if (flowData) {
        onLoadFlow(flowData.nodes, flowData.edges)
        
        if (flowData.metadata?.name) {
          setFlowName(flowData.metadata.name)
        }
        
        showMessage('success', 'Flow loaded from browser storage!')
      } else {
        showMessage('error', 'No saved flow found in browser storage')
      }
    } catch (error) {
      showMessage('error', `Load failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleClearLocalStorage = () => {
    try {
      clearLocalStorage()
      showMessage('success', 'Browser storage cleared!')
    } catch (error) {
      showMessage('error', `Clear failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="space-y-4">
      <div className="border-b border-gray-300 pb-3">
        <h3 className="text-lg font-semibold text-gray-800">Save & Load</h3>
      </div>

      {/* Flow Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Flow Name</label>
        <input
          type="text"
          value={flowName}
          onChange={(e) => setFlowName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter flow name"
        />
      </div>

      {/* Message */}
      {message && (
        <div className={`p-3 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Export/Import */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">File Operations</h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleExport}
            className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Export JSON
          </button>
          <button
            onClick={handleImport}
            disabled={isLoading}
            className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Import JSON'}
          </button>
        </div>
      </div>

      {/* Local Storage */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Browser Storage</h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleSaveToLocalStorage}
            className="px-3 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Save Locally
          </button>
          <button
            onClick={handleLoadFromLocalStorage}
            className="px-3 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            Load Local
          </button>
        </div>
        <button
          onClick={handleClearLocalStorage}
          className="w-full px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Clear Storage
        </button>
      </div>

      {/* Info */}
      <div className="text-xs text-gray-500 space-y-1">
        <div className="font-medium">Tips:</div>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Export creates a downloadable JSON file</li>
          <li>Import loads a JSON file from your computer</li>
          <li>Local storage saves automatically in your browser</li>
          <li>All data includes nodes, edges, and metadata</li>
        </ul>
      </div>
    </div>
  )
}
