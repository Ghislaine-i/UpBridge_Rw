import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
    FileText,
    Briefcase,
    Building2,
    Clock,
    CheckCircle2,
    XCircle,
    Eye,
    AlertCircle,
    Trash2,
    Loader2,
} from 'lucide-react';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';
import applicationService from '../services/applicationService';

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
    submitted: {
        label: 'Submitted',
        icon: Clock,
        className: 'bg-blue-50 text-blue-700',
    },
    under_review: {
        label: 'Under Review',
        icon: Eye,
        className: 'bg-yellow-50 text-yellow-700',
    },
    shortlisted: {
        label: 'Shortlisted',
        icon: AlertCircle,
        className: 'bg-purple-50 text-purple-700',
    },
    accepted: {
        label: 'Accepted 🎉',
        icon: CheckCircle2,
        className: 'bg-green-50 text-green-700',
    },
    rejected: {
        label: 'Not Progressed',
        icon: XCircle,
        className: 'bg-red-50 text-red-600',
    },
};

const TYPE_LABELS = { job: 'Job', internship: 'Internship' };

const formatDate = (date) =>
    date
        ? new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        : '—';

// ─── Withdraw confirmation ────────────────────────────────────────────────────
const WithdrawDialog = ({ application, onConfirm, onCancel, loading }) => (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="h-12 w-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="h-6 w-6 text-red-500" />
            </div>
            <h3 className="text-center font-bold text-slate-800 mb-2">Withdraw Application?</h3>
            <p className="text-center text-sm text-slate-500 mb-6">
                You are about to withdraw your application for{' '}
                <span className="font-semibold text-slate-700">{application.opportunity_title}</span> at{' '}
                <span className="font-semibold text-slate-700">{application.company_name}</span>. This cannot be undone.
            </p>
            <div className="flex gap-3">
                <Button variant="outline" fullWidth onClick={onCancel} disabled={loading}>
                    Keep It
                </Button>
                <button
                    onClick={onConfirm}
                    disabled={loading}
                    className="flex-1 btn bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    Withdraw
                </button>
            </div>
        </div>
    </div>
);

// ─── Application card ─────────────────────────────────────────────────────────
const ApplicationCard = ({ application, onWithdraw }) => {
    const status = STATUS_CONFIG[application.status] || STATUS_CONFIG.submitted;
    const StatusIcon = status.icon;
    const canWithdraw = !['accepted', 'rejected'].includes(application.status);

    return (
        <div className="card p-5 hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-semibold text-slate-800 leading-snug line-clamp-1">
                            {application.opportunity_title}
                        </h3>
                        <p className="text-sm text-slate-500">{application.company_name}</p>
                    </div>
                </div>

                <span className={`shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold rounded-full px-2.5 py-1 ${status.className}`}>
                    <StatusIcon className="h-3 w-3" />
                    {status.label}
                </span>
            </div>

            {/* Meta */}
            <div className="flex flex-wrap gap-4 text-xs text-slate-500 mb-4">
                <span className="flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5" />
                    {TYPE_LABELS[application.type] || application.type}
                </span>
                {application.location && (
                    <span>{application.location}</span>
                )}
                <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    Applied {formatDate(application.applied_at)}
                </span>
            </div>

            {/* Cover note preview */}
            {application.cover_note && (
                <p className="text-sm text-slate-600 bg-slate-50 rounded-xl px-3.5 py-2.5 mb-4 line-clamp-2 italic">
                    "{application.cover_note}"
                </p>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3">
                <Link
                    to={`/opportunities/${application.opportunity_id}`}
                    className="text-xs font-medium text-primary hover:underline"
                >
                    View Listing →
                </Link>
                {canWithdraw && (
                    <button
                        onClick={() => onWithdraw(application)}
                        className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors ml-auto"
                    >
                        Withdraw
                    </button>
                )}
            </div>
        </div>
    );
};

// ─── Status filter tabs ───────────────────────────────────────────────────────
const STATUS_TABS = [
    { value: 'all', label: 'All' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'shortlisted', label: 'Shortlisted' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'rejected', label: 'Rejected' },
];

// ─── Applications Page ────────────────────────────────────────────────────────
const Applications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeStatus, setActiveStatus] = useState('all');
    const [withdrawTarget, setWithdrawTarget] = useState(null);
    const [withdrawing, setWithdrawing] = useState(false);

    const fetchApplications = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await applicationService.getMyApplications();
            setApplications(res.data);
        } catch {
            setError('Could not load your applications. Please refresh.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    const handleWithdrawConfirm = async () => {
        setWithdrawing(true);
        try {
            await applicationService.withdraw(withdrawTarget.id);
            setWithdrawTarget(null);
            fetchApplications();
        } catch (err) {
            alert(err.response?.data?.message || 'Could not withdraw application.');
        } finally {
            setWithdrawing(false);
        }
    };

    const filtered =
        activeStatus === 'all'
            ? applications
            : applications.filter((a) => a.status === activeStatus);

    // Count per status for badges
    const counts = applications.reduce((acc, a) => {
        acc[a.status] = (acc[a.status] || 0) + 1;
        return acc;
    }, {});

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">My Applications</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Track the status of every job and internship you've applied to.
                </p>
            </div>

            {/* Status tabs */}
            {!loading && !error && applications.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-1 mb-6">
                    {STATUS_TABS.map((tab) => {
                        const count = tab.value === 'all' ? applications.length : counts[tab.value] || 0;
                        return (
                            <button
                                key={tab.value}
                                onClick={() => setActiveStatus(tab.value)}
                                className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition ${activeStatus === tab.value
                                        ? 'bg-primary text-white border-primary'
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                                    }`}
                            >
                                {tab.label}
                                {count > 0 && (
                                    <span
                                        className={`h-5 min-w-5 px-1.5 rounded-full text-xs flex items-center justify-center ${activeStatus === tab.value ? 'bg-white/20' : 'bg-slate-100'
                                            }`}
                                    >
                                        {count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Content */}
            {loading ? (
                <LoadingSpinner label="Loading applications..." />
            ) : error ? (
                <EmptyState title="Something went wrong" description={error} />
            ) : applications.length === 0 ? (
                <EmptyState
                    icon={FileText}
                    title="No applications yet"
                    description="Browse opportunities and apply to internships or jobs that match your skills."
                    action={
                        <Link to="/opportunities">
                            <Button variant="primary">
                                <Briefcase className="h-4 w-4" />
                                Browse Opportunities
                            </Button>
                        </Link>
                    }
                />
            ) : filtered.length === 0 ? (
                <EmptyState
                    title="No applications in this category"
                    description={`You have no applications with status "${activeStatus.replace('_', ' ')}".`}
                />
            ) : (
                <div className="grid sm:grid-cols-2 gap-5">
                    {filtered.map((app) => (
                        <ApplicationCard
                            key={app.id}
                            application={app}
                            onWithdraw={setWithdrawTarget}
                        />
                    ))}
                </div>
            )}

            {/* Withdraw Dialog */}
            {withdrawTarget && (
                <WithdrawDialog
                    application={withdrawTarget}
                    loading={withdrawing}
                    onConfirm={handleWithdrawConfirm}
                    onCancel={() => setWithdrawTarget(null)}
                />
            )}
        </div>
    );
};

export default Applications;
