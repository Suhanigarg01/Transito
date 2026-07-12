import api, { apiError } from './axios'

export async function listTrips(params = {}) {
  try {
    const { data } = await api.get('/trips', { params })
    return data
  } catch (err) {
    throw apiError(err)
  }
}

export async function getTrip(id) {
  try {
    const { data } = await api.get(`/trips/${id}`)
    return data
  } catch (err) {
    throw apiError(err)
  }
}

export async function createTrip(payload) {
  try {
    const { data } = await api.post('/trips', payload)
    return data
  } catch (err) {
    throw apiError(err)
  }
}

export async function dispatchTrip(id, { vehicleId, driverId }) {
  try {
    const { data } = await api.post(`/trips/${id}/dispatch`, { vehicleId, driverId })
    return data
  } catch (err) {
    throw apiError(err)
  }
}

export async function completeTrip(id, { endOdometer, notes }) {
  try {
    const { data } = await api.post(`/trips/${id}/complete`, { endOdometer, notes })
    return data
  } catch (err) {
    throw apiError(err)
  }
}

export async function cancelTrip(id) {
  try {
    const { data } = await api.post(`/trips/${id}/cancel`)
    return data
  } catch (err) {
    throw apiError(err)
  }
}
