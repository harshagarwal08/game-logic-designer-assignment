import { Node, Edge } from 'reactflow'
import { validateFlow, ValidationError } from './validation'

export interface AISuggestion {
  id: string
  type: 'fix' | 'improve' | 'optimize' | 'design'
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
  action?: string
  category: 'validation' | 'balance' | 'narrative' | 'progression' | 'engagement'
}

export interface AISuggestionsResult {
  suggestions: AISuggestion[]
  summary: string
  overallScore: number
}

export function generateAISuggestions(nodes: Node[], edges: Edge[]): AISuggestionsResult {
  const suggestions: AISuggestion[] = []
  const validation = validateFlow(nodes, edges)
  
  // Generate suggestions based on validation errors
  suggestions.push(...generateValidationSuggestions(validation.errors, nodes, edges))
  
  // Generate suggestions based on flow analysis
  suggestions.push(...generateFlowAnalysisSuggestions(nodes, edges))
  
  // Generate suggestions based on game design principles
  suggestions.push(...generateGameDesignSuggestions(nodes, edges))
  
  // Generate suggestions based on balance and progression
  suggestions.push(...generateBalanceSuggestions(nodes, edges))
  
  // Sort suggestions by priority
  suggestions.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    return priorityOrder[b.priority] - priorityOrder[a.priority]
  })
  
  const overallScore = calculateOverallScore(nodes, edges, suggestions)
  const summary = generateSummary(suggestions, overallScore)
  
  return {
    suggestions: suggestions.slice(0, 10), // Limit to top 10 suggestions
    summary,
    overallScore
  }
}

function generateValidationSuggestions(errors: ValidationError[], nodes: Node[], edges: Edge[]): AISuggestion[] {
  const suggestions: AISuggestion[] = []
  
  errors.forEach(error => {
    if (error.type === 'error') {
      suggestions.push({
        id: `fix-${error.nodeId || 'general'}`,
        type: 'fix',
        priority: 'high',
        title: `Fix: ${error.message}`,
        description: getValidationFixDescription(error, nodes, edges),
        action: getValidationFixAction(error, nodes, edges),
        category: 'validation'
      })
    } else if (error.type === 'warning') {
      suggestions.push({
        id: `improve-${error.nodeId || 'general'}`,
        type: 'improve',
        priority: 'medium',
        title: `Improve: ${error.message}`,
        description: getValidationImprovementDescription(error, nodes, edges),
        action: getValidationImprovementAction(error, nodes, edges),
        category: 'validation'
      })
    }
  })
  
  return suggestions
}

function generateFlowAnalysisSuggestions(nodes: Node[], edges: Edge[]): AISuggestion[] {
  const suggestions: AISuggestion[] = []
  
  // Check for flow complexity
  const choiceNodes = nodes.filter(n => n.type === 'choice')
  const enemyNodes = nodes.filter(n => n.type === 'enemy')
  const treasureNodes = nodes.filter(n => n.type === 'treasure')
  
  // Suggest more choices for linear flows
  if (choiceNodes.length === 0 && nodes.length > 3) {
    suggestions.push({
      id: 'add-choices',
      type: 'improve',
      priority: 'medium',
      title: 'Add Player Choices',
      description: 'Your flow is linear. Adding choice blocks creates branching narratives and increases replayability.',
      action: 'Consider adding choice blocks to create decision points for players.',
      category: 'narrative'
    })
  }
  
  // Suggest treasure for enemies
  if (enemyNodes.length > 0 && treasureNodes.length === 0) {
    suggestions.push({
      id: 'add-treasures',
      type: 'improve',
      priority: 'high',
      title: 'Add Treasure Rewards',
      description: 'You have enemies but no treasures. Players need rewards for overcoming challenges.',
      action: 'Add treasure blocks connected to your enemy blocks to provide meaningful rewards.',
      category: 'progression'
    })
  }
  
  // Suggest more enemies for treasures
  if (treasureNodes.length > enemyNodes.length * 2) {
    suggestions.push({
      id: 'balance-rewards',
      type: 'optimize',
      priority: 'medium',
      title: 'Balance Rewards with Challenges',
      description: 'You have many treasures but few enemies. Consider adding more challenges to balance the rewards.',
      action: 'Add enemy blocks to create challenges that justify the treasure rewards.',
      category: 'balance'
    })
  }
  
  return suggestions
}

