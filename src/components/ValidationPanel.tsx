'use client'

import React from 'react'
import { Node, Edge } from 'reactflow'
import { validateFlow } from '@/utils/validation'

interface ValidationPanelProps {
  nodes: Node[]
  edges: Edge[]
}

export default function ValidationPanel({ nodes, edges }: ValidationPanelProps) {
  const validationResults = validateFlow(nodes, edges)
  
  const errors = validationResults.errors.filter(result => result.type === 'error')
  const warnings = validationResults.errors.filter(result => result.type === 'warning')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-header">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <span className="mr-2">✅</span>
          Flow Validation
        </h3>
        <p className="text-sm text-gray-600">Check your flow for errors and warnings</p>
      </div>

      {/* Validation Status */}
      <div className={`card ${validationResults.isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-3 ${validationResults.isValid ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <div>
              <h4 className={`text-sm font-semibold ${validationResults.isValid ? 'text-green-700' : 'text-red-700'}`}>
                {validationResults.isValid ? 'Flow is Valid' : 'Flow has Issues'}
              </h4>
              <p className={`text-xs ${validationResults.isValid ? 'text-green-600' : 'text-red-600'}`}>
                {validationResults.isValid 
                  ? 'Your flow meets all validation requirements' 
                  : 'Please fix the errors below to make your flow valid'
                }
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-lg font-bold ${validationResults.isValid ? 'text-green-600' : 'text-red-600'}`}>
              {errors.length}
            </div>
            <div className="text-xs text-gray-500">Errors</div>
          </div>
        </div>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="card">
          <h4 className="text-sm font-semibold text-red-700 mb-3 flex items-center">
            <span className="mr-2">❌</span>
            Errors ({errors.length})
          </h4>
          <div className="space-y-2">
            {errors.map((error, index) => (
              <div key={index} className="flex items-start p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm text-red-800 font-medium">{error.message}</p>
                  {error.nodeId && (
                    <p className="text-xs text-red-600 mt-1">Node ID: {error.nodeId}</p>
                  )}
                  {error.edgeId && (
                    <p className="text-xs text-red-600 mt-1">Edge ID: {error.edgeId}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="card">
          <h4 className="text-sm font-semibold text-yellow-700 mb-3 flex items-center">
            <span className="mr-2">⚠️</span>
            Warnings ({warnings.length})
          </h4>
          <div className="space-y-2">
            {warnings.map((warning, index) => (
              <div key={index} className="flex items-start p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm text-yellow-800 font-medium">{warning.message}</p>
                  {warning.nodeId && (
                    <p className="text-xs text-yellow-600 mt-1">Node ID: {warning.nodeId}</p>
                  )}
                  {warning.edgeId && (
                    <p className="text-xs text-yellow-600 mt-1">Edge ID: {warning.edgeId}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Success State */}
      {validationResults.isValid && errors.length === 0 && warnings.length === 0 && (
        <div className="card bg-green-50 border-green-200">
          <div className="text-center py-6">
            <div className="text-4xl mb-3">🎉</div>
            <h4 className="text-lg font-semibold text-green-700 mb-2">Perfect Flow!</h4>
            <p className="text-sm text-green-600">
              Your flow is valid and ready to use. No errors or warnings detected.
            </p>
          </div>
        </div>
      )}

      {/* Validation Rules */}
      <div className="card bg-blue-50 border-blue-200">
        <h4 className="text-sm font-semibold text-blue-700 mb-3 flex items-center">
          <span className="mr-2">📋</span>
          Validation Rules
        </h4>
        <div className="text-xs text-blue-600 space-y-2">
          <div className="flex items-start">
            <span className="font-semibold mr-2">1.</span>
            <span>Flow must start with exactly one Start block</span>
          </div>
          <div className="flex items-start">
            <span className="font-semibold mr-2">2.</span>
            <span>Flow must end with at least one End block</span>
          </div>
          <div className="flex items-start">
            <span className="font-semibold mr-2">3.</span>
            <span>Choice blocks must have 2 or more outputs</span>
          </div>
          <div className="flex items-start">
            <span className="font-semibold mr-2">4.</span>
            <span>Enemy blocks must connect to Treasure or End blocks</span>
          </div>
          <div className="flex items-start">
            <span className="font-semibold mr-2">5.</span>
            <span>No orphaned nodes (nodes without connections)</span>
          </div>
          <div className="flex items-start">
            <span className="font-semibold mr-2">6.</span>
            <span>No circular dependencies</span>
          </div>
        </div>
      </div>
    </div>
  )
}
