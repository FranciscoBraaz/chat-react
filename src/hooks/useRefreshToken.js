import { api } from "../services/api"

export function useRefreshToken() {
  async function refresh() {
    let response = null
    let error = null
    try {
      response = await api.get("/refresh-token", {
        withCredentials: true,
      })
    } catch (err) {
      error = err
    }

    return { data: response?.data ?? null, error }
  }

  return { refresh }
}
