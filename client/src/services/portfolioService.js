import api from './api';

const portfolioService = {
    async getMyProjects() {
        const { data } = await api.get('/portfolio');
        return data;
    },

    async getProjectById(id) {
        const { data } = await api.get(`/portfolio/${id}`);
        return data;
    },

    async createProject(payload) {
        const { data } = await api.post('/portfolio', payload);
        return data;
    },

    async updateProject(id, payload) {
        const { data } = await api.put(`/portfolio/${id}`, payload);
        return data;
    },

    async deleteProject(id) {
        const { data } = await api.delete(`/portfolio/${id}`);
        return data;
    },
};

export default portfolioService;
