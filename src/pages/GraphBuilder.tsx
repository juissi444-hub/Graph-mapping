import { useCallback, useState, useRef, useEffect } from 'react'
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  Connection,
  BackgroundVariant,
  Panel,
  MiniMap,
  MarkerType,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { ConnectionType } from '@/types'
import NodeModal from '@/components/NodeModal'
import EdgeTypeSelector from '@/components/EdgeTypeSelector'
import GraphActionsPanel from '@/components/GraphActionsPanel'
import CustomNode from '@/components/CustomNode'
import NodeContextMenu from '@/components/NodeContextMenu'
import IsomorphicGraphsModal from '@/components/IsomorphicGraphsModal'

const initialNodes: Node[] = []
const initialEdges: Edge[] = []

const nodeTypes = {
  default: CustomNode,
}

function GraphBuilder() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes)
  const [edges, setEdges] = useState<Edge[]>(initialEdges)
  const [selectedConnectionType, setSelectedConnectionType] = useState<ConnectionType>(
    ConnectionType.CONNECTION
  )
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [graphName, setGraphName] = useState('Untitled Graph')
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; node: Node } | null>(null)
  const [showIsomorphic, setShowIsomorphic] = useState(false)
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set())
  const nodeIdCounter = useRef(1)

  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeysPressed((prev) => new Set(prev).add(e.key.toLowerCase()))
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeysPressed((prev) => {
        const newSet = new Set(prev)
        newSet.delete(e.key.toLowerCase())
        return newSet
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  )

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  )

  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      let markerEnd

      switch (selectedConnectionType) {
        case ConnectionType.LINEAR:
          markerEnd = { type: MarkerType.ArrowClosed, color: '#10b981' }
          break
        case ConnectionType.CONNECTION:
          markerEnd = { type: MarkerType.Arrow, color: '#3b82f6' }
          break
        case ConnectionType.OPPOSITE:
          markerEnd = { type: MarkerType.Arrow, color: '#ef4444' }
          break
      }

      const newEdge: Edge = {
        ...connection,
        id: `e${connection.source}-${connection.target}-${Date.now()}`,
        type: 'default',
        className: selectedConnectionType,
        data: { connectionType: selectedConnectionType },
        animated: selectedConnectionType === ConnectionType.LINEAR,
        markerEnd,
      } as Edge

      setEdges((eds) => addEdge(newEdge, eds))
    },
    [selectedConnectionType]
  )

  const addNode = useCallback(() => {
    const newNode: Node = {
      id: `node-${nodeIdCounter.current++}`,
      type: 'default',
      position: {
        x: Math.random() * 500 + 100,
        y: Math.random() * 300 + 100,
      },
      data: {
        label: `Node ${nodeIdCounter.current - 1}`,
        description: '',
        color: '#3b82f6', // default blue
      },
    }
    setNodes((nds) => [...nds, newNode])
  }, [])

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    const isT = keysPressed.has('t')
    const isM = keysPressed.has('m')

    if (isT) {
      // Quick edit label
      const newLabel = prompt('Edit node label:', String(node.data.label))
      if (newLabel !== null) {
        setNodes((nds) =>
          nds.map((n) =>
            n.id === node.id
              ? { ...n, data: { ...n.data, label: newLabel } }
              : n
          )
        )
      }
    } else if (isM) {
      // Quick edit description
      const newDescription = prompt('Add description/meaning:', String(node.data.description || ''))
      if (newDescription !== null) {
        setNodes((nds) =>
          nds.map((n) =>
            n.id === node.id
              ? { ...n, data: { ...n.data, description: newDescription } }
              : n
          )
        )
      }
    } else {
      // Regular click - open modal
      setSelectedNode(node)
      setIsModalOpen(true)
    }
  }, [keysPressed])

  const onNodeContextMenu = useCallback((event: React.MouseEvent, node: Node) => {
    event.preventDefault()
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      node,
    })
  }, [])

  const updateNodeData = useCallback((
    nodeId: string,
    label: string,
    description: string,
    color?: string
  ) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                label,
                description,
                ...(color && { color })
              }
            }
          : node
      )
    )
  }, [])

  const clearGraph = useCallback(() => {
    setNodes([])
    setEdges([])
    nodeIdCounter.current = 1
  }, [])

  const exportGraph = useCallback(() => {
    const graphData = {
      name: graphName,
      nodes,
      edges,
      createdAt: new Date().toISOString(),
    }
    const dataStr = JSON.stringify(graphData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
    const exportFileDefaultName = `${graphName.replace(/\s+/g, '-').toLowerCase()}.json`

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }, [graphName, nodes, edges])

  const importGraph = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const graphData = JSON.parse(e.target?.result as string)
        setGraphName(graphData.name || 'Imported Graph')
        setNodes(graphData.nodes || [])
        setEdges(graphData.edges || [])

        // Update counter to avoid ID conflicts
        const maxId = Math.max(
          ...graphData.nodes.map((n: Node) => parseInt(n.id.split('-')[1]) || 0),
          0
        )
        nodeIdCounter.current = maxId + 1
      } catch (error) {
        alert('Error importing graph: Invalid file format')
      }
    }
    reader.readAsText(file)
  }, [])

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onNodeContextMenu={onNodeContextMenu}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gray-800"
      >
        <Background color="#4B5563" variant={BackgroundVariant.Dots} />
        <Controls className="bg-gray-700 border-gray-600" />
        <MiniMap
          className="bg-gray-700 border-gray-600"
          nodeColor={(node) => String(node.data.color || '#3b82f6')}
          maskColor="rgba(0, 0, 0, 0.5)"
        />

        <Panel position="top-left" className="bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-lg space-y-3">
          <input
            type="text"
            value={graphName}
            onChange={(e) => setGraphName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
            placeholder="Graph name"
          />

          <EdgeTypeSelector
            selected={selectedConnectionType}
            onChange={setSelectedConnectionType}
          />

          <GraphActionsPanel
            onAddNode={addNode}
            onClear={clearGraph}
            onExport={exportGraph}
            onImport={importGraph}
            nodeCount={nodes.length}
            edgeCount={edges.length}
          />

          <button
            onClick={() => setShowIsomorphic(true)}
            className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors font-medium"
          >
            Show Isomorphic Graphs
          </button>

          <div className="text-xs text-gray-400 space-y-1 border-t border-gray-700 pt-2">
            <div>💡 Press <kbd className="px-1 bg-gray-700 rounded">T</kbd> + click to quick edit label</div>
            <div>💡 Press <kbd className="px-1 bg-gray-700 rounded">M</kbd> + click to add meaning</div>
            <div>💡 Right-click node to view meaning</div>
          </div>
        </Panel>
      </ReactFlow>

      {selectedNode && (
        <NodeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          node={selectedNode}
          onSave={updateNodeData}
        />
      )}

      {contextMenu && (
        <NodeContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          node={contextMenu.node}
          onClose={() => setContextMenu(null)}
        />
      )}

      {showIsomorphic && (
        <IsomorphicGraphsModal
          isOpen={showIsomorphic}
          onClose={() => setShowIsomorphic(false)}
          currentNodes={nodes}
          currentEdges={edges}
        />
      )}
    </div>
  )
}

export default GraphBuilder
