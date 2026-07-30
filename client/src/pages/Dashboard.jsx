import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Briefcase,
  FolderGit2,
  Users,
  TrendingUp,
  ArrowRight,
  PlayCircle,
  Star,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';
import MentorDashboard from './MentorDashboard';
import AdminDashboard from './AdminDashboard';

// ─── Stat card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color, to }) => (
  <Link
    to={to}
    className="card p-5 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
  >
    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${color}`}>
      <Icon className="h-6 w-6" />
    </div>
    <div className="min-w-0">
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      <p className="text-sm text-slate-500 truncate">{label}</p>
    </div>
    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-primary ml-auto transition-colors" />
  </Link>
);

// ─── Progress bar ─────────────────────────────────────────────────────────────
const ProgressBar = ({ percent, className = '' }) => (
  <div className={`h-1.5 bg-slate-100 rounded-full overflow-hidden ${className}`}>
    <div
      className="h-full bg-primary rounded-full transition-all duration-500"
      style={{ width: `${Math.min(percent, 100)}%` }}
    />
  </div>
);

// ─── Recent course card ───────────────────────────────────────────────────────
const RecentCourseCard = ({ course }) => {
  const progress = course.progress_percent ?? 0;
  return (
    <Link
      to={`/learning-hub/${course.id}`}
      className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors group"
    >
      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
        <BookOpen className="h-5 w-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-primary transition-colors">
          {course.title}
        </p>
        <p className="text-xs text-slate-400 mt-0.5">{course.category} · {course.level}</p>
        <div className="mt-2 flex items-center gap-2">
          <ProgressBar percent={progress} className="flex-1" />
          <span className="text-xs text-slate-500 shrink-0">{progress}%</span>
        </div>
      </div>
      <PlayCircle className="h-5 w-5 text-slate-300 group-hover:text-primary transition-colors shrink-0" />
    </Link>
  );
};

// ─── Application status badge ─────────────────────────────────────────────────
const STATUS_STYLES = {
  submitted: 'bg-blue-50 text-blue-700',
  under_review: 'bg-yellow-50 text-yellow-700',
  shortlisted: 'bg-purple-50 text-purple-700',
  accepted: 'bg-green-50 text-green-700',
  rejected: 'bg-red-50 text-red-600',
};

const STATUS_LABELS = {
  submitted: 'Submitted',
  under_review: 'Under Review',
  shortlisted: 'Shortlisted',
  accepted: 'Accepted',
  rejected: 'Not Progressed',
};

// ─── Recent application card ──────────────────────────────────────────────────
const RecentApplicationCard = ({ app }) => (
  <Link
    to="/applications"
    className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors group"
  >
    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
      <Briefcase className="h-4.5 w-4.5 text-primary" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-primary transition-colors">
        {app.opportunity_title}
      </p>
      <p className="text-xs text-slate-400 mt-0.5">{app.company_name}</p>
    </div>
    <span
      className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[app.status] || 'bg-slate-100 text-slate-600'
        }`}
    >
      {STATUS_LABELS[app.status] || app.status}
    </span>
  </Link>
);

