import api from './api';

const applicationService = {
    async getMyApplications() {
        const { data } = await api.get('/applications');
        return data;
    },

    async apply({ opportunityId, coverNote, resumeUrl }) {
        const { data } = await api.post('/applications', { opportunityId, coverNote, resumeUrl });
        return data;
    },

    async withdraw(id) {
        const { data } = await api.delete(`/applications/${id}`);
        return data;
    },
};

export default applicationService;
