// Cliente HTTP para la API del backend (server/).
// En desarrollo el backend corre en http://localhost:4000.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (res.status === 204) return null
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Error de servidor')
  return data
}

export const api = {
  // Movimientos
  getMovements: () => request('/movements'),
  createMovement: (data) =>
    request('/movements', { method: 'POST', body: JSON.stringify(data) }),
  updateMovement: (id, data) =>
    request(`/movements/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteMovement: (id) => request(`/movements/${id}`, { method: 'DELETE' }),

  // Categorías
  getCategories: () => request('/categories'),
  createCategory: (data) =>
    request('/categories', { method: 'POST', body: JSON.stringify(data) }),
  updateCategory: (id, data) =>
    request(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCategory: (id) => request(`/categories/${id}`, { method: 'DELETE' }),
}
