import React from "react"

import "./index.scss"

export function Input({
  type,
  value,
  required = false,
  placeholder,
  onChange,
  onPressEnter,
}) {
  function handleKeyDown(target, key) {
    if (key === "Enter") {
      onPressEnter(target.value)
    }
  }

  return (
    <input
      className="input"
      type={type}
      value={value}
      required={required}
      placeholder={placeholder}
      onChange={({ target }) => onChange(target.value)}
      onKeyDown={
        onPressEnter
          ? ({ target, key }) => handleKeyDown(target, key)
          : undefined
      }
    />
  )
}
