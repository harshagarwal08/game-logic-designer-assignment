import React from 'react'
import { Handle, Position } from 'reactflow'

export default function StartNode({ data }: { data: any }) {
  const title = data?.properties?.title || data?.label || 'Game Start'
  const description = data?.properties?.description || 'Welcome to your adventure!'
  
  return (
    <div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg min-w-[120px] text-center relative">
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-3 h-3 bg-white border-2 border-green-500"
        style={{ bottom: -6 }}
      />
      <div className="font-semibold text-sm">{title}</div>
      <div className="text-xs opacity-80 mt-1 leading-tight">
        {description.length > 30 ? `${description.substring(0, 30)}...` : description}
      </div>
    </div>
  )
}
