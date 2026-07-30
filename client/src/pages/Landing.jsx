import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Briefcase,
  Users,
  FolderGit2,
  ArrowRight,
  GraduationCap
} from 'lucide-react';
import Button from '../components/Button';

// Removing Navbar completely to prevent unauthorized access to restricted sections
// We will build a simple career portal header here instead.

const stats = [
  { label: 'Active Students', value: '3,200+' },
  { label: 'Courses Available', value: '12+' },
  { label: 'Mentors', value: '8+' },
  { label: 'Partner Companies', value: '20+' },
];

const features = [
  {
    icon: BookOpen,
    title: 'Learning Hub',
    description: 'Access curated courses in web development, data, design, and career readiness skills.',
  },
  {
    icon: FolderGit2,
    title: 'Build Your Portfolio',
    description: 'Showcase real projects with GitHub links and live demos that recruiters can see.',
  },
  {
    icon: Briefcase,
    title: 'Find Opportunities',
    description: 'Discover internships and jobs from companies across Rwanda, matched to your skills.',
  },
  {
    icon: Users,
    title: 'Connect with Mentors',
    description: 'Book sessions with experienced professionals who guide your career journey.',
  },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-50 min-h-screen font-sans selection:bg-primary/20">
      {/* Modern, Clean Header (No Nav Links) */}
      <header className="absolute inset-x-0 top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-0.5">
              <GraduationCap className="text-white h-6 w-6" />
            </div>
            <span className="font-bold text-slate-800 text-xl tracking-tight">UpBridge Rwanda</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/login')} className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors">
              Sign In
            </button>
            <Button variant="primary" onClick={() => navigate('/register')} className="bg-primary hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all px-5 py-2.5 text-sm">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Vibrant & Modern Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Subtle Background Gradients & Shapes */}
        <div className="absolute top-0 left-1/2 -ml-[40rem] w-[80rem] h-[40rem] bg-gradient-to-b from-blue-100/40 to-transparent -z-10 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute right-0 top-20 w-72 h-72 bg-gradient-to-br from-purple-100 to-primary/10 -z-10 rounded-full blur-3xl opacity-50"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <span className="inline-flex items-center gap-2 bg-white border border-slate-200/60 shadow-sm text-primary text-xs font-semibold px-4 py-2 rounded-full mb-8 tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Built for Rwandan students & young professionals
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-8 tracking-tight">
              Learn skills. <br className="hidden sm:block" />
              Build your portfolio. <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Get hired.</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              UpBridge Rwanda connects university students with the practical courses, professional mentors, and job opportunities they need to launch a career in tech and beyond.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-5">
              <Button variant="primary" onClick={() => navigate('/register')} className="bg-primary hover:bg-blue-700 text-white text-lg px-8 py-4 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group">
                Start Learning Free
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" onClick={() => navigate('/login')} className="bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 text-lg px-8 py-4 shadow-sm hover:shadow-md transition-all">
                I already have an account
              </Button>
            </div>
          </div>

          {/* Floating Stats Bar */}
          <div className="mt-20 max-w-5xl mx-auto relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 rounded-3xl blur-xl opacity-50 -z-10"></div>
            <div className="bg-white/80 backdrop-blur-md border border-white rounded-3xl shadow-xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-100">
              {stats.map((s, i) => (
                <div key={s.label} className={`text-center ${i % 2 === 0 ? 'border-none md:border-solid' : 'border-none'}`}>
                  <p className="text-3xl font-black text-slate-900 mb-1">{s.value}</p>
                  <p className="text-sm font-medium text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 relative bg-white rounded-[3rem] shadow-sm border border-slate-100 my-12">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6 tracking-tight">Everything you need in one place</h2>
          <p className="text-lg text-slate-600">
            From your first line of code to your first job offer, UpBridge Rwanda supports every step of your professional journey.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <div key={f.title} className="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 transition-all duration-300 cursor-default">
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-6 
                ${i === 0 ? 'bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white' : ''}
                ${i === 1 ? 'bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white' : ''}
                ${i === 2 ? 'bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white' : ''}
                ${i === 3 ? 'bg-orange-100 text-orange-600 group-hover:bg-orange-600 group-hover:text-white' : ''}
                transition-colors duration-300`}
              >
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Modern CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="relative rounded-[2.5rem] bg-slate-900 px-8 py-20 text-center overflow-hidden border border-slate-800 shadow-2xl">
          {/* Decorative shapes inside CTA */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-gradient-to-br from-primary/30 to-purple-600/30 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-gradient-to-tr from-blue-500/30 to-primary/30 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Ready to bridge the gap to your career?</h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10">
              Join thousands of students across Rwanda building real skills and real portfolios.
            </p>
            <Button variant="primary" className="bg-white text-slate-900 hover:bg-slate-100 text-lg px-10 py-4 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all w-full sm:w-auto font-bold" onClick={() => navigate('/register')}>
              Create Your Free Account
            </Button>
          </div>
        </div>
      </section>

      {/* Clean Footer */}
      <footer className="border-t border-slate-200 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 opacity-60">
            <GraduationCap className="h-6 w-6 text-slate-900" />
            <span className="font-bold text-slate-900 tracking-tight">UpBridge Rwanda</span>
          </div>
          <p className="text-sm text-slate-500 text-center md:text-left">
            © {new Date().getFullYear()} UpBridge Rwanda. Built for students, by students.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