function generateGameDesignSuggestions(nodes: Node[], edges: Edge[]): AISuggestion[] {
  const suggestions: AISuggestion[] = []
  
  // Check for narrative flow
  const startNodes = nodes.filter(n => n.type === 'start')
  const endNodes = nodes.filter(n => n.type === 'end')
  
  if (startNodes.length === 1 && endNodes.length === 1) {
    suggestions.push({
      id: 'multiple-endings',
      type: 'design',
      priority: 'medium',
      title: 'Consider Multiple Endings',
      description: 'Having multiple endings based on player choices creates more engaging experiences.',
      action: 'Add additional end blocks with different outcomes based on player decisions.',
      category: 'engagement'
    })
  }
  
  // Check for difficulty progression
  const enemyNodes = nodes.filter(n => n.type === 'enemy')
  if (enemyNodes.length > 2) {
    const enemyStrengths = enemyNodes.map(node => 
      (node.data?.properties?.health || 50) + (node.data?.properties?.attack || 10)
    )
    
    const isProgressive = enemyStrengths.every((strength, index) => 
      index === 0 || strength >= enemyStrengths[index - 1]
    )
    
    if (!isProgressive) {
      suggestions.push({
        id: 'progressive-difficulty',
        type: 'optimize',
        priority: 'medium',
        title: 'Improve Difficulty Progression',
        description: 'Enemy difficulty should generally increase as players progress through the game.',
        action: 'Consider arranging enemies so that stronger enemies appear later in the flow.',
        category: 'balance'
      })
    }
  }
  
  return suggestions
}

function generateBalanceSuggestions(nodes: Node[], edges: Edge[]): AISuggestion[] {
  const suggestions: AISuggestion[] = []
  
  // Check treasure values
  const treasureNodes = nodes.filter(n => n.type === 'treasure')
  const treasureValues = treasureNodes.map(node => node.data?.properties?.value || 0)
  
  if (treasureValues.length > 0) {
    const maxValue = Math.max(...treasureValues)
    const minValue = Math.min(...treasureValues)
    
    if (maxValue > minValue * 10) {
      suggestions.push({
        id: 'balance-treasure-values',
        type: 'optimize',
        priority: 'medium',
        title: 'Balance Treasure Values',
        description: 'Your treasure values have a wide range. Consider more balanced reward distribution.',
        action: 'Adjust treasure values to create a more consistent reward curve.',
        category: 'balance'
      })
    }
  }
  
  // Check for risk-reward balance
  const enemyNodes = nodes.filter(n => n.type === 'enemy')
  const totalEnemyReward = enemyNodes.reduce((sum, node) => 
    sum + (node.data?.properties?.reward || 0) + (node.data?.properties?.experience || 0), 0
  )
  
  const totalTreasureValue = treasureNodes.reduce((sum, node) => 
    sum + (node.data?.properties?.value || 0), 0
  )
  
  if (totalEnemyReward > 0 && totalTreasureValue > totalEnemyReward * 3) {
    suggestions.push({
      id: 'risk-reward-balance',
      type: 'optimize',
      priority: 'medium',
      title: 'Improve Risk-Reward Balance',
      description: 'Treasure values are much higher than enemy rewards. Consider balancing risk with reward.',
      action: 'Increase enemy rewards or decrease treasure values to create better risk-reward balance.',
      category: 'balance'
    })
  }
  
  return suggestions
}

