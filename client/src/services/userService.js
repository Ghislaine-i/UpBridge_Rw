import api from './api';

const userService = {
    async updateProfile(payload) {
        // Maps camelCase frontend keys to what the backend updateProfile expects
        const { data } = await api.put('/profile', payload);
        return data;
    },

    async changePassword(payload) {
        const { data } = await api.put('/profile/password', payload);
        return data;
    },
};

export default userService;
