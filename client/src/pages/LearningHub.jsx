import React, { useState, useEffect, useCallback } from 'react';
import { BookOpen } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import CourseCard from '../components/CourseCard';
import courseService from '../services/courseService';

const LearningHub = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    courseService
      .getCategories()
      .then((res) => setCategories(res.data))
      .catch(() => setCategories(['All']));
  }, []);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await courseService.getCourses({ search, category, page, limit: 9 });
      setCourses(res.data);
      setTotalPages(res.pagination.totalPages);
    } catch (err) {
      setError('Could not load courses. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [search, category, page]);

  useEffect(() => {
    const timeout = setTimeout(fetchCourses, 300); // debounce search
    return () => clearTimeout(timeout);
  }, [fetchCourses]);

  useEffect(() => {
    setPage(1);
  }, [search, category]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Learning Hub</h1>
          <p className="text-sm text-slate-500 mt-1">Grow your skills with courses built for the Rwandan job market.</p>
        </div>
        <SearchBar value={search} onChange={setSearch} placeholder="Search courses..." className="sm:w-72" />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition ${
              category === cat
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner label="Loading courses..." />
      ) : error ? (
        <EmptyState title="Something went wrong" description={error} />
      ) : courses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses found"
          description="Try adjusting your search or filter to find what you're looking for."
        />
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
};

export default LearningHub;
