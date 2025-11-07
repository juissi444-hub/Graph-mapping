import { useCallback, useState, useRef } from 'react'
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
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { ConnectionType } from '@/types'
import NodeModal from '@/components/NodeModal'
import EdgeTypeSelector from '@/components/EdgeTypeSelector'
import GraphActionsPanel from '@/components/GraphActionsPanel'

const initialNodes: Node[] = []
const initialEdges: Edge[] = []

function GraphBuilder() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes)
  const [edges, setEdges] = useState<Edge[]>(initialEdges)
  const [selectedConnectionType, setSelectedConnectionType] = useState<ConnectionType>(
    ConnectionType.CONNECTION
  )
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [graphName, setGraphName] = useState('Untitled Graph')
  const nodeIdCounter = useRef(1)

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
      const newEdge: Edge = {
        ...connection,
        id: `e${connection.source}-${connection.target}-${Date.now()}`,
        type: 'default',
        className: selectedConnectionType,
        data: { connectionType: selectedConnectionType },
        animated: selectedConnectionType === ConnectionType.LINEAR,
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
      },
    }
    setNodes((nds) => [...nds, newNode])
  }, [])

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
    setIsModalOpen(true)
  }, [])

  const updateNodeData = useCallback((nodeId: string, label: string, description: string) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, label, description } }
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
        fitView
        className="bg-gray-800"
      >
        <Background color="#4B5563" variant={BackgroundVariant.Dots} />
        <Controls className="bg-gray-700 border-gray-600" />
        <MiniMap
          className="bg-gray-700 border-gray-600"
          nodeColor="#3b82f6"
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
    </div>
  )
}

export default GraphBuilder
