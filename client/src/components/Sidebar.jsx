import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, FolderGit2, Briefcase, Users, User, FileText, Settings, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const role = user?.role || 'student';

  // Base link for all roles
  let links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  if (role === 'admin') {
    links = [
      ...links,
      { to: '/learning-hub', label: 'Manage Courses', icon: BookOpen },
      { to: '/opportunities', label: 'Manage Opportunities', icon: Briefcase },
      { to: '/admin/users', label: 'Manage Users', icon: Users },
      { to: '/admin/reports', label: 'Reports', icon: Database },
      { to: '/profile', label: 'Profile', icon: Settings },
    ];
  } else if (role === 'mentor') {
    links = [
      ...links,
      { to: '/learning-hub', label: 'Course Library', icon: BookOpen },
      { to: '/profile', label: 'Profile', icon: User },
    ];
  } else {
    // Default student links
    links = [
      ...links,
      { to: '/learning-hub', label: 'Learning Hub', icon: BookOpen },
      { to: '/portfolio', label: 'Portfolio', icon: FolderGit2 },
      { to: '/opportunities', label: 'Opportunities', icon: Briefcase },
      { to: '/applications', label: 'Applications', icon: FileText },
      { to: '/mentorship', label: 'Mentorship', icon: Users },
      { to: '/profile', label: 'Profile', icon: User },
    ];
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-slate-100 bg-white min-h-[calc(100vh-4rem)] py-6 px-3">
      <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50'
              }`
            }
          >
            <link.icon className="h-4.5 w-4.5" />
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
