import React from "react"

import "./index.scss"

export function Input({
  type,
  value,
  required = false,
  placeholder,
  backgroundColor = "#fff",
  withShadow = false,
  onChange,
  onPressEnter,
}) {
  function handleKeyDown(target, key) {
    if (key === "Enter") {
      onPressEnter(target.value)
    }
  }

  function returnClassName() {
    let className = "input"

    if (withShadow) className += " input--shadow"

    return className
  }

  return (
    <input
      className={returnClassName()}
      type={type}
      value={value}
      required={required}
      placeholder={placeholder}
      style={{ backgroundColor }}
      onChange={({ target }) => onChange(target.value)}
      onKeyDown={
        onPressEnter
          ? ({ target, key }) => handleKeyDown(target, key)
          : undefined
      }
    />
  )
}
