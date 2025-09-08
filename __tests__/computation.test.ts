import { computeFlowMetrics, formatNumber, getScoreGrade } from '../src/utils/computation'
import { Node, Edge } from 'reactflow'

describe('Computation Utilities', () => {
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

  describe('formatNumber', () => {
    test('should format numbers correctly', () => {
      expect(formatNumber(1000)).toBe('1.0K')
      expect(formatNumber(1500)).toBe('1.5K')
      expect(formatNumber(1000000)).toBe('1.0M')
      expect(formatNumber(500)).toBe('500')
      expect(formatNumber(0)).toBe('0')
    })
  })

  describe('getScoreGrade', () => {
    test('should return correct grades', () => {
      expect(getScoreGrade(250)).toEqual({ grade: 'A+', color: 'text-green-600' })
      expect(getScoreGrade(200)).toEqual({ grade: 'A+', color: 'text-green-600' })
      expect(getScoreGrade(175)).toEqual({ grade: 'A', color: 'text-green-500' })
      expect(getScoreGrade(125)).toEqual({ grade: 'B', color: 'text-blue-500' })
      expect(getScoreGrade(75)).toEqual({ grade: 'C', color: 'text-yellow-500' })
      expect(getScoreGrade(25)).toEqual({ grade: 'D', color: 'text-orange-500' })
      expect(getScoreGrade(-10)).toEqual({ grade: 'F', color: 'text-red-500' })
    })
  })

  describe('computeFlowMetrics', () => {
    test('should compute metrics for empty flow', () => {
      const result = computeFlowMetrics([], [])
      
      // Empty flow should have default difficulty penalty
      expect(result.metrics.totalAdventureScore).toBe(-10) // 2 * 20 - 50 = -10
      expect(result.metrics.totalTreasureValue).toBe(0)
      expect(result.metrics.totalEnemyReward).toBe(0)
      expect(result.breakdown.treasureCount).toBe(0)
      expect(result.breakdown.enemyCount).toBe(0)
    })

    test('should compute treasure value with rarity multipliers', () => {
      const nodes = [
        createNode('1', 'treasure', {
          properties: { value: 100, rarity: 'common' }
        }),
        createNode('2', 'treasure', {
          properties: { value: 100, rarity: 'rare' }
        }),
        createNode('3', 'treasure', {
          properties: { value: 100, rarity: 'legendary' }
        })
      ]

      const result = computeFlowMetrics(nodes, [])
      
      // common: 100 * 1.0 = 100
      // rare: 100 * 1.5 = 150  
      // legendary: 100 * 3.0 = 300
      expect(result.metrics.totalTreasureValue).toBe(550)
    })

    test('should compute enemy rewards', () => {
      const nodes = [
        createNode('1', 'enemy', {
          properties: { reward: 50, experience: 25 }
        }),
        createNode('2', 'enemy', {
          properties: { reward: 75, experience: 30 }
        })
      ]

      const result = computeFlowMetrics(nodes, [])
      
      // Enemy 1: 50 + (25 * 0.1) = 52.5
      // Enemy 2: 75 + (30 * 0.1) = 78
      expect(result.metrics.totalEnemyReward).toBe(130.5)
    })

    test('should compute total experience', () => {
      const nodes = [
        createNode('1', 'enemy', {
          properties: { experience: 25 }
        }),
        createNode('2', 'enemy', {
          properties: { experience: 30 }
        })
      ]

      const result = computeFlowMetrics(nodes, [])
      
      expect(result.metrics.totalExperience).toBe(55)
    })

    test('should compute path complexity', () => {
      const nodes = [
        createNode('1', 'choice'),
        createNode('2', 'end'),
        createNode('3', 'end'),
        createNode('4', 'end')
      ]
      const edges = [
        createEdge('1', '2'),
        createEdge('1', '3'),
        createEdge('1', '4')
      ]

      const result = computeFlowMetrics(nodes, edges)
      
      // Choice has 3 outputs, so branching factor = 2 (3-1)
      expect(result.metrics.pathComplexity).toBeGreaterThan(0)
    })

    test('should compute risk-reward ratio', () => {
      const nodes = [
        createNode('1', 'enemy', {
          properties: { health: 50, attack: 10, reward: 100, experience: 20 }
        }),
        createNode('2', 'treasure', {
          properties: { value: 200, rarity: 'common' }
        })
      ]

      const result = computeFlowMetrics(nodes, [])
      
      // Risk: 50 * 10 = 500
      // Reward: 100 + (20 * 0.1) + 200 = 302
      // Ratio: 302 / 500 = 0.604
      expect(result.metrics.riskRewardRatio).toBeCloseTo(0.604, 2)
    })

    test('should estimate play time', () => {
      const nodes = [
        createNode('1', 'enemy'),
        createNode('2', 'enemy'),
        createNode('3', 'choice'),
        createNode('4', 'treasure')
      ]

      const result = computeFlowMetrics(nodes, [])
      
      // 2 enemies * 2min + 1 choice * 1min + 1 treasure * 0.5min = 5.5min
      // Minimum is 5 minutes
      expect(result.metrics.estimatedPlayTime).toBeGreaterThanOrEqual(5)
    })

    test('should generate recommendations', () => {
      const nodes = [createNode('1', 'start')]
      const result = computeFlowMetrics(nodes, [])
      
      expect(result.recommendations).toContain('Consider adding treasure blocks to reward players')
      expect(result.recommendations).toContain('Add enemy encounters for challenge and progression')
      expect(result.recommendations).toContain('Include choice blocks for player agency and branching')
    })

    test('should calculate total adventure score', () => {
      const nodes = [
        createNode('1', 'start', {
          properties: { difficulty: 'medium' }
        }),
        createNode('2', 'treasure', {
          properties: { value: 100, rarity: 'common' }
        }),
        createNode('3', 'enemy', {
          properties: { reward: 50, experience: 25 }
        })
      ]
      const edges = [createEdge('1', '2'), createEdge('2', '3')]

      const result = computeFlowMetrics(nodes, edges)
      
      // Should have a positive score with treasure, enemy rewards, and complexity
      expect(result.metrics.totalAdventureScore).toBeGreaterThan(0)
    })
  })
})
