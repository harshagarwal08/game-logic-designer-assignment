'use client'

import React from 'react'
import { Node, Edge } from 'reactflow'
import { ValidationResult, ValidationError, validateFlow, getValidationSummary } from '@/utils/validation'

interface ValidationPanelProps {
  nodes: Node[]
  edges: Edge[]
}

export default function ValidationPanel({ nodes, edges }: ValidationPanelProps) {
  const validationResult: ValidationResult = validateFlow(nodes, edges)
  const summary = getValidationSummary(validationResult)

  const getErrorIcon = (type: 'error' | 'warning') => {
    return type === 'error' ? '❌' : '⚠️'
  }

  const getErrorColor = (type: 'error' | 'warning') => {
    return type === 'error' ? 'text-red-600' : 'text-yellow-600'
  }

  return (
    <div className="space-y-3">
      <div className="border-b border-gray-300 pb-3">
        <h3 className="text-lg font-semibold text-gray-800">Flow Validation</h3>
        <div className={`text-sm font-medium ${validationResult.isValid ? 'text-green-600' : 'text-red-600'}`}>
          {summary}
        </div>
      </div>

      {validationResult.errors.length > 0 && (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          <h4 className="text-sm font-medium text-gray-700">Issues Found:</h4>
          {validationResult.errors.map((error: ValidationError, index: number) => (
            <div 
              key={index}
              className={`p-2 rounded border-l-4 ${
                error.type === 'error' 
                  ? 'bg-red-50 border-red-400' 
                  : 'bg-yellow-50 border-yellow-400'
              }`}
            >
              <div className="flex items-start space-x-2">
                <span className="text-sm">{getErrorIcon(error.type)}</span>
                <div className="flex-1">
                  <p className={`text-sm ${getErrorColor(error.type)}`}>
                    {error.message}
                  </p>
                  {error.nodeId && (
                    <p className="text-xs text-gray-500 mt-1">
                      Node ID: {error.nodeId}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-xs text-gray-500 space-y-1">
        <div className="font-medium">Validation Rules:</div>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Must have at least one Start block</li>
          <li>Must have at least one End block</li>
          <li>Choice blocks must have 2+ outputs</li>
          <li>Enemy blocks must connect to Treasure or End</li>
          <li>No orphaned blocks (warnings)</li>
          <li>No circular connections (warnings)</li>
        </ul>
      </div>
    </div>
  )
}
