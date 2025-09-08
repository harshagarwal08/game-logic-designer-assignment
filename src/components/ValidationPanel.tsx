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
  
  const errors = validationResults.filter(result => result.type === 'error')
  const warnings = validationResults.filter(result => result.type === 'warning')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-header">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <span className="mr-2">✅</span>
          Flow Validation
        </h3>
        <p className="text-sm text-gray-600">Check your flow for design issues</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className={`card ${errors.length === 0 ? 'status-success' : 'status-error'}`}>
          <div className="text-center">
            <div className="text-2xl font-bold mb-1">
              {errors.length === 0 ? '✅' : '❌'}
            </div>
            <div className="text-sm font-medium">
              {errors.length} Error{errors.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
        <div className={`card ${warnings.length === 0 ? 'status-success' : 'status-warning'}`}>
          <div className="text-center">
            <div className="text-2xl font-bold mb-1">
              {warnings.length === 0 ? '✅' : '⚠️'}
            </div>
            <div className="text-sm font-medium">
              {warnings.length} Warning{warnings.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="card">
          <h4 className="text-sm font-semibold text-red-700 mb-3 flex items-center">
            <span className="mr-2">❌</span>
            Critical Issues
          </h4>
          <div className="space-y-2">
            {errors.map((error, index) => (
              <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-sm font-medium text-red-800 mb-1">
                  {error.title}
                </div>
                <div className="text-xs text-red-600">
                  {error.message}
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
            Recommendations
          </h4>
          <div className="space-y-2">
            {warnings.map((warning, index) => (
              <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="text-sm font-medium text-yellow-800 mb-1">
                  {warning.title}
                </div>
                <div className="text-xs text-yellow-600">
                  {warning.message}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Clear */}
      {errors.length === 0 && warnings.length === 0 && (
        <div className="card status-success">
          <div className="text-center py-6">
            <div className="text-4xl mb-3">🎉</div>
            <div className="text-lg font-semibold text-green-800 mb-2">
              Perfect Flow!
            </div>
            <div className="text-sm text-green-600">
              Your game flow passes all validation checks. Great design!
            </div>
          </div>
        </div>
      )}

      {/* Validation Rules */}
      <div className="card bg-gray-50">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
          <span className="mr-2">📋</span>
          Validation Rules
        </h4>
        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex items-start">
            <span className="text-green-500 mr-2 mt-0.5">✓</span>
            <span>Must have exactly one Start block</span>
          </div>
          <div className="flex items-start">
            <span className="text-green-500 mr-2 mt-0.5">✓</span>
            <span>Must have at least one End block</span>
          </div>
          <div className="flex items-start">
            <span className="text-green-500 mr-2 mt-0.5">✓</span>
            <span>Choice blocks must have 2+ outputs</span>
          </div>
          <div className="flex items-start">
            <span className="text-green-500 mr-2 mt-0.5">✓</span>
            <span>Enemy blocks must connect to Treasure or End</span>
          </div>
        </div>
      </div>
    </div>
  )
}
