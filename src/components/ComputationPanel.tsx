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
    <div className="space-y-4">
      <div className="border-b border-gray-300 pb-3">
        <h3 className="text-lg font-semibold text-gray-800">Flow Analysis</h3>
        <p className="text-sm text-gray-600">Real-time computation of flow metrics</p>
      </div>

      {/* Main Score */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800 mb-1">
            Total Adventure Score
          </div>
          <div className="text-4xl font-bold mb-2">
            <span className={scoreGrade.color}>{metrics.totalAdventureScore}</span>
          </div>
          <div className={`text-lg font-semibold ${scoreGrade.color}`}>
            Grade: {scoreGrade.grade}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-yellow-50 p-3 rounded border">
          <div className="text-sm font-medium text-yellow-800">Treasure Value</div>
          <div className="text-xl font-bold text-yellow-600">
            {formatNumber(metrics.totalTreasureValue)}
          </div>
        </div>
        <div className="bg-red-50 p-3 rounded border">
          <div className="text-sm font-medium text-red-800">Enemy Rewards</div>
          <div className="text-xl font-bold text-red-600">
            {formatNumber(metrics.totalEnemyReward)}
          </div>
        </div>
        <div className="bg-green-50 p-3 rounded border">
          <div className="text-sm font-medium text-green-800">Experience</div>
          <div className="text-xl font-bold text-green-600">
            {formatNumber(metrics.totalExperience)}
          </div>
        </div>
        <div className="bg-purple-50 p-3 rounded border">
          <div className="text-sm font-medium text-purple-800">Play Time</div>
          <div className="text-xl font-bold text-purple-600">
            {Math.round(metrics.estimatedPlayTime)}m
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Flow Breakdown</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Treasures:</span>
            <span className="font-medium">{breakdown.treasureCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Enemies:</span>
            <span className="font-medium">{breakdown.enemyCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Choices:</span>
            <span className="font-medium">{breakdown.choiceCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Connections:</span>
            <span className="font-medium">{breakdown.pathCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Max Depth:</span>
            <span className="font-medium">{breakdown.maxDepth}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Complexity:</span>
            <span className="font-medium">{metrics.pathComplexity.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Risk-Reward Analysis */}
      <div className="bg-gray-50 p-3 rounded border">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Risk-Reward Analysis</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Risk-Reward Ratio:</span>
            <span className={`font-medium ${
              metrics.riskRewardRatio >= 1 ? 'text-green-600' : 
              metrics.riskRewardRatio >= 0.5 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {metrics.riskRewardRatio.toFixed(2)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                metrics.riskRewardRatio >= 1 ? 'bg-green-500' : 
                metrics.riskRewardRatio >= 0.5 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(100, metrics.riskRewardRatio * 50)}%` }}
            />
          </div>
          <div className="text-xs text-gray-500">
            {metrics.riskRewardRatio >= 1 ? 'Excellent balance' :
             metrics.riskRewardRatio >= 0.5 ? 'Good balance' : 'Needs improvement'}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Recommendations</h4>
        <div className="space-y-1">
          {recommendations.map((rec, index) => (
            <div key={index} className="text-sm text-gray-600 flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Score Explanation */}
      <div className="text-xs text-gray-500 space-y-1">
        <div className="font-medium">Score Calculation:</div>
        <div>Treasure Value × 1.0 + Enemy Rewards × 0.8 + Experience × 0.5 + Complexity × 10 + Difficulty × 20</div>
        <div>Penalties for poor risk-reward balance</div>
      </div>
    </div>
  )
}
