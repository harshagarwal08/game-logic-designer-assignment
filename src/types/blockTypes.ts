export interface BlockData {
  id: string
  type: 'start' | 'choice' | 'enemy' | 'treasure' | 'end'
  label: string
  properties: Record<string, any>
}

export interface StartBlockProperties {
  title: string
  description: string
  startingHealth: number
}

export interface ChoiceBlockProperties {
  question: string
  optionA: string
  optionB: string
  optionC?: string
}

export interface EnemyBlockProperties {
  name: string
  health: number
  attack: number
  reward: number
}

export interface TreasureBlockProperties {
  name: string
  value: number
  type: 'gold' | 'item' | 'experience'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export interface EndBlockProperties {
  title: string
  endingType: 'victory' | 'defeat' | 'neutral'
  message: string
}
