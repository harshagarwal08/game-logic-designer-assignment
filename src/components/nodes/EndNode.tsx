import React from 'react'
import { Handle, Position } from 'reactflow'

export default function EndNode({ data }: { data: any }) {
  return (
    <div className="bg-purple-500 text-white px-4 py-2 rounded-lg shadow-lg min-w-[100px] text-center">
      <Handle type="target" position={Position.Top} />
      <div className="font-semibold">End</div>
      <div className="text-xs opacity-80">{data?.label || 'Game Over'}</div>
    </div>
  )
}
