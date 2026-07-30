import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Calendar, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import mentorService from '../services/mentorService';
import Button from '../components/Button';

const MentorDashboard = () => {
    const { user } = useAuth();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        mentorService.getMySessions()
            .then((res) => setSessions(res.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <LoadingSpinner label="Loading mentor dashboard..." />;

    const upcomingSessions = sessions.filter(s => s.status === 'scheduled' || s.status === 'pending');
    const pastSessions = sessions.filter(s => s.status === 'completed');

    return (
        <div className="flex flex-col gap-6">
            {/* Welcome */}
            <div className="rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-600 p-6 text-white">
                <p className="text-sm text-white/70 font-medium">Mentor Dashboard</p>
                <h1 className="text-2xl font-bold mt-0.5">Welcome back, {user?.fullName?.split(' ')[0]} 👋</h1>
                <p className="text-sm text-white/80 mt-2 max-w-md">
                    Thank you for guiding the next generation of tech professionals in Rwanda.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="card p-5 flex items-center gap-4 hover:shadow-md transition-all">
                    <div className="h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 bg-orange-50 text-orange-600">
                        <Users className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-800">{sessions.length}</p>
                        <p className="text-sm text-slate-500">Total Requests</p>
                    </div>
                </div>
                <div className="card p-5 flex items-center gap-4 hover:shadow-md transition-all">
                    <div className="h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 bg-blue-50 text-blue-600">
                        <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-800">{upcomingSessions.length}</p>
                        <p className="text-sm text-slate-500">Upcoming</p>
                    </div>
                </div>
                <div className="card p-5 flex items-center gap-4 hover:shadow-md transition-all">
                    <div className="h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 bg-green-50 text-green-600">
                        <CheckCircle className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-800">{pastSessions.length}</p>
                        <p className="text-sm text-slate-500">Completed Sessions</p>
                    </div>
                </div>
            </div>

            <div className="card overflow-hidden mt-2">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <h2 className="font-semibold text-slate-800">Recent Session Requests</h2>
                </div>
                {sessions.length === 0 ? (
                    <div className="px-5 py-8 text-center">
                        <p className="text-sm text-slate-400">You don't have any mentorship requests yet.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {sessions.map(s => (
                            <div key={s.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-lg">
                                    {s.studentName ? s.studentName[0] : 'S'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-800">Meeting with {s.studentName}</p>
                                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                        <Clock className="h-3 w-3" /> {new Date(s.scheduledAt).toLocaleString()} ({s.durationMinutes} mins)
                                    </p>
                                </div>
                                <div>
                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${s.status === 'completed' ? 'bg-green-50 text-green-700' :
                                            s.status === 'scheduled' ? 'bg-blue-50 text-blue-700' :
                                                s.status === 'pending' ? 'bg-yellow-50 text-yellow-700' :
                                                    'bg-slate-100 text-slate-500'
                                        }`}>
                                        {s.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MentorDashboard;
