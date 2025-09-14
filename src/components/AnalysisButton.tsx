'use client'

import React, { useState } from 'react'
import { Node, Edge } from 'reactflow'
import ComputationPanel from './ComputationPanel'

interface AnalysisButtonProps {
  nodes: Node[]
  edges: Edge[]
}

export default function AnalysisButton({ nodes, edges }: AnalysisButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating Analysis Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 z-50 flex items-center space-x-2"
      >
        <span className="text-xl">📊</span>
        <span className="text-sm font-medium">Analysis</span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <div>
                <h2 className="text-xl font-bold">Flow Analysis</h2>
                <p className="text-blue-100 text-sm">Comprehensive analysis of your game flow</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <ComputationPanel nodes={nodes} edges={edges} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
