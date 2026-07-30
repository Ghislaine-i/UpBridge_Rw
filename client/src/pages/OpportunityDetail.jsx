import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    ChevronLeft,
    Building2,
    MapPin,
    Clock,
    Briefcase,
    Wifi,
    MonitorSmartphone,
    CheckCircle2,
    Loader2,
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';
import InputField from '../components/InputField';
import opportunityService from '../services/opportunityService';
import applicationService from '../services/applicationService';
import { useAuth } from '../context/AuthContext';

const WORK_MODE_ICONS = {
    remote: Wifi,
    onsite: Building2,
    hybrid: MonitorSmartphone,
};

const TYPE_COLORS = {
    internship: 'bg-purple-50 text-purple-700',
    job: 'bg-green-50 text-green-700',
};

const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : null;

// ─── Apply Modal ──────────────────────────────────────────────────────────────
const ApplyModal = ({ opp, onClose, onSuccess }) => {
    const [form, setForm] = useState({ coverNote: '', resumeUrl: '' });
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [serverError, setServerError] = useState('');

    const validate = () => {
        const errs = {};
        if (form.resumeUrl && !/^https?:\/\/.+/.test(form.resumeUrl))
            errs.resumeUrl = 'Must be a valid URL.';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');
        if (!validate()) return;
        setSaving(true);
        try {
            await applicationService.apply({
                opportunityId: opp.id,
                coverNote: form.coverNote || undefined,
                resumeUrl: form.resumeUrl || undefined,
            });
            onSuccess();
        } catch (err) {
            setServerError(err.response?.data?.message || 'Could not submit application.');
        } finally {
            setSaving(false);
        }
    };

    const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose(); };

    return (
        <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={handleBackdrop}
        >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="font-bold text-slate-800">Apply to {opp.title}</h2>
                    <p className="text-sm text-slate-500 mt-0.5">{opp.company_name}</p>
                </div>
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                    {serverError && (
                        <div className="rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3">
                            {serverError}
                        </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="coverNote" className="text-sm font-medium text-slate-700">
                            Cover note <span className="text-slate-400 font-normal">(optional)</span>
                        </label>
                        <textarea
                            id="coverNote"
                            rows={4}
                            maxLength={1000}
                            placeholder="Briefly explain why you're a great fit for this role..."
                            value={form.coverNote}
                            onChange={(e) => setForm({ ...form, coverNote: e.target.value })}
                            className="input-field resize-none"
                        />
                        <span className="text-xs text-slate-400 text-right">{form.coverNote.length}/1000</span>
                    </div>

                    <InputField
                        label="Resume / CV URL (optional)"
                        id="resumeUrl"
                        placeholder="https://drive.google.com/..."
                        value={form.resumeUrl}
                        onChange={(e) => setForm({ ...form, resumeUrl: e.target.value })}
                        error={errors.resumeUrl}
                    />

                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="outline" fullWidth onClick={onClose}>Cancel</Button>
                        <Button type="submit" fullWidth loading={saving}>Submit Application</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ─── Main page ────────────────────────────────────────────────────────────────
const OpportunityDetail = () => {
    const { id } = useParams();
    const { isAuthenticated } = useAuth();
    const [opp, setOpp] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [applied, setApplied] = useState(false);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const res = await opportunityService.getOpportunityById(id);
                setOpp(res.data);
            } catch {
                setError('This opportunity could not be found.');
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    if (loading) return <LoadingSpinner label="Loading opportunity..." />;
    if (error || !opp) {
        return (
            <EmptyState
                title="Opportunity not found"
                description={error}
                action={
                    <Link to="/opportunities">
                        <Button variant="outline">Back to Opportunities</Button>
                    </Link>
                }
            />
        );
    }

    const WorkIcon = WORK_MODE_ICONS[opp.work_mode] || Building2;

    return (
        <div className="max-w-3xl">
            <Link
                to="/opportunities"
                className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary mb-5 transition-colors"
            >
                <ChevronLeft className="h-4 w-4" /> Back to Opportunities
            </Link>

            <div className="card overflow-hidden">
                {/* Header banner */}
                <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
                    <div className="flex items-start gap-4">
                        {opp.company_logo_url ? (
                            <img
                                src={opp.company_logo_url}
                                alt={opp.company_name}
                                className="h-14 w-14 rounded-xl object-contain bg-white p-1"
                            />
                        ) : (
                            <div className="h-14 w-14 rounded-xl bg-white/20 flex items-center justify-center">
                                <Building2 className="h-7 w-7 text-white" />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <span
                                className={`inline-block text-xs font-semibold rounded-full px-2.5 py-1 capitalize mb-2 ${TYPE_COLORS[opp.type] || 'bg-white/20 text-white'
                                    }`}
                            >
                                {opp.type}
                            </span>
                            <h1 className="text-xl font-bold leading-snug">{opp.title}</h1>
                            <p className="text-white/80 text-sm mt-1">{opp.company_name}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 sm:p-8">
                    {/* Meta row */}
                    <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-6 pb-6 border-b border-slate-100">
                        {opp.location && (
                            <span className="flex items-center gap-1.5">
                                <MapPin className="h-4 w-4 text-slate-400" />
                                {opp.location}
                            </span>
                        )}
                        <span className="flex items-center gap-1.5 capitalize">
                            <WorkIcon className="h-4 w-4 text-slate-400" />
                            {opp.work_mode}
                        </span>
                        {opp.category && (
                            <span className="flex items-center gap-1.5">
                                <Briefcase className="h-4 w-4 text-slate-400" />
                                {opp.category}
                            </span>
                        )}
                        {opp.salary_range && (
                            <span className="font-semibold text-primary">{opp.salary_range}</span>
                        )}
                        {opp.deadline && (
                            <span className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4 text-slate-400" />
                                Deadline: {formatDate(opp.deadline)}
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    <section className="mb-6">
                        <h2 className="font-semibold text-slate-800 mb-3">About this role</h2>
                        <p className="text-slate-600 leading-relaxed whitespace-pre-line">{opp.description}</p>
                    </section>

                    {/* Requirements */}
                    {opp.requirements && (
                        <section className="mb-8">
                            <h2 className="font-semibold text-slate-800 mb-3">Requirements</h2>
                            <p className="text-slate-600 leading-relaxed whitespace-pre-line">{opp.requirements}</p>
                        </section>
                    )}

                    {/* Apply CTA */}
                    {applied ? (
                        <div className="flex items-center gap-3 text-accent font-semibold">
                            <CheckCircle2 className="h-5 w-5" />
                            Application submitted! View it in{' '}
                            <Link to="/applications" className="underline">
                                My Applications
                            </Link>
                            .
                        </div>
                    ) : isAuthenticated ? (
                        <Button variant="primary" className="px-8" onClick={() => setShowApplyModal(true)}>
                            Apply Now
                        </Button>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/login">
                                <Button variant="primary" className="px-8">Log In to Apply</Button>
                            </Link>
                            <Link to="/register" className="text-sm text-primary hover:underline">
                                Create account
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Apply Modal */}
            {showApplyModal && (
                <ApplyModal
                    opp={opp}
                    onClose={() => setShowApplyModal(false)}
                    onSuccess={() => {
                        setShowApplyModal(false);
                        setApplied(true);
                    }}
                />
            )}
        </div>
    );
};

export default OpportunityDetail;
