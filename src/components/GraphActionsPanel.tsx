interface GraphActionsPanelProps {
  onAddNode: () => void
  onClear: () => void
  onExport: () => void
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void
  nodeCount: number
  edgeCount: number
}

function GraphActionsPanel({
  onAddNode,
  onClear,
  onExport,
  onImport,
  nodeCount,
  edgeCount,
}: GraphActionsPanelProps) {
  return (
    <div className="space-y-3">
      <div className="text-sm text-gray-400">
        <div>Nodes: {nodeCount}</div>
        <div>Edges: {edgeCount}</div>
      </div>

      <div className="space-y-2">
        <button
          onClick={onAddNode}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors font-medium"
        >
          + Add Node
        </button>

        <button
          onClick={onExport}
          className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors font-medium"
        >
          Export Graph
        </button>

        <label className="block w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors font-medium text-center cursor-pointer">
          Import Graph
          <input
            type="file"
            accept=".json"
            onChange={onImport}
            className="hidden"
          />
        </label>

        <button
          onClick={onClear}
          className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors font-medium"
        >
          Clear Graph
        </button>
      </div>
    </div>
  )
}

export default GraphActionsPanel
