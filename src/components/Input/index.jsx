import React from "react"

import "./index.scss"

export function Input({
  type,
  value,
  required = false,
  placeholder,
  onChange,
}) {
  return (
    <input
      className="input"
      type={type}
      value={value}
      required={required}
      placeholder={placeholder}
      onChange={({ target }) => onChange(target.value)}
    />
  )
}
