import React from "react"

import "./index.scss"

export function Badge({ count = 0 }) {
  return <div className="badge">{count}</div>
}
