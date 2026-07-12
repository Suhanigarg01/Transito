import api, { apiError } from './axios'

export async function getRoiReport({ type, vehicleId, from, to } = {}) {
  const params = {}
  if (type) params.type = type
  if (vehicleId) params.vehicleId = vehicleId
  if (from) params.from = from
  if (to) params.to = to
  try {
    const { data } = await api.get('/reports', { params })
    return data
  } catch (err) {
    throw apiError(err)
  }
}
