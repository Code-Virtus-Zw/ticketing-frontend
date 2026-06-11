import { useState, useEffect } from 'react'
import { api } from '../api/client'

export default function Verifications() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  function load() {
    setLoading(true)
    api.listBookings({ search, status: 'used', page, perPage: 30 })
      .then((data) => {
        setItems(data.items?.filter(b => b.status === 'used') || [])
        setTotalPages(data.pagination?.total_page || 1)
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [page])

  return (
    <div>
      <div className="page-header">
        <h2>Verifications</h2>
        <p>Audit log of ticket verifications and check-ins</p>
      </div>

      <div className="search-bar">
        <input
          placeholder="Search by ticket code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && load()}
        />
        <button className="btn btn-primary" onClick={load}>Search</button>
      </div>

      {loading ? (
        <div className="loading">Loading verifications...</div>
      ) : items.length === 0 ? (
        <div className="card"><p>No verifications found.</p></div>
      ) : (
        <>
          <div className="card">
            <table>
              <thead>
                <tr>
                  <th>Ticket Code</th>
                  <th>Event</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Checked In At</th>
                </tr>
              </thead>
              <tbody>
                {items.map((v) => (
                  <tr key={v.id}>
                    <td style={{ fontFamily: 'monospace' }}>{v.ticket_code}</td>
                    <td>{v.event_title || '-'}</td>
                    <td>{v.customer_name || '-'}</td>
                    <td><span className="status-badge status-used">used</span></td>
                    <td>{v.checkin_at || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="pagination">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Prev</button>
              <span style={{ padding: '6px 12px' }}>Page {page} of {totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
