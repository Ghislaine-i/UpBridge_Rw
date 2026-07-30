import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Clock, Users } from 'lucide-react';

const CourseCard = ({ course }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/learning-hub/${course.id}`)}
      className="card overflow-hidden text-left hover:shadow-md hover:-translate-y-0.5 transition-all"
    >
      <div className="h-36 bg-slate-100 overflow-hidden">
        {course.thumbnail_url ? (
          <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary to-secondary" />
        )}
      </div>

      <div className="p-4">
        <span className="inline-block text-xs font-semibold text-primary bg-primary/10 rounded-full px-2.5 py-1 mb-2">
          {course.category}
        </span>
        <h3 className="font-semibold text-slate-800 leading-snug line-clamp-2">{course.title}</h3>
        <p className="text-sm text-slate-500 mt-1.5 line-clamp-2">{course.description}</p>

        <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" /> {Number(course.rating).toFixed(1)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {course.duration_hours}h
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" /> {course.students_enrolled?.toLocaleString()}
          </span>
        </div>

        {course.progress_percent !== undefined && course.progress_percent !== null && (
          <div className="mt-3">
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-accent" style={{ width: `${course.progress_percent}%` }} />
            </div>
            <p className="text-xs text-slate-400 mt-1">{course.progress_percent}% complete</p>
          </div>
        )}
      </div>
    </button>
  );
};

export default CourseCard;
