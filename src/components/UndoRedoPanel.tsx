'use client'

import React, { useState, useEffect } from 'react'
import { HistoryManager } from '@/utils/history'

interface UndoRedoPanelProps {
  historyManager: HistoryManager
  onUndo: () => void
  onRedo: () => void
}

export default function UndoRedoPanel({ historyManager, onUndo, onRedo }: UndoRedoPanelProps) {
  const [historyInfo, setHistoryInfo] = useState(historyManager.getHistoryInfo())

  // Update history info when history changes
  useEffect(() => {
    const updateHistoryInfo = () => {
      setHistoryInfo(historyManager.getHistoryInfo())
    }
    
    // Update immediately
    updateHistoryInfo()
    
    // Set up interval to check for changes
    const interval = setInterval(updateHistoryInfo, 100)
    
    return () => clearInterval(interval)
  }, [historyManager])

  const canUndo = historyInfo.canUndo
  const canRedo = historyInfo.canRedo
  const currentPosition = historyInfo.current
  const historySize = historyInfo.total

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-header">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <span className="mr-2">↩️</span>
          History Management
        </h3>
        <p className="text-sm text-gray-600">Undo and redo your changes</p>
      </div>

      {/* Action Buttons */}
      <div className="card">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
          <span className="mr-2">🎮</span>
          Actions
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={onUndo}
            disabled={!canUndo}
            className={`btn-secondary flex items-center justify-center ${
              !canUndo ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span className="mr-2">↩️</span>
            Undo
          </button>
          <button 
            onClick={onRedo}
            disabled={!canRedo}
            className={`btn-secondary flex items-center justify-center ${
              !canRedo ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span className="mr-2">↪️</span>
            Redo
          </button>
        </div>
      </div>

      {/* History Status */}
      <div className="card">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
          <span className="mr-2">📊</span>
          History Status
        </h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Current Position:</span>
            <span className="font-semibold text-gray-800">{currentPosition}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Steps:</span>
            <span className="font-semibold text-gray-800">{historySize}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Can Undo:</span>
            <span className={`font-semibold ${canUndo ? 'text-green-600' : 'text-gray-400'}`}>
              {canUndo ? '✅ Yes' : '❌ No'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Can Redo:</span>
            <span className={`font-semibold ${canRedo ? 'text-green-600' : 'text-gray-400'}`}>
              {canRedo ? '✅ Yes' : '❌ No'}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="card">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
          <span className="mr-2">📈</span>
          History Progress
        </h4>
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Start</span>
            <span>{currentPosition} / {historySize}</span>
            <span>Latest</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-400 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${historySize > 0 ? (currentPosition / historySize) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="card bg-gray-50">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
          <span className="mr-2">⌨️</span>
          Keyboard Shortcuts
        </h4>
        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>Undo:</span>
            <span className="font-mono bg-white px-2 py-1 rounded border">Ctrl+Z</span>
          </div>
          <div className="flex justify-between">
            <span>Redo:</span>
            <span className="font-mono bg-white px-2 py-1 rounded border">Ctrl+Y</span>
          </div>
          <div className="flex justify-between">
            <span>Delete:</span>
            <span className="font-mono bg-white px-2 py-1 rounded border">Del / Backspace</span>
          </div>
        </div>
      </div>

      {/* History Info */}
      <div className="card bg-blue-50 border-blue-200">
        <h4 className="text-sm font-semibold text-blue-700 mb-2 flex items-center">
          <span className="mr-2">ℹ️</span>
          About History
        </h4>
        <div className="text-xs text-blue-600 space-y-1">
          <div>• History tracks up to 20 steps</div>
          <div>• Each action creates a new history point</div>
          <div>• History is cleared when loading new flows</div>
          <div>• Auto-save doesn't affect history</div>
        </div>
      </div>
    </div>
  )
}
