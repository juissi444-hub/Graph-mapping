interface GraphActionsPanelProps {
  onAddNode: () => void
  onClear: () => void
  onExport: () => void
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void
  onSave: () => void
  nodeCount: number
  edgeCount: number
}

function GraphActionsPanel({
  onAddNode,
  onClear,
  onExport,
  onImport,
  onSave,
  nodeCount,
  edgeCount,
}: GraphActionsPanelProps) {
  return (
    <div className="space-y-3">
      <div className="text-sm bg-gradient-to-r from-blue-600 to-purple-600 bg-opacity-20 p-3 rounded-lg border border-blue-500 border-opacity-30">
        <div className="flex justify-between">
          <span className="text-gray-300">Nodes:</span>
          <span className="font-bold text-blue-400">{nodeCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">Edges:</span>
          <span className="font-bold text-purple-400">{edgeCount}</span>
        </div>
      </div>

      <div className="space-y-2">
        <button
          onClick={onAddNode}
          className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all transform hover:scale-105 font-medium shadow-lg"
        >
          ✨ Add Node
        </button>

        <button
          onClick={onSave}
          className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white rounded-lg transition-all transform hover:scale-105 font-medium shadow-lg"
        >
          💾 Save to Database
        </button>

        <button
          onClick={onExport}
          className="w-full px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg transition-all transform hover:scale-105 font-medium shadow-lg"
        >
          📥 Export JSON
        </button>

        <label className="block w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all transform hover:scale-105 font-medium text-center cursor-pointer shadow-lg">
          📤 Import JSON
          <input
            type="file"
            accept=".json"
            onChange={onImport}
            className="hidden"
          />
        </label>

        <button
          onClick={onClear}
          className="w-full px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-all transform hover:scale-105 font-medium shadow-lg"
        >
          🗑️ Clear Graph
        </button>
      </div>
    </div>
  )
}

export default GraphActionsPanel
