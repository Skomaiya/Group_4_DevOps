import axios from 'axios'


const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'


const axiosClient = axios.create({
baseURL: `${baseURL}/api/`,
headers: { 'Content-Type': 'application/json' },
})


// attach token if present
axiosClient.interceptors.request.use((config) => {
try {
const token = localStorage.getItem('access_token')
if (token) config.headers.Authorization = `Bearer ${token}`
} catch (e) {}
return config
})


export default axiosClient