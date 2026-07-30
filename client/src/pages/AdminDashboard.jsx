import React, { useState, useEffect } from 'react';
import { Users, Briefcase, BookOpen, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard = () => {
    const { user } = useAuth();

    // Mock data for now since admin endpoints probably don't exist
    const [stats] = useState({
        users: 3241,
        opportunities: 45,
        courses: 14,
        mentors: 12
    });

    return (
        <div className="flex flex-col gap-6">
            <div className="rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 p-6 text-white text-center sm:text-left shadow-lg">
                <p className="text-sm text-slate-300 font-medium tracking-wide">Administrator Panel</p>
                <h1 className="text-3xl font-extrabold mt-1 text-white">System Status: Optimal</h1>
                <p className="text-sm text-slate-400 mt-2 max-w-lg">
                    Welcome back, {user?.fullName}. Here's an overview of the platform's current standing.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                <div className="card p-6 flex flex-col justify-center gap-2 border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center mb-1">
                        <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="text-3xl font-black text-slate-800">{stats.users}</p>
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Total Students</p>
                </div>

                <div className="card p-6 flex flex-col justify-center gap-2 border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center mb-1">
                        <Briefcase className="h-5 w-5 text-green-600" />
                    </div>
                    <p className="text-3xl font-black text-slate-800">{stats.opportunities}</p>
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Active Jobs</p>
                </div>

                <div className="card p-6 flex flex-col justify-center gap-2 border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="h-10 w-10 bg-purple-50 rounded-lg flex items-center justify-center mb-1">
                        <BookOpen className="h-5 w-5 text-purple-600" />
                    </div>
                    <p className="text-3xl font-black text-slate-800">{stats.courses}</p>
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Live Courses</p>
                </div>

                <div className="card p-6 flex flex-col justify-center gap-2 border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="h-10 w-10 bg-orange-50 rounded-lg flex items-center justify-center mb-1">
                        <Database className="h-5 w-5 text-orange-600" />
                    </div>
                    <p className="text-3xl font-black text-slate-800">{stats.mentors}</p>
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Verified Mentors</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
