import axios from 'axios';

const API_URL = process.env.REACT_APP_API;

const http = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

http.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})


export const authAPI = {
  loginUser: ({ username, password }) => http.post('/users/login', { username, password }),
  registerAdmin: data => http.post('/admin/register', data),
  loginAdmin: data => http.post('/admin/login', data),
  setupEmployeeAccount: data => http.post('/employees/setup-account', data),
}

export const employeeAPI = {
  getAll: () => http.get('/employees'),
  getById: id => http.get(`/employees/${id}`),
  create: payload => http.post('/employees', payload),
  update: (id, upd) => http.put(`/employees/${id}`, upd),
  delete: id => http.delete(`/employees/${id}`),
}

export const taskAPI = {
  getAll: () => http.get('/tasks'),
  create: payload => http.post('/tasks', payload),
  delete: id => http.delete(`/tasks/${id}`),
}


export const chatAPI = {
  getHistory: (user1, user2) => http.get(`/messages/${user1}/${user2}`),
  sendMessage: (payload) => http.post('/messages', payload),
};

export default http
