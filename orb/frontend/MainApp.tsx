import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import ORBBreakoutsTab from './ORBBreakoutsTab'

// Initialize Supabase
const supabase = createClient(
  'https://aihoazkzytaprtcpgfwx.supabase.co',
  'YOUR_SUPABASE_ANON_KEY'
)

type TabType = 'progression' | 'ote' | 'orb'

export default function MainApp() {
  const [activeTab, setActiveTab] = useState<TabType>('progression')
  const [progressionCount, setProgressionCount] = useState(100) // Your existing count
  const [oteCount, setOteCount] = useState(0) // Your existing count
  const [orbCount, setORBCount] = useState(0)

  // Fetch ORB alert count
  useEffect(() => {
    fetchORBCount()

    // Subscribe to real-time ORB count updates
    const channel = supabase
      .channel('orb-count-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orb_alerts'
        },
        () => {
          setORBCount(prev => prev + 1)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchORBCount = async () => {
    try {
      const { count, error } = await supabase
        .from('orb_alerts')
        .select('*', { count: 'exact', head: true })

      if (error) throw error
      setORBCount(count || 0)
    } catch (error) {
      console.error('Error fetching ORB count:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500 rounded flex items-center justify-center">
              <span className="text-2xl font-bold text-black">P</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Pattern Pulse</h1>
              <p className="text-sm text-gray-400">Advanced Trading Analytics</p>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-yellow-500 text-black rounded-lg font-semibold flex items-center gap-2">
              <span className="w-2 h-2 bg-black rounded-full animate-pulse"></span>
              Live
            </button>
            <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2">
              <span>🏆</span>
              Completions
            </button>
            <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2">
              <span>⚙️</span>
              Settings
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="border-b border-gray-800 px-6">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('progression')}
            className={`py-4 px-2 relative font-medium transition-colors ${
              activeTab === 'progression'
                ? 'text-white'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Progression Alerts ({progressionCount})
            {activeTab === 'progression' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500"></div>
            )}
          </button>

          <button
            onClick={() => setActiveTab('ote')}
            className={`py-4 px-2 relative font-medium transition-colors ${
              activeTab === 'ote'
                ? 'text-white'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            OTE Reversals ({oteCount})
            {activeTab === 'ote' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500"></div>
            )}
          </button>

          <button
            onClick={() => setActiveTab('orb')}
            className={`py-4 px-2 relative font-medium transition-colors ${
              activeTab === 'orb'
                ? 'text-white'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            ORB Breakouts ({orbCount})
            {activeTab === 'orb' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500"></div>
            )}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'progression' && (
          <div>
            {/* Your existing Progression Alerts component */}
            <h2>Progression Alerts Content</h2>
          </div>
        )}

        {activeTab === 'ote' && (
          <div>
            {/* Your existing OTE Reversals component */}
            <h2>OTE Reversals Content</h2>
          </div>
        )}

        {activeTab === 'orb' && <ORBBreakoutsTab />}
      </div>
    </div>
  )
}



