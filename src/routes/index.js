import { Navigate, Route, Routes } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Chat } from "../pages/Chat"
import { Login } from "../pages/Login"

export default function AppRoutes() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return null

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
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
