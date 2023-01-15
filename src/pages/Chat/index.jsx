import React, { useEffect, useState } from "react"
import socketIO from "socket.io-client"

import { useRefreshToken } from "../../hooks/useRefreshToken"
import { useAuth } from "../../contexts/AuthContext"

import { Sidebar } from "../../components/Sidebar"
import { Input } from "../../components/Input"
import { Message } from "../../components/Message"

import "./index.scss"
import { AlignJustify } from "react-feather"
import { Avatar } from "../../components/Avatar"

export function Chat() {
  const { refresh } = useRefreshToken()
  const { user, accessToken, setAccessToken, handleLogout } = useAuth()

  const [message, setMessage] = useState("")
  const [socket, setSocket] = useState(null)
  const [usersConnected, setUsersConnected] = useState([])
  const [messages, setMessages] = useState([])
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false)

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
      { user: "", content: "Conexão estabelecida", type: "system" },
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

    newSocket.on("show-message", (msg) => {
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
    const content = value.trim()
    if (content) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: user.username, content: content, type: "user" },
      ])
      socket.emit("send-message", content)
      setMessage("")
    }
  }

  function defineMessageOrigin(message) {
    let origin = ""

    if (message.type === "system") return

    if (message.user === user.username) {
      origin = "self"
    } else {
      origin = "other"
    }

    return origin
  }

  // let usersConnected2 = [
  //   "francisco2",
  //   "francisco3",
  //   "francisco4",
  //   "francisco5",
  //   "francisco6",
  //   "francisco7",
  //   "francisco8",
  //   "francisco9",
  //   "francisco10",
  //   "francisco11",
  //   "francisco12",
  //   "francisco13",
  //   "francisco14",
  //   "francisco15",
  //   "francisco16",
  // ]

  return (
    <div className="chat">
      <Sidebar
        usersConnected={usersConnected}
        isOpen={sidebarIsOpen}
        handleLogout={handleLogout}
        handleClose={() => setSidebarIsOpen(false)}
      />
      <header className="chat__header">
        <button onClick={() => setSidebarIsOpen(true)}>
          <AlignJustify size={28} />
        </button>
        <Avatar
          userName={user.username}
          letter={user.username[0].toUpperCase()}
        />
      </header>
      <section className="chat__messages">
        <div className="chat__messages__area">
          <div className="chat__messages__area__header">
            <p>Divirta-se conversando com seus amigos</p>
            <div />
          </div>
          {messages.map((message, index) => (
            <Message
              key={index}
              userName={message.user}
              message={message.content}
              type={message.type ?? null}
              origin={defineMessageOrigin(message)}
            />
          ))}
        </div>
        <Input
          type="text"
          value={message}
          placeholder="Digite sua mensagem"
          withShadow
          onChange={(value) => setMessage(value)}
          onPressEnter={handleSendMessage}
          rightIcon="Send"
          iconBackground="#157cff"
          sizeIcon={18}
        />
      </section>
    </div>
  )
}
