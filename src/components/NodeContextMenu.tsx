import { useEffect } from 'react'
import { Node } from '@xyflow/react'

interface NodeContextMenuProps {
  x: number
  y: number
  node: Node
  onClose: () => void
}

function NodeContextMenu({ x, y, node, onClose }: NodeContextMenuProps) {
  useEffect(() => {
    const handleClick = () => onClose()
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [onClose])

  const showMeaning = () => {
    const description = String(node.data.description || 'No meaning/description added yet.')
    const label = String(node.data.label || 'Node')
    alert(`Meaning of "${label}":\n\n${description}`)
    onClose()
  }

  return (
    <div
      className="fixed bg-gray-800 border border-gray-600 rounded-lg shadow-2xl z-50 min-w-[200px]"
      style={{ left: x, top: y }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-2">
        <div className="px-3 py-2 text-sm text-gray-400 border-b border-gray-700">
          {String(node.data.label || 'Node')}
        </div>
        <button
          onClick={showMeaning}
          className="w-full px-3 py-2 text-left text-white hover:bg-gray-700 rounded transition-colors text-sm flex items-center space-x-2"
        >
          <span>📖</span>
          <span>View Meaning</span>
        </button>
      </div>
    </div>
  )
}

export default NodeContextMenu
