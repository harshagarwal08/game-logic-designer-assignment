import React from 'react'
import { Handle, Position } from 'reactflow'

export default function EndNode({ data }: { data: any }) {
  const title = data?.properties?.title || data?.label || 'Game Over'
  const endingType = data?.properties?.endingType || 'neutral'
  const finalScore = data?.properties?.finalScore || 0
  
  const getEndingColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'success': return 'bg-green-600'
      case 'failure': return 'bg-red-600'
      case 'neutral': return 'bg-gray-600'
      default: return 'bg-gray-600'
    }
  }
  
  return (
    <div className="bg-purple-500 text-white px-4 py-3 rounded-lg shadow-lg min-w-[120px] text-center relative">
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-3 h-3 bg-white border-2 border-purple-500"
        style={{ top: -6 }}
      />
      <div className="font-semibold text-sm">{title}</div>
      <div className="text-xs opacity-80 mt-1 space-y-1">
        <div className={`${getEndingColor(endingType)} rounded px-2 py-1 text-xs font-medium`}>
          {endingType.toUpperCase()}
        </div>
        <div>🏆 {finalScore} pts</div>
      </div>
    </div>
  )
}
