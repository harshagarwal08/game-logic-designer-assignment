import React from 'react'
import { Handle, Position } from 'reactflow'

export default function EnemyNode({ data }: { data: any }) {
  return (
    <div className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg min-w-[100px] text-center relative">
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-3 h-3 bg-white border-2 border-red-500"
        style={{ top: -6 }}
      />
      <div className="font-semibold">Enemy</div>
      <div className="text-xs opacity-80">{data?.label || 'Battle'}</div>
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-3 h-3 bg-white border-2 border-red-500"
        style={{ bottom: -6 }}
      />
    </div>
  )
}
