import axios from "axios"

const BASE_URL = "https://chat-node-eyyl.onrender.com/"

export const api = axios.create({
  baseURL: BASE_URL,
})
