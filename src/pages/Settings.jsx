import { useState } from 'react'
import { api } from '../api/client'

export default function Settings({ user }) {
  return (
    <div>
      <div className="page-header">
        <h2>Settings</h2>
        <p>System configuration</p>
      </div>

      <div className="card">
        <div className="card-title">Current User</div>
        <p><strong>Username:</strong> {user?.login}</p>
        <p><strong>Display Name:</strong> {user?.display_name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p>
          <strong>Permissions:</strong>{' '}
          {user?.can_manage ? 'Manage, ' : ''}
          {user?.can_checkin ? 'Check-in' : ''}
        </p>
      </div>

      <div className="card">
        <div className="card-title">About</div>
        <p><strong>Application:</strong> HKD Events Super Admin Panel</p>
        <p><strong>Backend:</strong> Spring Boot API at /wp-json/hkd-events/v1</p>
        <p><strong>Sync:</strong> Pulls data from WordPress plugin, queues check-ins for writeback</p>
      </div>
    </div>
  )
}
