import api, { apiError } from './axios'

export async function listDrivers(params = {}) {
  try {
    const { data } = await api.get('/drivers', { params })
    return data
  } catch (err) {
    throw apiError(err)
  }
}

export async function getDriver(id) {
  try {
    const { data } = await api.get(`/drivers/${id}`)
    return data
  } catch (err) {
    throw apiError(err)
  }
}

export async function createDriver(payload) {
  try {
    const { data } = await api.post('/drivers', payload)
    return data
  } catch (err) {
    throw apiError(err)
  }
}

export async function updateDriver(id, payload) {
  try {
    const { data } = await api.put(`/drivers/${id}`, payload)
    return data
  } catch (err) {
    throw apiError(err)
  }
}

export async function deleteDriver(id) {
  try {
    await api.delete(`/drivers/${id}`)
  } catch (err) {
    throw apiError(err)
  }
}