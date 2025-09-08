'use client'

import React, { useRef } from 'react'
import { Node, Edge } from 'reactflow'
import { exportFlowToJSON, importFlowFromJSON, saveToLocalStorage, loadFromLocalStorage, clearLocalStorage } from '@/utils/persistence'

interface SaveLoadPanelProps {
  nodes: Node[]
  edges: Edge[]
  onLoadFlow: (nodes: Node[], edges: Edge[]) => void
}

export default function SaveLoadPanel({ nodes, edges, onLoadFlow }: SaveLoadPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExportJson = () => {
    try {
      const jsonString = exportFlowToJSON(nodes, edges)
      downloadJSON(jsonString, 'game-flow.json')
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    }
  }

  const handleImportJson = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const result = importFlowFromJSON(e.target?.result as string)
          if (result) {
            onLoadFlow(result.nodes, result.edges)
            alert('Flow imported successfully!')
          } else {
            alert('Invalid file format. Please select a valid flow file.')
          }
        } catch (error) {
          console.error('Import failed:', error)
          alert('Import failed. Please check the file format.')
        }
      }
      reader.readAsText(file)
    }
  }

  const handleSaveToLocalStorage = () => {
    try {
      saveToLocalStorage(nodes, edges)
      alert('Flow saved to browser storage!')
    } catch (error) {
      console.error('Save failed:', error)
      alert('Save failed. Please try again.')
    }
  }

  const handleLoadFromLocalStorage = () => {
    try {
      const savedFlow = loadFromLocalStorage()
      if (savedFlow) {
        onLoadFlow(savedFlow.nodes, savedFlow.edges)
        alert('Flow loaded from browser storage!')
      } else {
        alert('No saved flow found in browser storage.')
      }
    } catch (error) {
      console.error('Load failed:', error)
      alert('Load failed. Please try again.')
    }
  }

  const handleClearLocalStorage = () => {
    if (confirm('Are you sure you want to clear all saved flows from browser storage?')) {
      try {
        clearLocalStorage()
        alert('Browser storage cleared!')
      } catch (error) {
        console.error('Clear failed:', error)
        alert('Clear failed. Please try again.')
      }
    }
  }

  const downloadJSON = (jsonString: string, filename: string = 'game-flow.json'): void => {
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-header">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <span className="mr-2">💾</span>
          Save & Load
        </h3>
        <p className="text-sm text-gray-600">Export, import, and manage your flows</p>
      </div>

      {/* JSON Operations */}
      <div className="card">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
          <span className="mr-2">📄</span>
          JSON File Operations
        </h4>
        <div className="space-y-3">
          <button 
            onClick={handleExportJson}
            className="btn-primary w-full flex items-center justify-center"
          >
            <span className="mr-2">📤</span>
            Export to JSON
          </button>
          <button 
            onClick={handleImportJson}
            className="btn-secondary w-full flex items-center justify-center"
          >
            <span className="mr-2">📥</span>
            Import from JSON
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Browser Storage Operations */}
      <div className="card">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
          <span className="mr-2">🌐</span>
          Browser Storage
        </h4>
        <div className="space-y-3">
          <button 
            onClick={handleSaveToLocalStorage}
            className="btn-success w-full flex items-center justify-center"
          >
            <span className="mr-2">💾</span>
            Save to Browser
          </button>
          <button 
            onClick={handleLoadFromLocalStorage}
            className="btn-secondary w-full flex items-center justify-center"
          >
            <span className="mr-2">📂</span>
            Load from Browser
          </button>
          <button 
            onClick={handleClearLocalStorage}
            className="btn-danger w-full flex items-center justify-center"
          >
            <span className="mr-2">🗑️</span>
            Clear Browser Storage
          </button>
        </div>
      </div>

      {/* Flow Statistics */}
      <div className="card bg-gray-50">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
          <span className="mr-2">📊</span>
          Current Flow Stats
        </h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Nodes:</span>
            <span className="font-semibold text-gray-800">{nodes.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Connections:</span>
            <span className="font-semibold text-gray-800">{edges.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">File Size:</span>
            <span className="font-semibold text-gray-800">
              {Math.round(JSON.stringify({ nodes, edges }).length / 1024)}KB
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Last Modified:</span>
            <span className="font-semibold text-gray-800">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      {/* Help */}
      <div className="card bg-blue-50 border-blue-200">
        <h4 className="text-sm font-semibold text-blue-700 mb-2 flex items-center">
          <span className="mr-2">💡</span>
          Tips
        </h4>
        <div className="text-xs text-blue-600 space-y-1">
          <div>• JSON files can be shared with others</div>
          <div>• Browser storage persists between sessions</div>
          <div>• Auto-save runs every 2 seconds</div>
          <div>• Files include all node properties and connections</div>
        </div>
      </div>
    </div>
  )
}
