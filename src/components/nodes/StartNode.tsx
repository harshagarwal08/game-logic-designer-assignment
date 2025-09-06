import React from 'react'
import { Handle, Position } from 'reactflow'

export default function StartNode({ data }: { data: any }) {
  return (
    <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg min-w-[100px] text-center">
      <Handle type="source" position={Position.Bottom} />
      <div className="font-semibold">Start</div>
      <div className="text-xs opacity-80">{data?.label || 'Game Start'}</div>
    </div>
  )
}
