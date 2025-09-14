import React from 'react'
import { Handle, Position } from 'reactflow'

export default function TreasureNode({ data }: { data: any }) {
  const name = data?.properties?.name || data?.label || 'Treasure'
  const value = data?.properties?.value || 100
  const rarity = data?.properties?.rarity || 'common'
  
  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 'bg-gray-400'
      case 'rare': return 'bg-blue-400'
      case 'epic': return 'bg-purple-400'
      case 'legendary': return 'bg-yellow-400'
      default: return 'bg-gray-400'
    }
  }
  
  return (
    <div className="bg-yellow-500 text-white px-4 py-3 rounded-lg shadow-lg min-w-[120px] text-center relative">
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-3 h-3 bg-white border-2 border-yellow-500"
        style={{ top: -6 }}
      />
      <div className="font-semibold text-sm">{name}</div>
      <div className="text-xs opacity-80 mt-1 space-y-1">
        <div>💰 {value}</div>
        <div className={`${getRarityColor(rarity)} rounded px-2 py-1 text-xs font-medium`}>
          {rarity.toUpperCase()}
        </div>
      </div>
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-3 h-3 bg-white border-2 border-yellow-500"
        style={{ bottom: -6 }}
      />
    </div>
  )
}
