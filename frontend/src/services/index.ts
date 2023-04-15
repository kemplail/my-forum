import axios, { AxiosInstance } from "axios";
import store from "../store";

const api: AxiosInstance = axios.create({
    baseURL:  process.env.REACT_APP_API
})

api.interceptors.request.use(
    async (config) => {
         const state = store.getState()
         if (state.user.access_token !== '') {
             const { access_token } = state.user

             if(config.headers) {
                config.headers['Authorization'] = `Bearer ${access_token}`
             }
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default api