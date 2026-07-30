import api from './api';

const authService = {
  async register({ fullName, email, password, role }) {
    const { data } = await api.post('/register', { fullName, email, password, role });
    return data;
  },

  async login({ email, password }) {
    const { data } = await api.post('/login', { email, password });
    return data;
  },

  async getMe() {
    const { data } = await api.get('/me');
    return data;
  },
};

export default authService;
