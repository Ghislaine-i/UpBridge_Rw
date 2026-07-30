import React, { useState } from 'react';
import {
    User,
    Mail,
    Phone,
    MapPin,
    FileText,
    CheckCircle2,
    AlertCircle,
    Camera,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import InputField from '../components/InputField';
import Button from '../components/Button';
import api from '../services/api';

// ─── Inline alert helpers ─────────────────────────────────────────────────────
const Alert = ({ type, message }) => {
    if (!message) return null;
    const styles =
        type === 'success'
            ? 'bg-green-50 border-green-200 text-green-700'
            : 'bg-red-50 border-red-200 text-red-600';
    const Icon = type === 'success' ? CheckCircle2 : AlertCircle;
    return (
        <div className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm ${styles}`}>
            <Icon className="h-4 w-4 shrink-0" />
            {message}
        </div>
    );
};

// ─── Avatar / initials display ────────────────────────────────────────────────
const Avatar = ({ user }) => {
    const initials = user?.fullName
        ? user.fullName
            .split(' ')
            .slice(0, 2)
            .map((n) => n[0])
            .join('')
            .toUpperCase()
        : 'U';

    return (
        <div className="relative inline-block">
            {user?.avatarUrl ? (
                <img
                    src={user.avatarUrl}
                    alt={user.fullName}
                    className="h-24 w-24 rounded-full object-cover ring-4 ring-white shadow-md"
                />
            ) : (
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center ring-4 ring-white shadow-md">
                    <span className="text-2xl font-bold text-white">{initials}</span>
                </div>
            )}
            <div className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-primary flex items-center justify-center shadow ring-2 ring-white">
                <Camera className="h-3.5 w-3.5 text-white" />
            </div>
        </div>
    );
};

// ─── Tab: Edit Profile Info ───────────────────────────────────────────────────
const EditProfileTab = ({ user, onUpdated }) => {
    const [form, setForm] = useState({
        fullName: user?.fullName || '',
        headline: user?.headline || '',
        bio: user?.bio || '',
        phone: user?.phone || '',
        location: user?.location || '',
        avatarUrl: user?.avatarUrl || '',
    });
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [alert, setAlert] = useState({ type: '', message: '' });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
        setAlert({ type: '', message: '' });
    };

    const validate = () => {
        const errs = {};
        if (!form.fullName.trim()) errs.fullName = 'Full name is required.';
        if (form.avatarUrl && !/^https?:\/\/.+/.test(form.avatarUrl))
            errs.avatarUrl = 'Must be a valid URL starting with http(s)://';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setSaving(true);
        setAlert({ type: '', message: '' });
        try {
            const { data } = await api.put('/profile', {
                fullName: form.fullName,
                headline: form.headline || undefined,
                bio: form.bio || undefined,
                phone: form.phone || undefined,
                location: form.location || undefined,
                avatarUrl: form.avatarUrl || undefined,
            });
            setAlert({ type: 'success', message: 'Profile updated successfully.' });
            onUpdated(data.data);
        } catch (err) {
            setAlert({
                type: 'error',
                message: err.response?.data?.message || 'Could not update profile. Please try again.',
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Alert type={alert.type} message={alert.message} />

            <div className="grid sm:grid-cols-2 gap-5">
                <InputField
                    label="Full name *"
                    id="fullName"
                    name="fullName"
                    placeholder="Uwase Diane"
                    value={form.fullName}
                    onChange={handleChange}
                    error={errors.fullName}
                />
                <InputField
                    label="Headline"
                    id="headline"
                    name="headline"
                    placeholder="e.g. Software Engineering Student at UR"
                    value={form.headline}
                    onChange={handleChange}
                    error={errors.headline}
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <label htmlFor="bio" className="text-sm font-medium text-slate-700">
                    Bio
                </label>
                <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    placeholder="Tell mentors and employers a little about yourself..."
                    value={form.bio}
                    onChange={handleChange}
                    className="input-field resize-none"
                />
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
                <InputField
                    label="Phone"
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+250 780 000 000"
                    value={form.phone}
                    onChange={handleChange}
                />
                <InputField
                    label="Location"
                    id="location"
                    name="location"
                    placeholder="Kigali, Rwanda"
                    value={form.location}
                    onChange={handleChange}
                />
            </div>

            <InputField
                label="Avatar URL"
                id="avatarUrl"
                name="avatarUrl"
                placeholder="https://i.imgur.com/yourphoto.jpg"
                value={form.avatarUrl}
                onChange={handleChange}
                error={errors.avatarUrl}
            />
            <p className="text-xs text-slate-400 -mt-3">
                Paste a direct link to an image (Imgur, Cloudinary, etc.)
            </p>

            <div className="flex justify-end pt-1">
                <Button type="submit" loading={saving} className="px-8">
                    Save Changes
                </Button>
            </div>
        </form>
    );
};

// ─── Tab: Change Password ─────────────────────────────────────────────────────
const ChangePasswordTab = () => {
    const [form, setForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [alert, setAlert] = useState({ type: '', message: '' });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
        setAlert({ type: '', message: '' });
    };

    const validate = () => {
        const errs = {};
        if (!form.currentPassword) errs.currentPassword = 'Current password is required.';
        if (form.newPassword.length < 6) errs.newPassword = 'New password must be at least 6 characters.';
        if (form.confirmPassword !== form.newPassword) errs.confirmPassword = 'Passwords do not match.';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setSaving(true);
        setAlert({ type: '', message: '' });
        try {
            await api.put('/profile/password', {
                currentPassword: form.currentPassword,
                newPassword: form.newPassword,
            });
            setAlert({ type: 'success', message: 'Password changed successfully.' });
            setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setAlert({
                type: 'error',
                message: err.response?.data?.message || 'Could not change password. Please try again.',
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-md">
            <Alert type={alert.type} message={alert.message} />

            <InputField
                label="Current password"
                id="currentPassword"
                name="currentPassword"
                type="password"
                placeholder="••••••••"
                value={form.currentPassword}
                onChange={handleChange}
                error={errors.currentPassword}
            />
            <InputField
                label="New password"
                id="newPassword"
                name="newPassword"
                type="password"
                placeholder="••••••••"
                value={form.newPassword}
                onChange={handleChange}
                error={errors.newPassword}
            />
            <InputField
                label="Confirm new password"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
            />

            <div className="flex justify-end pt-1">
                <Button type="submit" loading={saving} className="px-8">
                    Change Password
                </Button>
            </div>
        </form>
    );
};

// ─── Info row (read-only summary card) ───────────────────────────────────────
const InfoRow = ({ icon: Icon, label, value }) => {
    if (!value) return null;
    return (
        <div className="flex items-center gap-3 text-sm">
            <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                <Icon className="h-4 w-4 text-slate-400" />
            </div>
            <div>
                <p className="text-xs text-slate-400">{label}</p>
                <p className="font-medium text-slate-700">{value}</p>
            </div>
        </div>
    );
};

// ─── TABS config ───────────────────────────────────────────────────────────────
const TABS = [
    { id: 'info', label: 'Edit Profile' },
    { id: 'password', label: 'Change Password' },
];

// ─── Main Profile Page ────────────────────────────────────────────────────────
const Profile = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('info');
    const [profileData, setProfileData] = useState(user);

    // After a successful update we refresh both local state and AuthContext
    const handleUpdated = (updatedUser) => {
        // updatedUser comes back as snake_case from the DB select in profileController
        const mapped = {
            id: updatedUser.id,
            fullName: updatedUser.full_name,
            email: updatedUser.email,
            role: updatedUser.role,
            avatarUrl: updatedUser.avatar_url,
            headline: updatedUser.headline,
            bio: updatedUser.bio,
            phone: updatedUser.phone,
            location: updatedUser.location,
        };
        setProfileData(mapped);
        // Persist to localStorage so AuthContext re-hydrates correctly on reload
        localStorage.setItem('upbridge_user', JSON.stringify(mapped));
    };

    const roleLabels = { student: 'Student', mentor: 'Mentor', admin: 'Administrator' };

    return (
        <div className="max-w-4xl">
            {/* Page header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Manage your personal information and account settings.
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* ── Left: summary card ─────────────────────────────────────────── */}
                <div className="lg:col-span-1">
                    <div className="card p-6 flex flex-col items-center text-center gap-4">
                        <Avatar user={profileData} />
                        <div>
                            <h2 className="font-bold text-slate-800 text-lg leading-tight">
                                {profileData?.fullName || 'Your Name'}
                            </h2>
                            {profileData?.headline && (
                                <p className="text-sm text-slate-500 mt-1">{profileData.headline}</p>
                            )}
                            <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold capitalize">
                                {roleLabels[profileData?.role] || profileData?.role}
                            </span>
                        </div>

                        <div className="w-full border-t border-slate-100 pt-4 flex flex-col gap-3 text-left">
                            <InfoRow icon={Mail} label="Email" value={profileData?.email} />
                            <InfoRow icon={Phone} label="Phone" value={profileData?.phone} />
                            <InfoRow icon={MapPin} label="Location" value={profileData?.location} />
                            {profileData?.bio && (
                                <div className="flex items-start gap-3 text-sm">
                                    <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 mt-0.5">
                                        <FileText className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400">Bio</p>
                                        <p className="text-slate-600 text-xs leading-relaxed line-clamp-4">
                                            {profileData.bio}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Right: tabs + forms ────────────────────────────────────────── */}
                <div className="lg:col-span-2">
                    <div className="card overflow-hidden">
                        {/* Tab bar */}
                        <div className="flex border-b border-slate-100">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 sm:flex-none px-6 py-3.5 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-slate-500 hover:text-slate-700'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab content */}
                        <div className="p-6">
                            {activeTab === 'info' && (
                                <EditProfileTab user={profileData} onUpdated={handleUpdated} />
                            )}
                            {activeTab === 'password' && <ChangePasswordTab />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
