import Axios from 'axios'

const BASE_URL = process.env.NODE_ENV === 'production'
    ? '/api/'
    : '//localhost:3030/api/'

const axios = Axios.create({ withCredentials: true, timeout: 10000 })
const pendingRequests = new Map()

export const httpService = {
    get(endpoint, data) {
        return ajax(endpoint, 'GET', data)
    },
    post(endpoint, data) {
        return ajax(endpoint, 'POST', data)
    },
    put(endpoint, data) {
        return ajax(endpoint, 'PUT', data)
    },
    delete(endpoint, data) {
        return ajax(endpoint, 'DELETE', data)
    }
}

async function ajax(endpoint, method = 'GET', data = null) {
    const url = `${BASE_URL}${endpoint}`
    const params = (method === 'GET') ? data : null
    const requestKey = buildRequestKey(method, endpoint, params)

    if (method === 'GET' && pendingRequests.has(requestKey)) {
        return pendingRequests.get(requestKey)
    }

    const options = { url, method, data, params }
    const requestPromise = (async () => {
        try {
            const res = await axios(options)
            return res.data
        } catch (err) {
            console.log(`Had Issues ${method}ing to the backend, endpoint: ${endpoint}, with data: `, data)
            console.dir(err)
            if (err.response && err.response.status === 401) {
                sessionStorage.clear()
                window.location.assign('/')
            }
            throw err
        }
    })()

    if (method === 'GET') {
        pendingRequests.set(requestKey, requestPromise)
    }

    try {
        return await requestPromise
    } finally {
        if (method === 'GET') {
            pendingRequests.delete(requestKey)
        }
    }
}

function buildRequestKey(method, endpoint, params) {
    return `${method}:${endpoint}:${JSON.stringify(params ?? {})}`
}