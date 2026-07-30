import api from './api';

const opportunityService = {
    async getOpportunities({ search, type, category, workMode, page = 1, limit = 9 } = {}) {
        const { data } = await api.get('/opportunities', {
            params: { search, type, category, workMode, page, limit },
        });
        return data;
    },

    async getCategories() {
        const { data } = await api.get('/opportunities/categories');
        return data;
    },

    async getOpportunityById(id) {
        const { data } = await api.get(`/opportunities/${id}`);
        return data;
    },
};

export default opportunityService;
