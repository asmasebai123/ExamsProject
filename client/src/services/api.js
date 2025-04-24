import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:5000', 
  })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        console.log('Interceptor triggered 401');
        localStorage.removeItem('token');
        // Ne redirigez pas directement ici, laissez le composant gérer
      }
      return Promise.reject(error);
    }
  );

export default api