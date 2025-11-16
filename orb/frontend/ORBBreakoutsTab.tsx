import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
  'https://aihoazkzytaprtcpgfwx.supabase.co',
  'YOUR_SUPABASE_ANON_KEY' // Replace with your anon key
)

interface ORBAlert {
  id: number
  event_timestamp: number
  ticker: string
  chart_timeframe: string
  event_type: string
  direction: 'LONG' | 'SHORT'
  current_price: number
  orb_high: number
  orb_low: number
  orb_midpoint: number
  orb_size: number
  orb_size_percent: number
  breakout_distance: number
  breakout_distance_percent: number
  orb_duration_minutes: number
  session_start: string
  volume: number
  breakout_up_occurred: boolean
  breakout_down_occurred: boolean
  retest_up_confirmed: boolean
  retest_down_confirmed: boolean
  scanner_symbol_count: number
  created_at: string
}

type EventTypeFilter = 'all' | 'breakout' | 'retest'
type DirectionFilter = 'all' | 'LONG' | 'SHORT'

export default function ORBBreakoutsTab() {
  const [alerts, setAlerts] = useState<ORBAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTicker, setSearchTicker] = useState('')
  const [directionFilter, setDirectionFilter] = useState<DirectionFilter>('all')
  const [eventTypeFilter, setEventTypeFilter] = useState<EventTypeFilter>('all')
  const [timeframeFilter, setTimeframeFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'grouped' | 'all'>('all')

  // Fetch initial data
  useEffect(() => {
    fetchAlerts()
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('orb-alerts-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orb_alerts'
        },
        (payload) => {
          console.log('New ORB alert:', payload.new)
          setAlerts(prev => [payload.new as ORBAlert, ...prev])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchAlerts = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('orb_alerts')
        .select('*')
        .order('event_timestamp', { ascending: false })
        .limit(100)

      if (error) throw error
      setAlerts(data || [])
    } catch (error) {
      console.error('Error fetching ORB alerts:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter alerts
  const filteredAlerts = alerts.filter(alert => {
    // Search by ticker
    if (searchTicker && !alert.ticker.toLowerCase().includes(searchTicker.toLowerCase())) {
      return false
    }

    // Filter by direction
    if (directionFilter !== 'all' && alert.direction !== directionFilter) {
      return false
    }

    // Filter by event type
    if (eventTypeFilter === 'breakout' && !alert.event_type.includes('breakout')) {
      return false
    }
    if (eventTypeFilter === 'retest' && !alert.event_type.includes('retest')) {
      return false
    }

    // Filter by timeframe
    if (timeframeFilter !== 'all' && alert.chart_timeframe !== timeframeFilter) {
      return false
    }

    return true
  })

  // Get unique timeframes for filter
  const uniqueTimeframes = Array.from(new Set(alerts.map(a => a.chart_timeframe)))

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    })
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getEventTypeDisplay = (eventType: string) => {
    const typeMap: Record<string, string> = {
      'orb_breakout_up': 'Breakout Up',
      'orb_breakout_down': 'Breakout Down',
      'orb_retest_up_confirmed': 'Retest Up ✓',
      'orb_retest_down_confirmed': 'Retest Down ✓'
    }
    return typeMap[eventType] || eventType
  }

  const getEventTypeBadgeColor = (eventType: string) => {
    if (eventType.includes('breakout_up')) return 'bg-blue-500/20 text-blue-400'
    if (eventType.includes('breakout_down')) return 'bg-orange-500/20 text-orange-400'
    if (eventType.includes('retest_up')) return 'bg-green-500/20 text-green-400'
    if (eventType.includes('retest_down')) return 'bg-red-500/20 text-red-400'
    return 'bg-gray-500/20 text-gray-400'
  }

  return (
    <div className="orb-breakouts-tab">
      {/* Search and Filters */}
      <div className="controls-section mb-6">
        <input
          type="text"
          placeholder="Search by ticker..."
          value={searchTicker}
          onChange={(e) => setSearchTicker(e.target.value)}
          className="search-input w-full px-4 py-2 bg-gray-800 text-white rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />

        <div className="filters flex gap-3 mb-4">
          {/* Direction Filter */}
          <select
            value={directionFilter}
            onChange={(e) => setDirectionFilter(e.target.value as DirectionFilter)}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="all">All Directions</option>
            <option value="LONG">LONG</option>
            <option value="SHORT">SHORT</option>
          </select>

          {/* Event Type Filter */}
          <select
            value={eventTypeFilter}
            onChange={(e) => setEventTypeFilter(e.target.value as EventTypeFilter)}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="all">All Event Types</option>
            <option value="breakout">Breakouts Only</option>
            <option value="retest">Retests Only</option>
          </select>

          {/* Timeframe Filter */}
          <select
            value={timeframeFilter}
            onChange={(e) => setTimeframeFilter(e.target.value)}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="all">All Timeframes</option>
            {uniqueTimeframes.map(tf => (
              <option key={tf} value={tf}>{tf}</option>
            ))}
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="view-toggle flex gap-2">
          <button
            onClick={() => setViewMode('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'all'
                ? 'bg-yellow-500 text-black'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            All Events
          </button>
          <button
            onClick={() => setViewMode('grouped')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'grouped'
                ? 'bg-yellow-500 text-black'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Grouped View
          </button>
        </div>
      </div>

      {/* Alerts Table */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">
          Loading ORB alerts...
        </div>
      ) : filteredAlerts.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          No ORB breakouts found. Waiting for market activity...
        </div>
      ) : (
        <div className="alerts-table">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 text-sm border-b border-gray-700">
                <th className="pb-3 font-medium">TICKER / TIMEFRAME</th>
                <th className="pb-3 font-medium">DIRECTION</th>
                <th className="pb-3 font-medium">EVENT TYPE</th>
                <th className="pb-3 font-medium">ORB RANGE</th>
                <th className="pb-3 font-medium">BREAKOUT STATS</th>
                <th className="pb-3 font-medium">LAST UPDATED</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.map((alert) => (
                <tr
                  key={alert.id}
                  className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                >
                  {/* Ticker / Timeframe */}
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{alert.ticker}</span>
                      <span className="text-gray-400 text-sm">({alert.chart_timeframe})</span>
                    </div>
                  </td>

                  {/* Direction */}
                  <td className="py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        alert.direction === 'LONG'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {alert.direction}
                    </span>
                  </td>

                  {/* Event Type */}
                  <td className="py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getEventTypeBadgeColor(
                        alert.event_type
                      )}`}
                    >
                      {getEventTypeDisplay(alert.event_type)}
                    </span>
                  </td>

                  {/* ORB Range */}
                  <td className="py-4 text-sm">
                    <div className="space-y-1">
                      <div className="text-gray-300">
                        <span className="text-green-400">H:</span> ${alert.orb_high.toFixed(2)}
                      </div>
                      <div className="text-gray-300">
                        <span className="text-red-400">L:</span> ${alert.orb_low.toFixed(2)}
                      </div>
                      <div className="text-gray-400 text-xs">
                        Size: ${alert.orb_size.toFixed(2)} ({alert.orb_size_percent?.toFixed(2)}%)
                      </div>
                    </div>
                  </td>

                  {/* Breakout Stats */}
                  <td className="py-4 text-sm">
                    <div className="space-y-1">
                      <div className="text-gray-300">
                        Price: <span className="text-white">${alert.current_price.toFixed(2)}</span>
                      </div>
                      <div className="text-gray-300">
                        Distance: {alert.breakout_distance_percent?.toFixed(1)}%
                      </div>
                      {alert.retest_up_confirmed || alert.retest_down_confirmed ? (
                        <div className="text-yellow-400 text-xs font-semibold">
                          ✓ Retest Confirmed
                        </div>
                      ) : null}
                    </div>
                  </td>

                  {/* Last Updated */}
                  <td className="py-4 text-sm text-gray-300">
                    <div>{formatTime(alert.event_timestamp)}</div>
                    <div className="text-gray-500 text-xs">{formatDate(alert.event_timestamp)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Alert Count */}
      <div className="mt-4 text-sm text-gray-400">
        Showing {filteredAlerts.length} of {alerts.length} ORB alerts
      </div>
    </div>
  )
}



