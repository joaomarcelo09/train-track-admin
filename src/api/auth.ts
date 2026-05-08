import { apiClient } from './client'
import type { AuthUser } from '../types'

export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = LoginPayload

type AuthResponse = {
  access_token?: string
  token_type?: string
}

function normalizeAccessToken(data: AuthResponse) {
  if (!data.access_token) {
    throw new Error('Authentication response did not include an access token')
  }

  return data.access_token
}

export async function login(payload: LoginPayload) {
  const response = await apiClient.post<AuthResponse>('/auth/login', payload)
  return normalizeAccessToken(response.data)
}

export async function register(payload: RegisterPayload) {
  await apiClient.post('/auth/register', payload)
}

export async function getCurrentUser() {
  const response = await apiClient.get<AuthUser>('/auth/me')
  return response.data
}
