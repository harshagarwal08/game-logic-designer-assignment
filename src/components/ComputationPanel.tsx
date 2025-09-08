'use client'

import React from 'react'
import { Node, Edge } from 'reactflow'
import { computeFlowMetrics, formatNumber, getScoreGrade } from '@/utils/computation'

interface ComputationPanelProps {
  nodes: Node[]
  edges: Edge[]
}

export default function ComputationPanel({ nodes, edges }: ComputationPanelProps) {
  const result = computeFlowMetrics(nodes, edges)
  const { metrics, breakdown, recommendations } = result
  const scoreGrade = getScoreGrade(metrics.totalAdventureScore)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-header">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <span className="mr-2">📊</span>
          Flow Analysis
        </h3>
        <p className="text-sm text-gray-600">Real-time computation of flow metrics</p>
      </div>

      {/* Main Score */}
      <div className="card bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-700 mb-2">
            Total Adventure Score
          </div>
          <div className="text-5xl font-bold mb-3">
            <span className={scoreGrade.color}>{metrics.totalAdventureScore}</span>
          </div>
          <div className={`text-xl font-bold ${scoreGrade.color} mb-2`}>
            Grade: {scoreGrade.grade}
          </div>
          <div className="text-sm text-gray-600">
            {scoreGrade.grade === 'A+' ? 'Exceptional design!' :
             scoreGrade.grade === 'A' ? 'Excellent flow!' :
             scoreGrade.grade === 'B' ? 'Good design' :
             scoreGrade.grade === 'C' ? 'Decent flow' :
             scoreGrade.grade === 'D' ? 'Needs improvement' : 'Requires major work'}
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="metric-card bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="metric-label text-yellow-800">💰 Treasure Value</div>
          <div className="metric-value text-yellow-600">
            {formatNumber(metrics.totalTreasureValue)}
          </div>
        </div>
        <div className="metric-card bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="metric-label text-red-800">⚔️ Enemy Rewards</div>
          <div className="metric-value text-red-600">
            {formatNumber(metrics.totalEnemyReward)}
          </div>
        </div>
        <div className="metric-card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="metric-label text-green-800">⭐ Experience</div>
          <div className="metric-value text-green-600">
            {formatNumber(metrics.totalExperience)}
          </div>
        </div>
        <div className="metric-card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="metric-label text-purple-800">⏱️ Play Time</div>
          <div className="metric-value text-purple-600">
            {Math.round(metrics.estimatedPlayTime)}m
          </div>
        </div>
      </div>

      {/* Flow Breakdown */}
      <div className="card">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
          <span className="mr-2">📋</span>
          Flow Breakdown
        </h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600 flex items-center">
              <span className="mr-1">💰</span>
              Treasures:
            </span>
            <span className="font-semibold text-gray-800">{breakdown.treasureCount}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600 flex items-center">
              <span className="mr-1">⚔️</span>
              Enemies:
            </span>
            <span className="font-semibold text-gray-800">{breakdown.enemyCount}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600 flex items-center">
              <span className="mr-1">🤔</span>
              Choices:
            </span>
            <span className="font-semibold text-gray-800">{breakdown.choiceCount}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600 flex items-center">
              <span className="mr-1">🔗</span>
              Connections:
            </span>
            <span className="font-semibold text-gray-800">{breakdown.pathCount}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600 flex items-center">
              <span className="mr-1">📏</span>
              Max Depth:
            </span>
            <span className="font-semibold text-gray-800">{breakdown.maxDepth}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600 flex items-center">
              <span className="mr-1">🧩</span>
              Complexity:
            </span>
            <span className="font-semibold text-gray-800">{metrics.pathComplexity.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Risk-Reward Analysis */}
      <div className="card">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
          <span className="mr-2">⚖️</span>
          Risk-Reward Analysis
        </h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Balance Ratio:</span>
            <span className={`font-semibold ${
              metrics.riskRewardRatio >= 1 ? 'text-green-600' : 
              metrics.riskRewardRatio >= 0.5 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {metrics.riskRewardRatio.toFixed(2)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                metrics.riskRewardRatio >= 1 ? 'bg-gradient-to-r from-green-400 to-green-500' : 
                metrics.riskRewardRatio >= 0.5 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : 'bg-gradient-to-r from-red-400 to-red-500'
              }`}
              style={{ width: `${Math.min(100, metrics.riskRewardRatio * 50)}%` }}
            />
          </div>
          <div className={`text-xs text-center p-2 rounded-lg ${
            metrics.riskRewardRatio >= 1 ? 'status-success' :
            metrics.riskRewardRatio >= 0.5 ? 'status-warning' : 'status-error'
          }`}>
            {metrics.riskRewardRatio >= 1 ? '🎯 Excellent balance - rewards match challenges' :
             metrics.riskRewardRatio >= 0.5 ? '⚖️ Good balance - minor adjustments needed' : '⚠️ Poor balance - enemies too strong for rewards'}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="card">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
          <span className="mr-2">💡</span>
          Smart Recommendations
        </h4>
        <div className="space-y-2">
          {recommendations.map((rec, index) => (
            <div key={index} className="text-sm text-gray-700 flex items-start p-2 bg-blue-50 rounded-lg">
              <span className="text-blue-500 mr-2 mt-0.5">•</span>
              <span>{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Score Explanation */}
      <div className="card bg-gray-50">
        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
          <span className="mr-2">🧮</span>
          Score Calculation
        </h4>
        <div className="text-xs text-gray-600 space-y-1">
          <div className="font-medium text-gray-700">Formula:</div>
          <div className="bg-white p-2 rounded border font-mono text-xs">
            Score = Treasure×1.0 + Enemy×0.8 + XP×0.5 + Complexity×10 + Difficulty×20
          </div>
          <div className="text-gray-500">
            Penalties applied for poor risk-reward balance
          </div>
        </div>
      </div>
    </div>
  )
}
