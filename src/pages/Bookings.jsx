import { useState, useEffect } from 'react'
import { api } from '../api/client'

export default function Bookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selected, setSelected] = useState(null)

  function loadBookings(reset = false) {
    if (reset) setPage(1)
    const p = reset ? 1 : page
    setLoading(true)
    api.listBookings({ search, status: statusFilter, page: p, perPage: 20 })
      .then((data) => {
        setBookings(data.items || [])
        setTotalPages(data.pagination?.total_page || 1)
      })
      .catch(() => setBookings([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadBookings(true) }, [])

  async function viewBooking(id) {
    try {
      const data = await api.getBooking(id)
      setSelected(data.booking)
    } catch (err) {
      alert(err.message)
    }
  }

  async function checkin(id) {
    if (!confirm('Check in this ticket?')) return
    try {
      const data = await api.checkinBooking(id)
      if (data.success) {
        alert(data.message || 'Checked in successfully.')
        loadBookings(true)
        setSelected(null)
      } else {
        alert(data.message || 'Check-in failed.')
      }
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>Bookings</h2>
        <p>View and manage ticket bookings</p>
      </div>

      <div className="search-bar">
        <input
          placeholder="Search by name, email, ticket code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && loadBookings(true)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="issued">Issued</option>
          <option value="used">Used</option>
          <option value="pending">Pending</option>
        </select>
        <button className="btn btn-primary" onClick={() => loadBookings(true)}>Filter</button>
      </div>

      {loading ? (
        <div className="loading">Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="card"><p>No bookings found.</p></div>
      ) : (
        <>
          <div className="card">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Event</th>
                  <th>Customer</th>
                  <th>Ticket Code</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td>{b.id}</td>
                    <td>{b.event_title || '-'}</td>
                    <td>{b.customer_name || '-'}</td>
                    <td style={{ fontFamily: 'monospace' }}>{b.ticket_code}</td>
                    <td><span className={`status-badge status-${b.status}`}>{b.status}</span></td>
                    <td>
                      <button className="btn btn-outline" onClick={() => viewBooking(b.id)}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="pagination">
              <button disabled={page <= 1} onClick={() => { setPage(p => p - 1); loadBookings() }}>Prev</button>
              <span style={{ padding: '6px 12px' }}>Page {page} of {totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => { setPage(p => p + 1); loadBookings() }}>Next</button>
            </div>
          )}
        </>
      )}

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Booking #{selected.id}</h3>
            <p><strong>Event:</strong> {selected.event_title || '-'}</p>
            <p><strong>Customer:</strong> {selected.customer_name || '-'}</p>
            <p><strong>Email:</strong> {selected.customer_email || '-'}</p>
            <p><strong>Phone:</strong> {selected.customer_phone || '-'}</p>
            <p><strong>Ticket Code:</strong> <code>{selected.ticket_code}</code></p>
            <p><strong>Status:</strong> <span className={`status-badge status-${selected.status}`}>{selected.status}</span></p>
            {selected.verify_url && <p><strong>Verify URL:</strong> <a href={selected.verify_url} target="_blank">{selected.verify_url}</a></p>}
            {selected.pdf_url && <p><strong>PDF:</strong> <a href={selected.pdf_url} target="_blank">Download</a></p>}
            {selected.checkin_at && <p><strong>Checked in at:</strong> {selected.checkin_at}</p>}
            <div className="modal-actions">
              {selected.can_checkin && (
                <button className="btn btn-success" onClick={() => checkin(selected.id)}>
                  Check In Ticket
                </button>
              )}
              <button className="btn btn-outline" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
