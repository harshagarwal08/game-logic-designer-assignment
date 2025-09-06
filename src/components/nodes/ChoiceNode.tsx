import React from 'react'
import { Handle, Position } from 'reactflow'

export default function ChoiceNode({ data }: { data: any }) {
  return (
    <div className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg min-w-[100px] text-center relative">
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-3 h-3 bg-white border-2 border-blue-500"
        style={{ top: -6 }}
      />
      <div className="font-semibold">Choice</div>
      <div className="text-xs opacity-80">{data?.label || 'Player Choice'}</div>
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="a" 
        className="w-3 h-3 bg-white border-2 border-blue-500"
        style={{ bottom: -6 }}
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        id="b" 
        className="w-3 h-3 bg-white border-2 border-blue-500"
        style={{ right: -6 }}
      />
    </div>
  )
}
