import React, { useState, useEffect, useCallback } from 'react';
import { Users } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import mentorService from '../services/mentorService';
import Button from '../components/Button';

const Mentorship = () => {
    const [mentors, setMentors] = useState([]);
    const [expertiseList, setExpertiseList] = useState(['All']);
    const [search, setSearch] = useState('');
    const [expertise, setExpertise] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        mentorService
            .getExpertiseList()
            .then((res) => setExpertiseList(res.data))
            .catch(() => setExpertiseList(['All']));
    }, []);

    const fetchMentors = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await mentorService.getMentors({ search, expertise: expertise !== 'All' ? expertise : undefined });
            setMentors(res.data);
        } catch (err) {
            setError('Could not load mentors. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [search, expertise]);

    useEffect(() => {
        const timeout = setTimeout(fetchMentors, 300); // debounce search
        return () => clearTimeout(timeout);
    }, [fetchMentors]);

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Mentorship</h1>
                    <p className="text-sm text-slate-500 mt-1">Connect with experienced professionals for guidance.</p>
                </div>
                <SearchBar value={search} onChange={setSearch} placeholder="Search mentors..." className="sm:w-72" />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
                {expertiseList.map((exp) => (
                    <button
                        key={exp}
                        onClick={() => setExpertise(exp)}
                        className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition ${expertise === exp
                                ? 'bg-primary text-white border-primary'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                            }`}
                    >
                        {exp}
                    </button>
                ))}
            </div>

            {loading ? (
                <LoadingSpinner label="Loading mentors..." />
            ) : error ? (
                <EmptyState title="Something went wrong" description={error} />
            ) : mentors.length === 0 ? (
                <EmptyState
                    icon={Users}
                    title="No mentors found"
                    description="Try adjusting your search or filter to find what you're looking for."
                />
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {mentors.map((mentor) => (
                        <div key={mentor.id} className="card p-5 hover:shadow-md transition flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-full bg-slate-200 mb-4 overflow-hidden">
                                {mentor.avatarUrl ? (
                                    <img src={mentor.avatarUrl} alt={mentor.fullName} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-xl uppercase">
                                        {mentor.fullName[0]}
                                    </div>
                                )}
                            </div>
                            <h3 className="font-bold text-lg text-slate-800">{mentor.fullName}</h3>
                            <p className="text-sm text-primary mb-1">{mentor.headline}</p>
                            <p className="text-xs text-slate-500 mb-4">{mentor.company} • {mentor.location}</p>
                            <Button variant="outline" fullWidth onClick={() => alert('Booking feature coming soon!')}>
                                Book Session
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Mentorship;
