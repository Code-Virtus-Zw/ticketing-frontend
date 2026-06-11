import { useState, useEffect } from 'react'
import { api } from '../api/client'

export default function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  function loadEvents() {
    setLoading(true)
    api.listEvents({ search, perPage: 100 })
      .then((data) => setEvents(data.items || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadEvents() }, [])

  async function viewEvent(id) {
    try {
      const data = await api.getEvent(id)
      setSelected(data.event)
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>Events</h2>
        <p>View and manage events</p>
      </div>

      <div className="search-bar">
        <input
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && loadEvents()}
        />
        <button className="btn btn-primary" onClick={loadEvents}>Search</button>
      </div>

      {loading ? (
        <div className="loading">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="card"><p>No events found.</p></div>
      ) : (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Tickets</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id}>
                  <td>{event.title}</td>
                  <td><span className={`status-badge status-${event.status}`}>{event.status}</span></td>
                  <td>{event.tickets_count ?? 0}</td>
                  <td>
                    <button className="btn btn-outline" onClick={() => viewEvent(event.id)}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{selected.title}</h3>
            <p><strong>Status:</strong> <span className={`status-badge status-${selected.status}`}>{selected.status}</span></p>
            {selected.event_data?.venue && <p><strong>Venue:</strong> {selected.event_data.venue}</p>}
            {selected.event_data?.start_date && <p><strong>Start:</strong> {selected.event_data.start_date} {selected.event_data.start_time || ''}</p>}
            {selected.event_data?.end_date && <p><strong>End:</strong> {selected.event_data.end_date} {selected.event_data.end_time || ''}</p>}
            {selected.content && <p><strong>Description:</strong> {selected.content}</p>}
            {selected.stats && (
              <div style={{ marginTop: 12 }}>
                <strong>Stats:</strong>
                <p>Sold: {selected.stats.sold ?? 0} / {selected.stats.total_capacity ?? '-'}</p>
                <p>Checked in: {selected.stats.used ?? 0}</p>
              </div>
            )}
            {selected.tickets && selected.tickets.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <strong>Tickets ({selected.tickets.length})</strong>
                <table>
                  <thead>
                    <tr><th>Title</th><th>Price</th><th>Capacity</th><th>Available</th></tr>
                  </thead>
                  <tbody>
                    {selected.tickets.map((t, i) => (
                      <tr key={i}>
                        <td>{t.title || t.code}</td>
                        <td>{t.price}</td>
                        <td>{t.capacity}</td>
                        <td>{t.available}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
