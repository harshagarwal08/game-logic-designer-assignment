'use client'

import React from 'react'
import { HistoryManager } from '@/utils/history'

interface UndoRedoPanelProps {
  historyManager: HistoryManager
  onUndo: () => void
  onRedo: () => void
}

export default function UndoRedoPanel({ historyManager, onUndo, onRedo }: UndoRedoPanelProps) {
  const historyInfo = historyManager.getHistoryInfo()

  const handleUndo = () => {
    if (historyInfo.canUndo) {
      onUndo()
    }
  }

  const handleRedo = () => {
    if (historyInfo.canRedo) {
      onRedo()
    }
  }

  return (
    <div className="space-y-4">
      <div className="border-b border-gray-300 pb-3">
        <h3 className="text-lg font-semibold text-gray-800">Undo & Redo</h3>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleUndo}
          disabled={!historyInfo.canUndo}
          className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ↶ Undo
        </button>
        <button
          onClick={handleRedo}
          disabled={!historyInfo.canRedo}
          className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ↷ Redo
        </button>
      </div>

      {/* History Info */}
      <div className="text-sm text-gray-600">
        <div className="flex justify-between">
          <span>History:</span>
          <span>{historyInfo.current} / {historyInfo.total}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-200"
            style={{ 
              width: `${historyInfo.total > 0 ? (historyInfo.current / historyInfo.total) * 100 : 0}%` 
            }}
          />
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="text-xs text-gray-500 space-y-1">
        <div className="font-medium">Keyboard Shortcuts:</div>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li><kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Ctrl+Z</kbd> Undo</li>
          <li><kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Ctrl+Y</kbd> Redo</li>
          <li>Maximum {historyInfo.total} steps</li>
        </ul>
      </div>
    </div>
  )
}
