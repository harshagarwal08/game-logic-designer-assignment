import { Node, Edge } from 'reactflow'

export interface ValidationError {
  type: 'error' | 'warning'
  message: string
  nodeId?: string
  edgeId?: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

export function validateFlow(nodes: Node[], edges: Edge[]): ValidationResult {
  const errors: ValidationError[] = []

  // Rule 1: The flow must start with a Start block
  const startNodes = nodes.filter(node => node.type === 'start')
  if (startNodes.length === 0) {
    errors.push({
      type: 'error',
      message: 'Flow must start with at least one Start block'
    })
  } else if (startNodes.length > 1) {
    errors.push({
      type: 'warning',
      message: 'Multiple Start blocks detected. Consider having only one starting point.'
    })
  }

  // Rule 2: It must end with at least one End block
  const endNodes = nodes.filter(node => node.type === 'end')
  if (endNodes.length === 0) {
    errors.push({
      type: 'error',
      message: 'Flow must end with at least one End block'
    })
  }

  // Rule 3: Choice blocks must have 2 or more outputs
  const choiceNodes = nodes.filter(node => node.type === 'choice')
  choiceNodes.forEach(choiceNode => {
    const outgoingEdges = edges.filter(edge => edge.source === choiceNode.id)
    if (outgoingEdges.length < 2) {
      errors.push({
        type: 'error',
        message: `Choice block "${choiceNode.data?.label || choiceNode.id}" must have at least 2 outputs`,
        nodeId: choiceNode.id
      })
    }
  })

  // Rule 4: Custom rule - Enemy blocks must connect to at least one Treasure or End
  // This ensures that defeating enemies leads to meaningful rewards or conclusions
  const enemyNodes = nodes.filter(node => node.type === 'enemy')
  enemyNodes.forEach(enemyNode => {
    const outgoingEdges = edges.filter(edge => edge.source === enemyNode.id)
    const connectedNodes = outgoingEdges.map(edge => 
      nodes.find(node => node.id === edge.target)
    ).filter(Boolean) as Node[]
    
    const hasTreasureOrEnd = connectedNodes.some(node => 
      node.type === 'treasure' || node.type === 'end'
    )
    
    if (!hasTreasureOrEnd) {
      errors.push({
        type: 'error',
        message: `Enemy block "${enemyNode.data?.label || enemyNode.id}" must connect to at least one Treasure or End block`,
        nodeId: enemyNode.id
      })
    }
  })

  // Additional validation: Check for orphaned nodes (nodes with no connections)
  const connectedNodeIds = new Set([
    ...edges.map(edge => edge.source),
    ...edges.map(edge => edge.target)
  ])
  
  const orphanedNodes = nodes.filter(node => 
    !connectedNodeIds.has(node.id) && nodes.length > 1
  )
  
  orphanedNodes.forEach(node => {
    if (node.type !== 'start') { // Start nodes can be orphaned initially
      errors.push({
        type: 'warning',
        message: `Block "${node.data?.label || node.id}" is not connected to the flow`,
        nodeId: node.id
      })
    }
  })

  // Additional validation: Check for cycles (basic cycle detection)
  const hasCycle = detectCycle(nodes, edges)
  if (hasCycle) {
    errors.push({
      type: 'warning',
      message: 'Circular connections detected. This may cause infinite loops in gameplay.'
    })
  }

  return {
    isValid: errors.filter(error => error.type === 'error').length === 0,
    errors
  }
}

function detectCycle(nodes: Node[], edges: Edge[]): boolean {
  const visited = new Set<string>()
  const recursionStack = new Set<string>()

  function dfs(nodeId: string): boolean {
    if (recursionStack.has(nodeId)) {
      return true // Cycle detected
    }
    
    if (visited.has(nodeId)) {
      return false
    }

    visited.add(nodeId)
    recursionStack.add(nodeId)

    const outgoingEdges = edges.filter(edge => edge.source === nodeId)
    for (const edge of outgoingEdges) {
      if (dfs(edge.target)) {
        return true
      }
    }

    recursionStack.delete(nodeId)
    return false
  }

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (dfs(node.id)) {
        return true
      }
    }
  }

  return false
}

export function getValidationSummary(result: ValidationResult): string {
  if (result.isValid && result.errors.length === 0) {
    return '✅ Flow is valid!'
  }
  
  const errorCount = result.errors.filter(e => e.type === 'error').length
  const warningCount = result.errors.filter(e => e.type === 'warning').length
  
  if (errorCount > 0) {
    return `❌ ${errorCount} error${errorCount > 1 ? 's' : ''} found${warningCount > 0 ? `, ${warningCount} warning${warningCount > 1 ? 's' : ''}` : ''}`
  } else {
    return `⚠️ ${warningCount} warning${warningCount > 1 ? 's' : ''} found`
  }
}
