import api, { apiError } from './axios'

export async function listVehicles(params = {}) {
  try {
    const { data } = await api.get('/vehicles', { params })
    return data
  } catch (err) {
    throw apiError(err)
  }
}

export async function getVehicle(id) {
  try {
    const { data } = await api.get(`/vehicles/${id}`)
    return data
  } catch (err) {
    throw apiError(err)
  }
}

export async function createVehicle(payload) {
  try {
    const { data } = await api.post('/vehicles', payload)
    return data
  } catch (err) {
    throw apiError(err)
  }
}

export async function updateVehicle(id, payload) {
  try {
    const { data } = await api.put(`/vehicles/${id}`, payload)
    return data
  } catch (err) {
    throw apiError(err)
  }
}

export async function deleteVehicle(id) {
  try {
    await api.delete(`/vehicles/${id}`)
  } catch (err) {
    throw apiError(err)
  }
}
