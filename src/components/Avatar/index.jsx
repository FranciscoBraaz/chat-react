import React from "react"
import { defineAvatarColor } from "../../utils/defineAvatarColor"

import "./index.scss"

export function Avatar({ userName, letter, size = 40 }) {
  return (
    <div
      className="avatar"
      style={{
        minWidth: size,
        minHeight: size,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: defineAvatarColor(userName),
      }}
    >
      {letter}
    </div>
  )
}
