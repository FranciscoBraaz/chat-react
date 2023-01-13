import React from "react"
import { defineAvatarColor } from "../../utils/defineAvatarColor"

import "./index.scss"

export function Avatar({ userName, letter }) {
  return (
    <div
      className="avatar"
      style={{ backgroundColor: defineAvatarColor(userName) }}
    >
      {letter}
    </div>
  )
}
