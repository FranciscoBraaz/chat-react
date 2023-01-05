import React, { useEffect, useState } from "react"
import socketIO from "socket.io-client"
import { Avatar } from "../../components/Avatar"
import { Input } from "../../components/Input"
import { Message } from "../../components/Message"
import { useRefreshToken } from "../../hooks/useRefreshToken"

import "./index.scss"

// const socket = socketIO.connect("http://localhost:2000")

export function Chat() {
  const [message, setMessage] = useState("")
  const [socket, setSocket] = useState(null)
  const [token, setToken] = useState("")
  const { refresh } = useRefreshToken()

  // function sendMessage() {
  //   socket.emit()
  // }

  useEffect(() => {
    const newSocket = socketIO.connect("http://localhost:2000", {
      reconnection: false,
      auth: {
        token: `Bearer ${token}`,
      },
    })

    newSocket.on("connect_error", async (err) => {
      if (err.message === "Auth Error") {
        const newAccessToken = await refresh()
        setToken(newAccessToken)
      }
      console.log("Error", err.message)
    })
    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [])

  console.log(socket)

  return (
    <div className="chat">
      <section className="chat__users">
        <div className="chat__users__user">
          <Avatar letter="F" />
          <span>Francisco Braz</span>
        </div>
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
