import { api } from "../services/api"

export function useRefreshToken() {
  async function refresh() {
    const response = await api.get("refresh-token")
    return response.data.accessToken
  }

  return { refresh }
}
