import { 
  exportFlowToJSON, 
  importFlowFromJSON, 
  saveToLocalStorage, 
  loadFromLocalStorage, 
  clearLocalStorage 
} from '../src/utils/persistence'
import { Node, Edge } from 'reactflow'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('Persistence Utilities', () => {
  const mockNodes: Node[] = [
    {
      id: '1',
      type: 'start',
      position: { x: 0, y: 0 },
      data: { label: 'Start', properties: { title: 'Adventure Begins' } }
    },
    {
      id: '2',
      type: 'end',
      position: { x: 100, y: 100 },
      data: { label: 'End', properties: { title: 'The End' } }
    }
  ]

  const mockEdges: Edge[] = [
    {
      id: '1-2',
      source: '1',
      target: '2',
      type: 'smoothstep'
    }
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('JSON Operations', () => {
    test('should export flow as JSON', () => {
      const jsonString = exportFlowToJSON(mockNodes, mockEdges, 'Test Flow')
      
      expect(jsonString).toBeDefined()
      expect(typeof jsonString).toBe('string')
      
      const parsed = JSON.parse(jsonString)
      expect(parsed.nodes).toEqual(mockNodes)
      expect(parsed.edges).toEqual(mockEdges)
      expect(parsed.metadata.name).toBe('Test Flow')
    })

    test('should import flow from JSON', () => {
      const jsonString = exportFlowToJSON(mockNodes, mockEdges)

      const result = importFlowFromJSON(jsonString)

      expect(result).toBeDefined()
      expect(result?.nodes).toEqual(mockNodes)
      expect(result?.edges).toEqual(mockEdges)
    })

    test('should handle invalid JSON gracefully', () => {
      const invalidJson = 'invalid json string'

      expect(() => importFlowFromJSON(invalidJson)).toThrow('Failed to parse JSON')
    })

    test('should handle JSON without required fields', () => {
      const incompleteJson = JSON.stringify({ nodes: mockNodes }) // missing edges

      expect(() => importFlowFromJSON(incompleteJson)).toThrow('Invalid flow data structure')
    })
  })

  describe('LocalStorage Operations', () => {
    test('should save flow to localStorage', () => {
      localStorageMock.getItem.mockReturnValue(null)

      saveToLocalStorage(mockNodes, mockEdges)

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'game-flow-designer-data',
        expect.stringContaining('"nodes"')
      )
    })

    test('should load flow from localStorage', () => {
      const savedData = exportFlowToJSON(mockNodes, mockEdges)
      localStorageMock.getItem.mockReturnValue(savedData)

      const result = loadFromLocalStorage()

      expect(result).toBeDefined()
      expect(result?.nodes).toEqual(mockNodes)
      expect(result?.edges).toEqual(mockEdges)
      expect(localStorageMock.getItem).toHaveBeenCalledWith('game-flow-designer-data')
    })

    test('should return null when no saved data exists', () => {
      localStorageMock.getItem.mockReturnValue(null)

      const result = loadFromLocalStorage()

      expect(result).toBeNull()
    })

    test('should clear localStorage', () => {
      clearLocalStorage()

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('game-flow-designer-data')
    })

    test('should handle corrupted localStorage data', () => {
      localStorageMock.getItem.mockReturnValue('corrupted data')

      const result = loadFromLocalStorage()

      expect(result).toBeNull()
    })
  })

  describe('Data Integrity', () => {
    test('should preserve all node properties', () => {
      const complexNode: Node = {
        id: 'complex',
        type: 'treasure',
        position: { x: 50, y: 50 },
        data: {
          label: 'Complex Treasure',
          properties: {
            name: 'Magic Sword',
            value: 1000,
            rarity: 'legendary',
            description: 'A powerful weapon'
          }
        }
      }

      const jsonString = exportFlowToJSON([complexNode], [])
      const result = importFlowFromJSON(jsonString)

      expect(result?.nodes[0]).toEqual(complexNode)
    })

    test('should preserve all edge properties', () => {
      const complexEdge: Edge = {
        id: 'complex-edge',
        source: '1',
        target: '2',
        type: 'smoothstep',
        label: 'Custom Label',
        style: { stroke: 'red' }
      }

      const jsonString = exportFlowToJSON(mockNodes, [complexEdge])
      const result = importFlowFromJSON(jsonString)

      expect(result?.edges[0]).toEqual(complexEdge)
    })
  })
})
