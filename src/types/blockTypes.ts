export interface BlockData {
  id: string
  type: 'start' | 'choice' | 'enemy' | 'treasure' | 'end'
  label: string
  properties: Record<string, any>
}

// Game Flow Designer Block Properties

export interface StartBlockProperties {
  title: string
  description: string
  startingHealth: number
  startingGold: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
}

export interface ChoiceBlockProperties {
  question: string
  optionA: string
  optionB: string
  optionC?: string
  consequenceA: string
  consequenceB: string
  consequenceC?: string
}

export interface EnemyBlockProperties {
  name: string
  health: number
  attack: number
  defense: number
  reward: number
  experience: number
  specialAbility?: string
}

export interface TreasureBlockProperties {
  name: string
  value: number
  type: 'gold' | 'item' | 'experience' | 'weapon' | 'armor'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  description: string
  effect?: string
}

export interface EndBlockProperties {
  title: string
  endingType: 'victory' | 'defeat' | 'neutral'
  message: string
  finalScore: number
  unlockCondition?: string
}
