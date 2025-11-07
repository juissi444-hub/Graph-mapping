import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'

function CustomNode({ data, selected }: NodeProps) {
  const nodeColor = String(data.color || '#3b82f6')

  return (
    <div
      className="px-4 py-2 rounded-lg border-2 shadow-lg min-w-[100px] text-center"
      style={{
        backgroundColor: nodeColor as string,
        borderColor: (selected ? '#fff' : nodeColor) as string,
        color: '#fff' as string,
        filter: (selected ? 'brightness(1.2)' : 'brightness(1)') as string,
      }}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <div className="font-medium">{String(data.label || '')}</div>
      {String(data.description || '') && (
        <div className="text-xs opacity-75 mt-1">📝</div>
      )}
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  )
}

export default memo(CustomNode)
