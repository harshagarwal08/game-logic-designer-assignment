import { Node, Edge } from 'reactflow'

export interface HistoryState {
  nodes: Node[]
  edges: Edge[]
  timestamp: number
}

export class HistoryManager {
  private history: HistoryState[] = []
  private currentIndex: number = -1
  private maxSteps: number = 20

  constructor(maxSteps: number = 20) {
    this.maxSteps = maxSteps
  }

  saveState(nodes: Node[], edges: Edge[]): void {
    const newState: HistoryState = {
      nodes: JSON.parse(JSON.stringify(nodes)), // Deep clone
      edges: JSON.parse(JSON.stringify(edges)), // Deep clone
      timestamp: Date.now()
    }

    // Remove any states after current index (when we're not at the end)
    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1)
    }

    // Add new state
    this.history.push(newState)

    // Limit history size
    if (this.history.length > this.maxSteps) {
      this.history.shift()
    } else {
      this.currentIndex++
    }
  }

  undo(): HistoryState | null {
    if (this.canUndo()) {
      this.currentIndex--
      return this.history[this.currentIndex]
    }
    return null
  }

  redo(): HistoryState | null {
    if (this.canRedo()) {
      this.currentIndex++
      return this.history[this.currentIndex]
    }
    return null
  }

  canUndo(): boolean {
    return this.currentIndex > 0
  }

  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1
  }

  getCurrentState(): HistoryState | null {
    if (this.currentIndex >= 0 && this.currentIndex < this.history.length) {
      return this.history[this.currentIndex]
    }
    return null
  }

  clear(): void {
    this.history = []
    this.currentIndex = -1
  }

  getHistoryInfo(): { current: number; total: number; canUndo: boolean; canRedo: boolean } {
    return {
      current: this.currentIndex + 1,
      total: this.history.length,
      canUndo: this.canUndo(),
      canRedo: this.canRedo()
    }
  }
}
