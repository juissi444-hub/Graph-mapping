import { ConnectionType } from '@/types'

interface EdgeTypeSelectorProps {
  selected: ConnectionType
  onChange: (type: ConnectionType) => void
}

function EdgeTypeSelector({ selected, onChange }: EdgeTypeSelectorProps) {
  const connectionTypes = [
    { type: ConnectionType.OPPOSITE, label: 'Opposite', color: 'bg-red-500' },
    { type: ConnectionType.CONNECTION, label: 'Connection', color: 'bg-blue-500' },
    { type: ConnectionType.LINEAR, label: 'Linear', color: 'bg-green-500' },
  ]

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Connection Type
      </label>
      <div className="space-y-2">
        {connectionTypes.map(({ type, label, color }) => (
          <button
            key={type}
            onClick={() => onChange(type)}
            className={`w-full px-4 py-2 rounded flex items-center space-x-3 transition-all ${
              selected === type
                ? 'bg-gray-600 border-2 border-white'
                : 'bg-gray-700 border-2 border-transparent hover:bg-gray-600'
            }`}
          >
            <div className={`w-4 h-4 rounded-full ${color}`} />
            <span className="text-white font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default EdgeTypeSelector
