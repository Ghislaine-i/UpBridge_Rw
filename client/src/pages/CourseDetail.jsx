import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, Clock, Users, ChevronLeft, PlayCircle } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';
import courseService from '../services/courseService';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [continuing, setContinuing] = useState(false);
  const [error, setError] = useState('');

  const loadCourse = async () => {
    setLoading(true);
    try {
      const res = await courseService.getCourseById(id);
      setCourse(res.data);
    } catch (err) {
      setError('This course could not be found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleContinue = async () => {
    setContinuing(true);
    try {
      await courseService.continueCourse(id);
      await loadCourse();
    } catch (err) {
      setError('Could not update your progress. Please try again.');
    } finally {
      setContinuing(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading course..." />;
  if (error || !course) {
    return (
      <EmptyState
        title="Course not found"
        description={error}
        action={
          <Button variant="outline" onClick={() => navigate('/learning-hub')}>
            Back to Learning Hub
          </Button>
        }
      />
    );
  }

  const progress = course.enrollment?.progress_percent ?? 0;

  return (
    <div className="max-w-4xl">
      <Link to="/learning-hub" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary mb-5">
        <ChevronLeft className="h-4 w-4" /> Back to Learning Hub
      </Link>

      <div className="card overflow-hidden">
        <div className="h-56 bg-slate-100">
          {course.thumbnail_url ? (
            <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary to-secondary" />
          )}
        </div>

        <div className="p-6 sm:p-8">
          <span className="inline-block text-xs font-semibold text-primary bg-primary/10 rounded-full px-2.5 py-1 mb-3">
            {course.category} • {course.level}
          </span>
          <h1 className="text-2xl font-bold text-slate-800">{course.title}</h1>
          <p className="text-slate-600 mt-3 leading-relaxed">{course.description}</p>

          <div className="flex flex-wrap items-center gap-6 mt-5 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <Star className="h-4 w-4 text-amber-400 fill-amber-400" /> {Number(course.rating).toFixed(1)} rating
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {course.duration_hours} hours
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4" /> {course.students_enrolled?.toLocaleString()} students
            </span>
            {course.instructor_name && <span>Taught by {course.instructor_name}</span>}
          </div>

          {course.enrollment && (
            <div className="mt-6">
              <div className="flex justify-between text-sm text-slate-500 mb-1.5">
                <span>Your progress</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-accent transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          <Button variant="primary" className="mt-7 text-base px-6 py-3" loading={continuing} onClick={handleContinue}>
            <PlayCircle className="h-4 w-4" />
            {course.enrollment ? 'Continue Learning' : 'Start Course'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
