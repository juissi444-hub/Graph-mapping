import { useState, useEffect } from 'react'
import { Node } from '@xyflow/react'

interface NodeModalProps {
  isOpen: boolean
  onClose: () => void
  node: Node
  onSave: (nodeId: string, label: string, description: string) => void
}

function NodeModal({ isOpen, onClose, node, onSave }: NodeModalProps) {
  const [label, setLabel] = useState<string>(String(node.data.label || ''))
  const [description, setDescription] = useState<string>(String(node.data.description || ''))

  useEffect(() => {
    setLabel(String(node.data.label || ''))
    setDescription(String(node.data.description || ''))
  }, [node])

  const handleSave = () => {
    onSave(node.id, label, description)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700 shadow-2xl">
        <h2 className="text-2xl font-bold mb-4 text-white">Edit Node</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Label
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
              placeholder="Node label"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500 resize-none"
              placeholder="Add a description or explanation for this node..."
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default NodeModal
