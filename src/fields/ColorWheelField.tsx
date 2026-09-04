'use client'

import React from 'react'
import { useField } from '@payloadcms/ui'
import { HexColorPicker } from 'react-colorful'
import type { TextFieldClientComponent } from 'payload'

// Custom Payload field — replaces the default text input with a
// color wheel + hex input for any field it's attached to via
// admin.components.Field. Value is stored as a plain hex string,
// so it consumes like a normal text field everywhere else.
export const ColorWheelField: TextFieldClientComponent = ({ path, field }) => {
  const { value, setValue } = useField<string>({ path })
  const label = typeof field.label === 'string' ? field.label : field.name
  const currentColor = value || '#000000'

  return (
    <div className="field-type text color-wheel-field" style={{ marginBottom: '1.5rem' }}>
      <label className="field-label" htmlFor={path}>
        {label}
      </label>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginTop: '0.5rem' }}>
        <HexColorPicker color={currentColor} onChange={setValue} />
        <input
          id={path}
          type="text"
          value={currentColor}
          onChange={(e) => setValue(e.target.value)}
          style={{
            width: '8rem',
            height: '2.25rem',
            fontFamily: 'monospace',
            padding: '0 0.5rem',
          }}
        />
      </div>
    </div>
  )
}
