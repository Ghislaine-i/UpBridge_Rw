import api from './api';

const getMentors = async (params) => {
    const response = await api.get('/mentors', { params });
    return response.data;
};

const getExpertiseList = async () => {
    const response = await api.get('/mentors/expertise');
    return response.data;
};

const getMentorById = async (id) => {
    const response = await api.get(`/mentors/${id}`);
    return response.data;
};

const getMySessions = async () => {
    const response = await api.get('/mentorship-sessions/my-sessions');
    return response.data;
};

const bookSession = async (data) => {
    const response = await api.post('/mentorship-sessions/book', data);
    return response.data;
};

export default {
    getMentors,
    getExpertiseList,
    getMentorById,
    getMySessions,
    bookSession,
};
