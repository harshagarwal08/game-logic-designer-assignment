import React from 'react'
import { Handle, Position } from 'reactflow'

export default function ChoiceNode({ data }: { data: any }) {
  const question = data?.properties?.question || data?.label || 'Player Choice'
  const optionA = data?.properties?.optionA || 'Option A'
  const optionB = data?.properties?.optionB || 'Option B'
  
  return (
    <div className="bg-blue-500 text-white px-4 py-3 rounded-lg shadow-lg min-w-[140px] text-center relative">
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-3 h-3 bg-white border-2 border-blue-500"
        style={{ top: -6 }}
      />
      <div className="font-semibold text-sm mb-2">Choice</div>
      <div className="text-xs opacity-90 mb-2 leading-tight">
        {question.length > 25 ? `${question.substring(0, 25)}...` : question}
      </div>
      <div className="text-xs opacity-80 space-y-1">
        <div className="bg-blue-600 rounded px-2 py-1">
          A: {optionA.length > 15 ? `${optionA.substring(0, 15)}...` : optionA}
        </div>
        <div className="bg-blue-600 rounded px-2 py-1">
          B: {optionB.length > 15 ? `${optionB.substring(0, 15)}...` : optionB}
        </div>
      </div>
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