function getValidationFixDescription(error: ValidationError, nodes: Node[], edges: Edge[]): string {
  switch (error.message) {
    case 'Flow must start with at least one Start block':
      return 'Every game flow needs a starting point. Add a Start block to begin your adventure.'
    case 'Flow must end with at least one End block':
      return 'Every game flow needs an ending. Add an End block to conclude your adventure.'
    default:
      if (error.message.includes('must have at least 2 outputs')) {
        return 'Choice blocks need multiple options for players to choose from. Connect at least 2 paths from this choice block.'
      }
      if (error.message.includes('must connect to at least one Treasure or End')) {
        return 'Enemy encounters should lead to rewards or story progression. Connect this enemy to a treasure or end block.'
      }
      return 'This validation error needs to be addressed to ensure your flow works correctly.'
  }
}

function getValidationFixAction(error: ValidationError, nodes: Node[], edges: Edge[]): string {
  switch (error.message) {
    case 'Flow must start with at least one Start block':
      return 'Drag a Start block from the palette to the canvas.'
    case 'Flow must end with at least one End block':
      return 'Drag an End block from the palette to the canvas.'
    default:
      if (error.message.includes('must have at least 2 outputs')) {
        return 'Connect this choice block to at least 2 other blocks using the connection handles.'
      }
      if (error.message.includes('must connect to at least one Treasure or End')) {
        return 'Connect this enemy block to a treasure block or end block using the connection handles.'
      }
      return 'Review the validation panel for specific guidance on fixing this issue.'
  }
}

function getValidationImprovementDescription(error: ValidationError, nodes: Node[], edges: Edge[]): string {
  if (error.message.includes('Multiple Start blocks')) {
    return 'Having multiple starting points can confuse players. Consider consolidating to a single start point.'
  }
  if (error.message.includes('not connected to the flow')) {
    return 'This block is isolated and won\'t be part of the player\'s journey. Connect it to the main flow.'
  }
  return 'This warning suggests an improvement to make your flow more robust.'
}

function getValidationImprovementAction(error: ValidationError, nodes: Node[], edges: Edge[]): string {
  if (error.message.includes('Multiple Start blocks')) {
    return 'Remove extra Start blocks or connect them to create multiple starting paths.'
  }
  if (error.message.includes('not connected to the flow')) {
    return 'Connect this block to other blocks in your flow using the connection handles.'
  }
  return 'Review the validation panel for specific guidance on improving this aspect.'
}

function calculateOverallScore(nodes: Node[], edges: Edge[], suggestions: AISuggestion[]): number {
  const validation = validateFlow(nodes, edges)
  const errorCount = validation.errors.filter(e => e.type === 'error').length
  const warningCount = validation.errors.filter(e => e.type === 'warning').length
  const highPrioritySuggestions = suggestions.filter(s => s.priority === 'high').length
  
  // Base score starts at 100
  let score = 100
  
  // Deduct points for errors and warnings
  score -= errorCount * 20
  score -= warningCount * 10
  score -= highPrioritySuggestions * 5
  
  // Ensure score doesn't go below 0
  return Math.max(0, score)
}

function generateSummary(suggestions: AISuggestion[], overallScore: number): string {
  const highPriorityCount = suggestions.filter(s => s.priority === 'high').length
  const mediumPriorityCount = suggestions.filter(s => s.priority === 'medium').length
  const lowPriorityCount = suggestions.filter(s => s.priority === 'low').length
  
  if (overallScore >= 80) {
    return `Your flow is in excellent shape! You have ${suggestions.length} suggestions for further improvement.`
  } else if (overallScore >= 60) {
    return `Your flow is good but has some areas for improvement. ${highPriorityCount} high-priority suggestions need attention.`
  } else if (overallScore >= 40) {
    return `Your flow needs some work. Focus on the ${highPriorityCount} high-priority suggestions first.`
  } else {
    return `Your flow requires significant improvements. Start with the ${highPriorityCount} high-priority suggestions.`
  }
}
