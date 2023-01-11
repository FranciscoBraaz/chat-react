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
  const { accessToken, setAccessToken } = useAuth()

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

    newSocket.on("user-list", (userList) => {
      if (userList?.length > 0) {
        setUsersConnected(userList)
      }
    })

    newSocket.on("list-update", (data) => {
      console.log("broadcast")
      if (data?.userList?.length > 0) {
        setUsersConnected(data.userList)
      }
    })

    return () => {
      newSocket.close()
    }
  }, [])

  console.log(usersConnected)

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
          <Message
            userName="Francisco Braz"
            message="Oi, como vai? dsjkskdj kdsljksl kdsjdsk jskljdslk jslksjlkdsj lksjsdlk sjklsdj lkdsjlskd jslkdsj lksjskd kdsjdsklsdjkldslk jsdlk sjlkds jlksdjs lk ksjdksd jkdsjkdsjk jdskdjskd skjdskdsk jkdjskdsj ksjskdjdsk jskjdskjsd kj sdk kdsjksdjskdj kdsjkdsj kjdskj
             dskjdskjdsk jsdksjdsdkj kdsjksd jskdjdsk jdskjdskjds kjdskjdsk jksdjkdsjkdsj ksjsdkj kjsdkdsjk"
          />
        </div>
        <Input
          type="text"
          value={message}
          placeholder="Digite sua mensagem"
          onChange={(value) => setMessage(value)}
        />
      </section>
    </div>
  )
}
