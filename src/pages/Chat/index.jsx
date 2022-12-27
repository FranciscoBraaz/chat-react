import React, { useState } from "react"
import { Avatar } from "../../components/Avatar"
import { Input } from "../../components/Input"
import { Message } from "../../components/Message"

import "./index.scss"

export function Chat() {
  const [message, setMessage] = useState("")

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
