import store from "@/store/store";
import axios from "axios"


// Create an Axios instance with withCredentials set to true
const api = axios.create({
  withCredentials: true,
  baseURL: '/api',
});

// Set up an interceptor to add the token to every request
api.interceptors.request.use((config) =>  {

  const token = store.getState().auth.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Now, when you make requests with this Axios instance, cookies and the token will be included
// api.get('/your-endpoint')
//   .then(response => {
//     // Handle response
//   })
//   .catch(error => {
//     // Handle error
//   });

export default api