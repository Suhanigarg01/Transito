import api, { apiError } from './axios'

export async function getDashboardSummary() {
  try {
    const { data } = await api.get('/dashboard/summary')
    return data
  } catch (err) {
    throw apiError(err)
  }
}