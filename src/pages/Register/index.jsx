import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../../components/Button"
import { Input } from "../../components/Input"
import { useAuth } from "../../contexts/AuthContext"
import { ClipLoader } from "react-spinners"
import { ReactComponent as Text } from "../../assets/text.svg"

import "./index.scss"

// const override = {
//   display: "inline-block",
//   margin: "0 auto",
//   borderColor: "#07bc0c",
// }

export function Register() {
  const { handleRegister } = useAuth()
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [successSubmit, setSuccessSubmit] = useState(false)
  const [errorSubmit, setErrorSubmit] = useState("")
  const navigate = useNavigate()

  async function handleOnRegister(event) {
    event.preventDefault()
    setIsLoading(true)
    const { error } = await handleRegister(name, username, email, password)
    if (error) {
      setIsLoading(false)
      setErrorSubmit(error)
    } else {
      setIsLoading(false)
      setSuccessSubmit(true)
      setTimeout(() => {
        navigate("/login")
      }, 3000)
    }
  }

  function returnClassNameRegisterSuccess() {
    let className = "register__success"

    if (successSubmit) className += " register__success--visible"

    return className
  }

  function returnClassNameRegisterError() {
    let className = "register__error"

    if (errorSubmit) className += " register__error--visible"

    return className
  }

  return (
    <div className="register">
      <div className="register__form-container">
        <form className="register__form" onSubmit={handleOnRegister}>
          <h1>Cadastro</h1>
          <div>
            <Input
              type="text"
              value={name}
              required
              placeholder="Nome"
              onChange={(value) => setName(value)}
              onFocus={() => setErrorSubmit("")}
            />
            <Input
              type="text"
              value={username}
              required
              placeholder="Username"
              onChange={(value) => setUsername(value)}
              onFocus={() => setErrorSubmit("")}
            />
            <Input
              type="email"
              value={email}
              required
              placeholder="E-mail"
              onChange={(value) => setEmail(value)}
              onFocus={() => setErrorSubmit("")}
            />
            <Input
              type="password"
              value={password}
              required
              placeholder="Senha"
              onChange={(value) => setPassword(value)}
              onFocus={() => setErrorSubmit("")}
            />
            <p className={returnClassNameRegisterError()}>{errorSubmit}</p>
            <div className={returnClassNameRegisterSuccess()}>
              <p>Cadastro relizado com sucesso</p>
              <p>
                <span>Você será redirecionado</span>
                <ClipLoader
                  color="#07bc0c"
                  loading={true}
                  size={14}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              </p>
            </div>
            <Button type="submit" text="Cadastrar" isLoading={isLoading} />
            <button
              type="button"
              className="register__link"
              onClick={() => navigate("/login")}
            >
              Já possui conta? Faça o login
            </button>
          </div>
        </form>
        <div className="register-image">
          <Text />
        </div>
      </div>
    </div>
  )
}
