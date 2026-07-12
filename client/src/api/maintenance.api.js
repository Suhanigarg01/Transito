import api, { apiError } from './axios'

export async function listMaintenance(params = {}) {
  try {
    const { data } = await api.get('/maintenance', { params })
    return data
  } catch (err) {
    throw apiError(err)
  }
}

export async function createMaintenance(payload) {
  try {
    const { data } = await api.post('/maintenance', payload)
    return data
  } catch (err) {
    throw apiError(err)
  }
}

export async function updateMaintenance(id, payload) {
  try {
    const { data } = await api.put(`/maintenance/${id}`, payload)
    return data
  } catch (err) {
    throw apiError(err)
  }
}

export async function closeMaintenance(id) {
  try {
    const { data } = await api.post(`/maintenance/${id}/close`)
    return data
  } catch (err) {
    throw apiError(err)
  }
}

export async function deleteMaintenance(id) {
  try {
    await api.delete(`/maintenance/${id}`)
  } catch (err) {
    throw apiError(err)
  }
}