// ─── Section wrapper ──────────────────────────────────────────────────────────
const Section = ({ title, linkTo, linkLabel, children, isEmpty, emptyText, emptyLinkTo, emptyLinkLabel }) => (
  <div className="card overflow-hidden">
    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
      <h2 className="font-semibold text-slate-800">{title}</h2>
      {linkTo && (
        <Link to={linkTo} className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
          {linkLabel} <ArrowRight className="h-3 w-3" />
        </Link>
      )}
    </div>
    {isEmpty ? (
      <div className="px-5 py-8 text-center">
        <p className="text-sm text-slate-400">{emptyText}</p>
        {emptyLinkTo && (
          <Link to={emptyLinkTo} className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
            {emptyLinkLabel} <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>
    ) : (
      <div className="divide-y divide-slate-50">{children}</div>
    )}
  </div>
);

// ─── Welcome banner ───────────────────────────────────────────────────────────
const WelcomeBanner = ({ user }) => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.fullName?.split(' ')[0] || 'there';

  return (
    <div className="rounded-2xl bg-gradient-to-r from-primary to-secondary p-6 text-white">
      <p className="text-sm text-white/70 font-medium">{greeting},</p>
      <h1 className="text-2xl font-bold mt-0.5">{firstName} 👋</h1>
      <p className="text-sm text-white/80 mt-2 max-w-md">
        Ready to level up today? Pick up where you left off or browse new opportunities.
      </p>
      <div className="mt-4 flex gap-3">
        <Link
          to="/learning-hub"
          className="inline-flex items-center gap-1.5 bg-white text-primary text-sm font-semibold px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <BookOpen className="h-4 w-4" /> Learning Hub
        </Link>
        <Link
          to="/opportunities"
          className="inline-flex items-center gap-1.5 bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-white/30 transition-colors"
        >
          <Briefcase className="h-4 w-4" /> Opportunities
        </Link>
      </div>
    </div>
  );
};

// ─── Quick actions ─────────────────────────────────────────────────────────────
const QuickActions = () => {
  const actions = [
    { to: '/portfolio', icon: FolderGit2, label: 'Add Project', color: 'text-purple-600', bg: 'bg-purple-50' },
    { to: '/opportunities', icon: Briefcase, label: 'Find Jobs', color: 'text-green-600', bg: 'bg-green-50' },
    { to: '/mentorship', icon: Users, label: 'Get Mentored', color: 'text-orange-600', bg: 'bg-orange-50' },
    { to: '/profile', icon: Star, label: 'Edit Profile', color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  return (
    <div className="card p-5">
      <h2 className="font-semibold text-slate-800 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actions.map((a) => (
          <Link
            key={a.to}
            to={a.to}
            className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-50 transition-colors group text-center"
          >
            <div className={`h-10 w-10 rounded-xl ${a.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <a.icon className={`h-5 w-5 ${a.color}`} />
            </div>
            <span className="text-xs font-medium text-slate-600 group-hover:text-slate-800">{a.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

// ─── Student Dashboard Page ────────────────────────────────────────────────────────
const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ courses: 0, applications: 0, projects: 0 });
  const [recentCourses, setRecentCourses] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [coursesRes, appsRes, projectsRes] = await Promise.allSettled([
          api.get('/courses', { params: { limit: 100 } }), // we count enrollments on the frontend side
          api.get('/applications'),
          api.get('/portfolio'),
        ]);

        const apps = appsRes.status === 'fulfilled' ? appsRes.value.data.data : [];
        const projects = projectsRes.status === 'fulfilled' ? projectsRes.value.data.data : [];

        // Fetch user's enrolled courses (recent)
        const enrolledRes = await api.get('/courses/my-recent').catch(() => ({ data: { data: [] } }));
        const enrolled = enrolledRes.data?.data || [];

        setRecentCourses(enrolled.slice(0, 3));
        setRecentApplications(apps.slice(0, 3));
        setStats({
          courses: enrolled.length,
          applications: apps.length,
          projects: projects.length,
        });
      } catch {
        // fail silently — empty state shown instead
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <LoadingSpinner label="Loading dashboard..." />;

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome */}
      <WelcomeBanner user={user} />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={BookOpen}
          label="Courses Enrolled"
          value={stats.courses}
          color="bg-blue-50 text-blue-600"
          to="/learning-hub"
        />
        <StatCard
          icon={Briefcase}
          label="Applications Sent"
          value={stats.applications}
          color="bg-green-50 text-green-600"
          to="/applications"
        />
        <StatCard
          icon={FolderGit2}
          label="Portfolio Projects"
          value={stats.projects}
          color="bg-purple-50 text-purple-600"
          to="/portfolio"
        />
      </div>

      {/* Quick actions */}
      <QuickActions />

      {/* Recent content */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent courses */}
        <Section
          title="Continue Learning"
          linkTo="/learning-hub"
          linkLabel="View all"
          isEmpty={recentCourses.length === 0}
          emptyText="You haven't enrolled in any courses yet."
          emptyLinkTo="/learning-hub"
          emptyLinkLabel="Browse courses"
        >
          {recentCourses.map((c) => (
            <RecentCourseCard key={c.id} course={c} />
          ))}
        </Section>

        {/* Recent applications */}
        <Section
          title="Recent Applications"
          linkTo="/applications"
          linkLabel="View all"
          isEmpty={recentApplications.length === 0}
          emptyText="You haven't applied to any opportunities yet."
          emptyLinkTo="/opportunities"
          emptyLinkLabel="Browse opportunities"
        >
          {recentApplications.map((a) => (
            <RecentApplicationCard key={a.id} app={a} />
          ))}
        </Section>
      </div>

      {/* Tips / motivation strip */}
      <div className="card p-5 flex items-center gap-4">
        <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
          <TrendingUp className="h-5 w-5 text-accent" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-800">Keep your momentum going!</p>
          <p className="text-xs text-slate-500 mt-0.5">
            Students who complete at least one course per month are 3× more likely to land an internship.
          </p>
        </div>
        <Link
          to="/learning-hub"
          className="shrink-0 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          Explore <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
};

// ─── Entry Point Routing ────────────────────────────────────────────────────────
const Dashboard = () => {
  const { user } = useAuth();
  const role = user?.role || 'student';

  if (role === 'admin') {
    return <AdminDashboard />;
  }

  if (role === 'mentor') {
    return <MentorDashboard />;
  }

  return <StudentDashboard />;
};

export default Dashboard;
