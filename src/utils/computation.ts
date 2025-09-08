import { Node, Edge } from 'reactflow'

export interface FlowMetrics {
  totalAdventureScore: number
  totalTreasureValue: number
  totalEnemyReward: number
  totalExperience: number
  averageDifficulty: number
  pathComplexity: number
  riskRewardRatio: number
  estimatedPlayTime: number // in minutes
}

export interface ComputationResult {
  metrics: FlowMetrics
  breakdown: {
    treasureCount: number
    enemyCount: number
    choiceCount: number
    pathCount: number
    maxDepth: number
  }
  recommendations: string[]
}

export function computeFlowMetrics(nodes: Node[], edges: Edge[]): ComputationResult {
  const treasureNodes = nodes.filter(node => node.type === 'treasure')
  const enemyNodes = nodes.filter(node => node.type === 'enemy')
  const choiceNodes = nodes.filter(node => node.type === 'choice')
  const startNodes = nodes.filter(node => node.type === 'start')
  const endNodes = nodes.filter(node => node.type === 'end')

  // Calculate treasure value
  const totalTreasureValue = treasureNodes.reduce((sum, node) => {
    const value = node.data?.properties?.value || 0
    const rarity = node.data?.properties?.rarity || 'common'
    const rarityMultiplier = getRarityMultiplier(rarity)
    return sum + (value * rarityMultiplier)
  }, 0)

  // Calculate enemy rewards
  const totalEnemyReward = enemyNodes.reduce((sum, node) => {
    const goldReward = node.data?.properties?.reward || 0
    const experience = node.data?.properties?.experience || 0
    return sum + goldReward + (experience * 0.1) // Convert XP to gold equivalent
  }, 0)

  // Calculate total experience
  const totalExperience = enemyNodes.reduce((sum, node) => {
    return sum + (node.data?.properties?.experience || 0)
  }, 0)

  // Calculate average difficulty
  const difficultyValues = startNodes.map(node => {
    const difficulty = node.data?.properties?.difficulty || 'Medium'
    return getDifficultyValue(difficulty)
  })
  const averageDifficulty = difficultyValues.length > 0 
    ? difficultyValues.reduce((sum, val) => sum + val, 0) / difficultyValues.length 
    : 2

  // Calculate path complexity
  const pathComplexity = calculatePathComplexity(nodes, edges)

  // Calculate risk-reward ratio
  const totalRisk = enemyNodes.reduce((sum, node) => {
    const health = node.data?.properties?.health || 0
    const attack = node.data?.properties?.attack || 0
    return sum + (health * attack) // Risk = enemy strength
  }, 0)
  const totalReward = totalTreasureValue + totalEnemyReward
  const riskRewardRatio = totalRisk > 0 ? totalReward / totalRisk : 0

  // Estimate play time (rough calculation)
  const estimatedPlayTime = Math.max(5, 
    (enemyNodes.length * 2) + // 2 minutes per enemy
    (choiceNodes.length * 1) + // 1 minute per choice
    (treasureNodes.length * 0.5) // 30 seconds per treasure
  )

  // Calculate total adventure score
  const totalAdventureScore = Math.round(
    (totalTreasureValue * 1.0) +
    (totalEnemyReward * 0.8) +
    (totalExperience * 0.5) +
    (pathComplexity * 10) +
    (averageDifficulty * 20) -
    (riskRewardRatio < 0.5 ? 50 : 0) // Penalty for poor risk-reward ratio
  )

  const metrics: FlowMetrics = {
    totalAdventureScore,
    totalTreasureValue,
    totalEnemyReward,
    totalExperience,
    averageDifficulty,
    pathComplexity,
    riskRewardRatio,
    estimatedPlayTime
  }

  const breakdown = {
    treasureCount: treasureNodes.length,
    enemyCount: enemyNodes.length,
    choiceCount: choiceNodes.length,
    pathCount: edges.length,
    maxDepth: calculateMaxDepth(nodes, edges)
  }

  const recommendations = generateRecommendations(metrics, breakdown)

  return { metrics, breakdown, recommendations }
}

function getRarityMultiplier(rarity: string): number {
  switch (rarity) {
    case 'common': return 1.0
    case 'rare': return 1.5
    case 'epic': return 2.0
    case 'legendary': return 3.0
    default: return 1.0
  }
}

function getDifficultyValue(difficulty: string): number {
  switch (difficulty) {
    case 'Easy': return 1
    case 'Medium': return 2
    case 'Hard': return 3
    default: return 2
  }
}

function calculatePathComplexity(nodes: Node[], edges: Edge[]): number {
  if (nodes.length === 0) return 0
  
  // Simple complexity based on branching
  const choiceNodes = nodes.filter(node => node.type === 'choice')
  const branchingFactor = choiceNodes.reduce((sum, node) => {
    const outgoingEdges = edges.filter(edge => edge.source === node.id)
    return sum + Math.max(0, outgoingEdges.length - 1) // Extra paths beyond the first
  }, 0)
  
  return Math.min(10, branchingFactor + (nodes.length / 10))
}

function calculateMaxDepth(nodes: Node[], edges: Edge[]): number {
  if (nodes.length === 0) return 0
  
  const startNodes = nodes.filter(node => node.type === 'start')
  if (startNodes.length === 0) return 0
  
  let maxDepth = 0
  
  function dfs(nodeId: string, depth: number, visited: Set<string>) {
    if (visited.has(nodeId)) return
    visited.add(nodeId)
    
    maxDepth = Math.max(maxDepth, depth)
    
    const outgoingEdges = edges.filter(edge => edge.source === nodeId)
    for (const edge of outgoingEdges) {
      dfs(edge.target, depth + 1, visited)
    }
  }
  
  for (const startNode of startNodes) {
    dfs(startNode.id, 0, new Set())
  }
  
  return maxDepth
}

function generateRecommendations(metrics: FlowMetrics, breakdown: ComputationResult['breakdown']): string[] {
  const recommendations: string[] = []
  
  if (breakdown.treasureCount === 0) {
    recommendations.push('Consider adding treasure blocks to reward players')
  }
  
  if (breakdown.enemyCount === 0) {
    recommendations.push('Add enemy encounters for challenge and progression')
  }
  
  if (breakdown.choiceCount === 0) {
    recommendations.push('Include choice blocks for player agency and branching')
  }
  
  if (metrics.riskRewardRatio < 0.5) {
    recommendations.push('Improve risk-reward balance - enemies are too strong for rewards')
  }
  
  if (metrics.riskRewardRatio > 2.0) {
    recommendations.push('Consider increasing enemy difficulty for better challenge')
  }
  
  if (breakdown.maxDepth < 3) {
    recommendations.push('Add more depth to create a richer adventure')
  }
  
  if (metrics.estimatedPlayTime < 10) {
    recommendations.push('Consider adding more content for a longer experience')
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Great flow! Well-balanced adventure with good progression')
  }
  
  return recommendations
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  } else {
    return num.toFixed(0)
  }
}

export function getScoreGrade(score: number): { grade: string; color: string } {
  if (score >= 200) return { grade: 'A+', color: 'text-green-600' }
  if (score >= 150) return { grade: 'A', color: 'text-green-500' }
  if (score >= 100) return { grade: 'B', color: 'text-blue-500' }
  if (score >= 50) return { grade: 'C', color: 'text-yellow-500' }
  if (score >= 0) return { grade: 'D', color: 'text-orange-500' }
  return { grade: 'F', color: 'text-red-500' }
}
