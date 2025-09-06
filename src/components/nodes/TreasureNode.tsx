import React from 'react'
import { Handle, Position } from 'reactflow'

export default function TreasureNode({ data }: { data: any }) {
  return (
    <div className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg min-w-[100px] text-center">
      <Handle type="target" position={Position.Top} />
      <div className="font-semibold">Treasure</div>
      <div className="text-xs opacity-80">{data?.label || 'Reward'}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}
