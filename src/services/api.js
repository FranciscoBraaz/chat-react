import axios from "axios"

const BASE_URL = "http://localhost:2000"

export const api = axios.create({
  baseURL: BASE_URL,
})
