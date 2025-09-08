import { validateFlow } from '../src/utils/validation'
import { Node, Edge } from 'reactflow'

describe('Flow Validation', () => {
  const createNode = (id: string, type: string, data: any = {}): Node => ({
    id,
    type,
    position: { x: 0, y: 0 },
    data: { label: `${type} block`, ...data }
  })

  const createEdge = (source: string, target: string): Edge => ({
    id: `${source}-${target}`,
    source,
    target,
    type: 'smoothstep'
  })

  describe('Start Block Validation', () => {
    test('should pass with exactly one start block and one end block', () => {
      const nodes = [
        createNode('1', 'start'),
        createNode('2', 'end')
      ]
      const edges: Edge[] = []
      const result = validateFlow(nodes, edges)
      
      const startErrors = result.errors.filter(r => r.message.includes('Start'))
      expect(startErrors).toHaveLength(0)
      expect(result.isValid).toBe(true)
    })

    test('should fail with no start blocks', () => {
      const nodes = [createNode('1', 'end')]
      const edges: Edge[] = []
      const result = validateFlow(nodes, edges)
      
      const startErrors = result.errors.filter(r => r.message.includes('Start'))
      expect(startErrors).toHaveLength(1)
      expect(startErrors[0].type).toBe('error')
      expect(result.isValid).toBe(false)
    })

    test('should warn with multiple start blocks', () => {
      const nodes = [
        createNode('1', 'start'),
        createNode('2', 'start'),
        createNode('3', 'end')
      ]
      const edges: Edge[] = []
      const result = validateFlow(nodes, edges)
      
      const startWarnings = result.errors.filter(r => r.message.includes('Multiple Start'))
      expect(startWarnings).toHaveLength(1)
      expect(startWarnings[0].type).toBe('warning')
    })
  })

  describe('End Block Validation', () => {
    test('should pass with at least one end block', () => {
      const nodes = [
        createNode('1', 'start'),
        createNode('2', 'end')
      ]
      const edges: Edge[] = []
      const result = validateFlow(nodes, edges)
      
      const endErrors = result.errors.filter(r => r.message.includes('End'))
      expect(endErrors).toHaveLength(0)
    })

    test('should fail with no end blocks', () => {
      const nodes = [createNode('1', 'start')]
      const edges: Edge[] = []
      const result = validateFlow(nodes, edges)
      
      const endErrors = result.errors.filter(r => r.message.includes('End'))
      expect(endErrors).toHaveLength(1)
      expect(endErrors[0].type).toBe('error')
    })
  })

  describe('Choice Block Validation', () => {
    test('should pass with choice block having 2+ outputs', () => {
      const nodes = [
        createNode('1', 'choice'),
        createNode('2', 'end'),
        createNode('3', 'end')
      ]
      const edges = [
        createEdge('1', '2'),
        createEdge('1', '3')
      ]
      const result = validateFlow(nodes, edges)
      
      const choiceErrors = result.errors.filter(r => r.message.includes('Choice'))
      expect(choiceErrors).toHaveLength(0)
    })

    test('should fail with choice block having less than 2 outputs', () => {
      const nodes = [
        createNode('1', 'choice'),
        createNode('2', 'end')
      ]
      const edges = [createEdge('1', '2')]
      const result = validateFlow(nodes, edges)
      
      const choiceErrors = result.errors.filter(r => r.message.includes('Choice'))
      expect(choiceErrors).toHaveLength(1)
      expect(choiceErrors[0].type).toBe('error')
    })
  })

  describe('Enemy Block Validation', () => {
    test('should pass with enemy connected to treasure', () => {
      const nodes = [
        createNode('1', 'enemy'),
        createNode('2', 'treasure')
      ]
      const edges = [createEdge('1', '2')]
      const result = validateFlow(nodes, edges)
      
      const enemyErrors = result.errors.filter(r => r.message.includes('Enemy'))
      expect(enemyErrors).toHaveLength(0)
    })

    test('should pass with enemy connected to end', () => {
      const nodes = [
        createNode('1', 'enemy'),
        createNode('2', 'end')
      ]
      const edges = [createEdge('1', '2')]
      const result = validateFlow(nodes, edges)
      
      const enemyErrors = result.errors.filter(r => r.message.includes('Enemy'))
      expect(enemyErrors).toHaveLength(0)
    })

    test('should fail with enemy not connected to treasure or end', () => {
      const nodes = [
        createNode('1', 'enemy'),
        createNode('2', 'choice')
      ]
      const edges = [createEdge('1', '2')]
      const result = validateFlow(nodes, edges)
      
      const enemyErrors = result.errors.filter(r => r.message.includes('Enemy'))
      expect(enemyErrors).toHaveLength(1)
      expect(enemyErrors[0].type).toBe('error')
    })
  })

  describe('Complex Flow Validation', () => {
    test('should pass with complete valid flow', () => {
      const nodes = [
        createNode('1', 'start'),
        createNode('2', 'choice'),
        createNode('3', 'enemy'),
        createNode('4', 'treasure'),
        createNode('5', 'end')
      ]
      const edges = [
        createEdge('1', '2'),
        createEdge('2', '3'),
        createEdge('2', '4'),
        createEdge('3', '5'),
        createEdge('4', '5')
      ]
      const result = validateFlow(nodes, edges)
      
      const errors = result.errors.filter(r => r.type === 'error')
      expect(errors).toHaveLength(0)
      expect(result.isValid).toBe(true)
    })

    test('should detect orphaned nodes', () => {
      const nodes = [
        createNode('1', 'start'),
        createNode('2', 'end'),
        createNode('3', 'treasure') // orphaned
      ]
      const edges = [createEdge('1', '2')]
      const result = validateFlow(nodes, edges)
      
      const orphanWarnings = result.errors.filter(r => r.message.includes('not connected to the flow'))
      expect(orphanWarnings).toHaveLength(1)
      expect(orphanWarnings[0].type).toBe('warning')
    })
  })
})
