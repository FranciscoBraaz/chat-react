import React from "react"

import { Comment } from "react-loader-spinner"

import "./index.scss"

export function LoadingPage() {
  return (
    <div className="loading-page">
      <Comment
        visible={true}
        height="80"
        width="80"
        ariaLabel="comment-loading"
        wrapperStyle={{}}
        wrapperClass="comment-wrapper"
        color="#fff"
        backgroundColor="#157cff"
      />
    </div>
  )
}
