import React from "react"

import "./index.scss"

export function Button({ type, text, width = "100%", onClick }) {
  return (
    <button className="button" type={type} onClick={onClick} style={{ width }}>
      {text}
    </button>
  )
}
