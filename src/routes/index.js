import { Navigate, Route, Routes } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Chat } from "../pages/Chat"
import { LoadingPage } from "../pages/LoadingPage"
import { Login } from "../pages/Login"
import { Register } from "../pages/Register"

export default function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) {
    console.log("IS", isLoading)
    return (
      <Routes>
        <Route path="/" element={<LoadingPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    )
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<Chat />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
