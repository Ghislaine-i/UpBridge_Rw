import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
    Briefcase,
    MapPin,
    Clock,
    Building2,
    Wifi,
    MonitorSmartphone,
    Search,
    Filter,
} from 'lucide-react';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import opportunityService from '../services/opportunityService';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const TYPE_COLORS = {
    internship: 'bg-purple-50 text-purple-700',
    job: 'bg-green-50 text-green-700',
};

const WORK_MODE_ICONS = {
    remote: Wifi,
    onsite: Building2,
    hybrid: MonitorSmartphone,
};

const formatDeadline = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const isDeadlineSoon = (date) => {
    if (!date) return false;
    const diff = new Date(date) - new Date();
    return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000; // within 7 days
};

// ─── Opportunity Card ─────────────────────────────────────────────────────────
const OpportunityCard = ({ opp }) => {
    const WorkIcon = WORK_MODE_ICONS[opp.work_mode] || Building2;
    const deadline = formatDeadline(opp.deadline);
    const soon = isDeadlineSoon(opp.deadline);

    return (
        <Link
            to={`/opportunities/${opp.id}`}
            className="card p-5 flex flex-col gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
        >
            {/* Company and type */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    {opp.company_logo_url ? (
                        <img
                            src={opp.company_logo_url}
                            alt={opp.company_name}
                            className="h-10 w-10 rounded-xl object-contain border border-slate-100 bg-white"
                        />
                    ) : (
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-primary" />
                        </div>
                    )}
                    <div>
                        <p className="text-xs text-slate-500">{opp.company_name}</p>
                        <h3 className="font-semibold text-slate-800 leading-snug group-hover:text-primary transition-colors line-clamp-1">
                            {opp.title}
                        </h3>
                    </div>
                </div>
                <span className={`shrink-0 text-xs font-semibold rounded-full px-2.5 py-1 capitalize ${TYPE_COLORS[opp.type] || 'bg-slate-100 text-slate-600'}`}>
                    {opp.type}
                </span>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-500 line-clamp-2">{opp.description}</p>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                {opp.location && (
                    <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {opp.location}
                    </span>
                )}
                <span className="flex items-center gap-1 capitalize">
                    <WorkIcon className="h-3.5 w-3.5" />
                    {opp.work_mode}
                </span>
                {opp.salary_range && (
                    <span className="font-medium text-slate-700">{opp.salary_range}</span>
                )}
            </div>

            {/* Deadline */}
            {deadline && (
                <div className={`flex items-center gap-1.5 text-xs font-medium ${soon ? 'text-red-500' : 'text-slate-400'}`}>
                    <Clock className="h-3.5 w-3.5" />
                    Deadline: {deadline} {soon && '⚠️ Closing soon!'}
                </div>
            )}
        </Link>
    );
};

// ─── Opportunities Page ───────────────────────────────────────────────────────
const TYPE_FILTERS = [
    { value: 'all', label: 'All Types' },
    { value: 'job', label: 'Jobs' },
    { value: 'internship', label: 'Internships' },
];

const WORK_MODE_FILTERS = [
    { value: 'all', label: 'Any Mode' },
    { value: 'onsite', label: 'On-site' },
    { value: 'remote', label: 'Remote' },
    { value: 'hybrid', label: 'Hybrid' },
];

const Opportunities = () => {
    const [opportunities, setOpportunities] = useState([]);
    const [categories, setCategories] = useState(['All']);
    const [search, setSearch] = useState('');
    const [type, setType] = useState('all');
    const [category, setCategory] = useState('All');
    const [workMode, setWorkMode] = useState('all');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        opportunityService
            .getCategories()
            .then((res) => setCategories(res.data))
            .catch(() => setCategories(['All']));
    }, []);

    const fetchOpportunities = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await opportunityService.getOpportunities({ search, type, category, workMode, page, limit: 9 });
            setOpportunities(res.data);
            setTotalPages(res.pagination.totalPages);
            setTotal(res.pagination.total);
        } catch {
            setError('Could not load opportunities. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [search, type, category, workMode, page]);

    useEffect(() => {
        const t = setTimeout(fetchOpportunities, 300);
        return () => clearTimeout(t);
    }, [fetchOpportunities]);

    useEffect(() => {
        setPage(1);
    }, [search, type, category, workMode]);

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Opportunities</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Discover internships and jobs matched to your skills.
                        {!loading && total > 0 && (
                            <span className="ml-2 font-medium text-slate-700">{total} listing{total !== 1 ? 's' : ''}</span>
                        )}
                    </p>
                </div>

                <div className="flex gap-2">
                    <SearchBar value={search} onChange={setSearch} placeholder="Search jobs..." className="sm:w-64" />
                    <button
                        onClick={() => setShowFilters((f) => !f)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${showFilters ? 'bg-primary text-white border-primary' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                            }`}
                    >
                        <Filter className="h-4 w-4" />
                        Filters
                    </button>
                </div>
            </div>

            {/* Filter panel */}
            {showFilters && (
                <div className="card p-4 mb-6 grid sm:grid-cols-3 gap-4 animate-in slide-in-from-top-2 duration-200">
                    {/* Type */}
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Type</p>
                        <div className="flex gap-2 flex-wrap">
                            {TYPE_FILTERS.map((f) => (
                                <button
                                    key={f.value}
                                    onClick={() => setType(f.value)}
                                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${type === f.value
                                            ? 'bg-primary text-white border-primary'
                                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                                        }`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Work mode */}
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Work Mode</p>
                        <div className="flex gap-2 flex-wrap">
                            {WORK_MODE_FILTERS.map((f) => (
                                <button
                                    key={f.value}
                                    onClick={() => setWorkMode(f.value)}
                                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${workMode === f.value
                                            ? 'bg-primary text-white border-primary'
                                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                                        }`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Category</p>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="input-field text-sm"
                        >
                            {categories.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {/* Content */}
            {loading ? (
                <LoadingSpinner label="Loading opportunities..." />
            ) : error ? (
                <EmptyState title="Something went wrong" description={error} />
            ) : opportunities.length === 0 ? (
                <EmptyState
                    icon={Briefcase}
                    title="No opportunities found"
                    description="Try adjusting your search or filters to find relevant listings."
                />
            ) : (
                <>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {opportunities.map((opp) => (
                            <OpportunityCard key={opp.id} opp={opp} />
                        ))}
                    </div>
                    <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                </>
            )}
        </div>
    );
};

export default Opportunities;
