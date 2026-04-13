async function apiClient<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json()
    throw { status: response.status, ...error }
  }

  return response.json()
}

export default apiClient
