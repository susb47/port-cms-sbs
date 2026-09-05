'use client'

import React from 'react'

export default function AdminSandboxLink() {
  return (
    <div style={{ padding: '16px', marginBottom: '16px', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px' }}>
      <div style={{ fontWeight: 600, marginBottom: '8px', color: '#0369a1' }}>Page Builder</div>
      <p style={{ fontSize: '13px', color: '#0c4a6e', marginBottom: '12px' }}>
        Use the visual sandbox builder to design your page with drag-and-drop blocks.
      </p>
      <a
        href="/admin/sandbox"
        style={{
          display: 'inline-block',
          padding: '8px 16px',
          background: '#0ea5e9',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '6px',
          fontSize: '13px',
          fontWeight: 600,
        }}
      >
        Open Visual Builder →
      </a>
    </div>
  )
}
