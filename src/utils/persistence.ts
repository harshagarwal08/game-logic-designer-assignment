import { Node, Edge } from 'reactflow'

export interface FlowData {
  nodes: Node[]
  edges: Edge[]
  metadata?: {
    version: string
    createdAt: string
    lastModified: string
    name?: string
  }
}

const STORAGE_KEY = 'game-flow-designer-data'
const VERSION = '1.0.0'

export function exportFlowToJSON(nodes: Node[], edges: Edge[], name?: string): string {
  const flowData: FlowData = {
    nodes,
    edges,
    metadata: {
      version: VERSION,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      name: name || 'Untitled Flow'
    }
  }
  
  return JSON.stringify(flowData, null, 2)
}

export function importFlowFromJSON(jsonString: string): FlowData {
  try {
    const flowData: FlowData = JSON.parse(jsonString)
    
    // Validate the structure
    if (!flowData.nodes || !flowData.edges) {
      throw new Error('Invalid flow data structure')
    }
    
    if (!Array.isArray(flowData.nodes) || !Array.isArray(flowData.edges)) {
      throw new Error('Nodes and edges must be arrays')
    }
    
    return flowData
  } catch (error) {
    throw new Error(`Failed to parse JSON: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export function saveToLocalStorage(nodes: Node[], edges: Edge[]): void {
  try {
    const flowData: FlowData = {
      nodes,
      edges,
      metadata: {
        version: VERSION,
        createdAt: getStoredFlowData()?.metadata?.createdAt || new Date().toISOString(),
        lastModified: new Date().toISOString(),
        name: getStoredFlowData()?.metadata?.name || 'Untitled Flow'
      }
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(flowData))
  } catch (error) {
    console.warn('Failed to save to localStorage:', error)
  }
}

export function loadFromLocalStorage(): FlowData | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    
    return JSON.parse(stored)
  } catch (error) {
    console.warn('Failed to load from localStorage:', error)
    return null
  }
}

export function getStoredFlowData(): FlowData | null {
  return loadFromLocalStorage()
}

export function clearLocalStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.warn('Failed to clear localStorage:', error)
  }
}

export function downloadJSON(jsonString: string, filename: string = 'game-flow.json'): void {
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

export function uploadJSON(): Promise<string> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (!file) {
        reject(new Error('No file selected'))
        return
      }
      
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        resolve(content)
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsText(file)
    }
    
    input.click()
  })
}
