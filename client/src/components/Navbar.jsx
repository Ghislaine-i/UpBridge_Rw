import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Menu, X } from 'lucide-react';
import Button from './Button';

const navLinks = [
  { label: 'Learning Hub', to: '/learning-hub' },
  { label: 'Opportunities', to: '/opportunities' },
  { label: 'Mentorship', to: '/mentorship' },
  { label: 'About', to: '/#about' },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
            <GraduationCap className="text-white h-5 w-5" />
          </div>
          <span className="font-bold text-slate-800 text-lg">UpBridge Rwanda</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            link.to.startsWith('/#') ?
              <a key={link.label} href={link.to.substring(1)} className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
                {link.label}
              </a>
              :
              <Link key={link.label} to={link.to} className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
                {link.label}
              </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate('/login')}>
            Log In
          </Button>
          <Button variant="primary" onClick={() => navigate('/register')}>
            Get Started
          </Button>
        </div>

        <button className="md:hidden text-slate-700" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-100 px-4 py-4 flex flex-col gap-4 bg-white">
          {navLinks.map((link) => (
            link.to.startsWith('/#') ?
              <a key={link.label} href={link.to.substring(1)} className="text-sm font-medium text-slate-600" onClick={() => setOpen(false)}>
                {link.label}
              </a>
              :
              <Link key={link.label} to={link.to} className="text-sm font-medium text-slate-600" onClick={() => setOpen(false)}>
                {link.label}
              </Link>
          ))}
          <div className="flex flex-col gap-3 pt-2">
            <Button variant="outline" fullWidth onClick={() => navigate('/login')}>
              Log In
            </Button>
            <Button variant="primary" fullWidth onClick={() => navigate('/register')}>
              Get Started
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
