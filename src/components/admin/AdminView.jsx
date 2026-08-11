import { useState, useEffect } from 'react'
import { getAnalytics } from '../../services/firebase'
import { motion } from 'framer-motion'

export default function AdminView() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getAnalytics()
        setData(result)
      } catch (error) {
        console.error("Error fetching analytics:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="retro-outset-deep bg-retro-panelYellow p-8 text-center space-y-4 border-4">
        <h1 className="text-4xl font-black text-retro-black uppercase tracking-tight">
          ADMIN DASHBOARD
        </h1>
        <p className="text-lg font-bold text-retro-black">
          USER SEARCH ANALYTICS
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-bounce font-mono text-2xl">LOADING_STATS.EXE...</div>
        </div>
      ) : (
        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="retro-outset bg-retro-gray p-6 border-4">
              <div className="text-sm font-mono text-retro-muted mb-1 uppercase">Unique Users</div>
              <div className="text-6xl font-black text-retro-black">
                {data?.totalCount || 0}
              </div>
            </div>
            <div className="retro-outset bg-retro-gray p-6 border-4">
              <div className="text-sm font-mono text-retro-muted mb-1 uppercase">Total Searches</div>
              <div className="text-6xl font-black text-retro-black">
                {data?.searches.reduce((acc, s) => acc + (s.count || 0), 0) || 0}
              </div>
            </div>
          </div>

          <div className="retro-outset-deep bg-retro-white border-4 overflow-hidden">
            <div className="retro-titlebar px-3 py-2 flex justify-between items-center">
              <span className="font-bold text-white">RECENT_SEARCHES.LOG</span>
              <div className="flex gap-2">
                <div className="w-4 h-4 retro-outset bg-retro-yellow" />
                <div className="w-4 h-4 retro-outset bg-retro-red" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-sm">
                <thead className="bg-retro-gray border-b-2 border-retro-muted">
                  <tr>
                    <th className="px-4 py-2">USERNAME</th>
                    <th className="px-4 py-2">SEARCHES</th>
                    <th className="px-4 py-2">LAST SEEN</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.searches.map((search, i) => (
                    <tr key={i} className="border-b border-retro-muted/20 hover:bg-retro-panelYellow/10">
                      <td className="px-4 py-2 font-bold text-retro-blue">@{search.username}</td>
                      <td className="px-4 py-2">{search.count}</td>
                      <td className="px-4 py-2 text-retro-muted text-xs">
                        {search.timestamp?.toDate().toLocaleString() || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div className="text-center">
        <button 
          onClick={() => window.location.href = '/'}
          className="retro-button px-6 py-2 font-bold"
        >
          BACK TO HOME
        </button>
      </div>
    </div>
  )
}
