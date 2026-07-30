import api from './api';

const courseService = {
  async getCourses({ search, category, level, page = 1, limit = 9 } = {}) {
    const { data } = await api.get('/courses', { params: { search, category, level, page, limit } });
    return data;
  },

  async getCategories() {
    const { data } = await api.get('/courses/categories');
    return data;
  },

  async getCourseById(id) {
    const { data } = await api.get(`/courses/${id}`);
    return data;
  },

  async continueCourse(id) {
    const { data } = await api.post(`/courses/${id}/continue`);
    return data;
  },
};

export default courseService;
