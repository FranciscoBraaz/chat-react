import React, { useEffect, useState } from "react"
import socketIO from "socket.io-client"
import { Avatar } from "../../components/Avatar"
import { Input } from "../../components/Input"
import { Message } from "../../components/Message"
import { useAuth } from "../../contexts/AuthContext"
import { useRefreshToken } from "../../hooks/useRefreshToken"

import "./index.scss"

// const socket = socketIO.connect("http://localhost:2000")

export function Chat() {
  const [message, setMessage] = useState("")
  const [socket, setSocket] = useState(null)
  const [usersConnected, setUsersConnected] = useState([])
  const { refresh } = useRefreshToken()
  const { user, accessToken, setAccessToken } = useAuth()
  const [messages, setMessages] = useState([])

  // function sendMessage() {
  //   socket.emit()
  // }

  useEffect(() => {
    const newSocket = socketIO.connect("http://localhost:2000", {
      reconnection: false,
      auth: {
        token: `Bearer ${accessToken}`,
      },
    })

    newSocket.on("connect_error", async (err) => {
      if (err.message === "Auth Error") {
        const { data } = await refresh()
        if (data) {
          setAccessToken(data.accessToken)
        }
      }
      console.log("Error", err.message)
    })
    setSocket(newSocket)

    setMessages((prevMessages) => [
      ...prevMessages,
      { user: user.username, content: "Conectado", type: "system" },
    ])

    newSocket.on("user-list", (userList) => {
      if (userList?.length > 0) {
        setUsersConnected(userList)
      }
    })

    newSocket.on("list-update", (data) => {
      if (data?.userList?.length > 0) {
        setUsersConnected(data.userList)
      }

      if (data?.joined) {
        const newMessage = `entrou no chat`
        setMessages((prevMessages) => [
          ...prevMessages,
          { user: data.joined, content: newMessage, type: "system" },
        ])
      }

      if (data?.left) {
        const newMessage = `saiu do chat`
        setMessages((prevMessages) => [
          ...prevMessages,
          { user: data.left, content: newMessage, type: "system" },
        ])
      }
    })

    newSocket.on("send-message", (msg) => {
      if (msg.user !== user.username) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { ...msg, type: "user" },
        ])
      }
    })

    return () => {
      newSocket.close()
      setMessages([])
    }

    /* eslint-disable-next-line*/
  }, [])

  function handleSendMessage(value) {
    setMessages((prevMessages) => [
      ...prevMessages,
      { user: user.username, content: value, type: "user" },
    ])
    socket.emit("send-message", value)
    setMessage("")
  }

  return (
    <div className="chat">
      <section className="chat__users">
        {usersConnected.map((userConnected) => (
          <div key={userConnected} className="chat__users__user">
            <Avatar letter={userConnected[0].toUpperCase()} />
            <span>{userConnected}</span>
          </div>
        ))}
      </section>
      <section className="chat__messages">
        <div className="chat__messages__area">
          {messages.map((message, index) => (
            <Message
              key={index}
              userName={message.user}
              message={message.content}
              type={message.type ?? null}
            />
          ))}
        </div>
        <Input
          type="text"
          value={message}
          placeholder="Digite sua mensagem"
          onChange={(value) => setMessage(value)}
          onPressEnter={handleSendMessage}
        />
      </section>
    </div>
  )
}
