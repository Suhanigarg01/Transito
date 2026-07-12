import api, { apiError } from './axios'

export async function listExpenses(params = {}) {
  try {
    const { data } = await api.get('/expenses', { params })
    return data
  } catch (err) {
    throw apiError(err)
  }
}

export async function createExpense(payload) {
  try {
    const { data } = await api.post('/expenses', payload)
    return data
  } catch (err) {
    throw apiError(err)
  }
}

export async function updateExpense(id, payload) {
  try {
    const { data } = await api.put(`/expenses/${id}`, payload)
    return data
  } catch (err) {
    throw apiError(err)
  }
}

export async function deleteExpense(id) {
  try {
    await api.delete(`/expenses/${id}`)
  } catch (err) {
    throw apiError(err)
  }
}
