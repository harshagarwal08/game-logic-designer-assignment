import React from 'react'
import { Handle, Position } from 'reactflow'

export default function EnemyNode({ data }: { data: any }) {
  const name = data?.properties?.name || data?.label || 'Enemy'
  const health = data?.properties?.health || 50
  const attack = data?.properties?.attack || 10
  
  return (
    <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg min-w-[120px] text-center relative">
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-3 h-3 bg-white border-2 border-red-500"
        style={{ top: -6 }}
      />
      <div className="font-semibold text-sm">{name}</div>
      <div className="text-xs opacity-80 mt-1 space-y-1">
        <div>❤️ {health} HP</div>
        <div>⚔️ {attack} ATK</div>
      </div>
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-3 h-3 bg-white border-2 border-red-500"
        style={{ bottom: -6 }}
      />
    </div>
  )
}
