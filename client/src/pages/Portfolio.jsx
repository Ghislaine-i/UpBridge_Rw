import React, { useState, useEffect, useCallback } from 'react';
import {
    FolderGit2,
    Plus,
    ExternalLink,
    Github,
    Pencil,
    Trash2,
    X,
    Loader2,
    Code2,
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';
import InputField from '../components/InputField';
import portfolioService from '../services/portfolioService';

// ─── Tech badge ───────────────────────────────────────────────────────────────
const TechBadge = ({ tech }) => (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
        <Code2 className="h-3 w-3" />
        {tech.trim()}
    </span>
);

// ─── Project card ─────────────────────────────────────────────────────────────
const ProjectCard = ({ project, onEdit, onDelete }) => {
    const techs = project.technologies_used
        ? project.technologies_used.split(',').filter(Boolean)
        : [];

    return (
        <div className="card overflow-hidden flex flex-col group hover:shadow-lg transition-shadow duration-300">
            {/* Cover image / gradient */}
            <div className="h-40 bg-slate-100 relative overflow-hidden">
                {project.cover_image_url ? (
                    <img
                        src={project.cover_image_url}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <FolderGit2 className="h-12 w-12 text-white/60" />
                    </div>
                )}

                {/* Edit / Delete actions */}
                <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onEdit(project)}
                        aria-label="Edit project"
                        className="h-8 w-8 rounded-lg bg-white/90 backdrop-blur text-slate-600 hover:text-primary flex items-center justify-center shadow-sm transition-colors"
                    >
                        <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                        onClick={() => onDelete(project)}
                        aria-label="Delete project"
                        className="h-8 w-8 rounded-lg bg-white/90 backdrop-blur text-slate-600 hover:text-red-500 flex items-center justify-center shadow-sm transition-colors"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>

            <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-slate-800 leading-snug">{project.title}</h3>
                <p className="text-sm text-slate-500 mt-1.5 line-clamp-2 flex-1">{project.description}</p>

                {/* Tech stack */}
                {techs.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                        {techs.slice(0, 4).map((t) => (
                            <TechBadge key={t} tech={t} />
                        ))}
                        {techs.length > 4 && (
                            <span className="text-xs text-slate-400">+{techs.length - 4} more</span>
                        )}
                    </div>
                )}

                {/* Links */}
                <div className="flex gap-3 mt-4">
                    {project.github_link && (
                        <a
                            href={project.github_link}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-primary transition-colors"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Github className="h-3.5 w-3.5" />
                            GitHub
                        </a>
                    )}
                    {project.live_demo_link && (
                        <a
                            href={project.live_demo_link}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-accent transition-colors"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ExternalLink className="h-3.5 w-3.5" />
                            Live Demo
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── Project form modal ───────────────────────────────────────────────────────
const INITIAL_FORM = {
    title: '',
    description: '',
    githubLink: '',
    liveDemoLink: '',
    technologiesUsed: '',
    coverImageUrl: '',
};

const ProjectModal = ({ project, onClose, onSaved }) => {
    const isEditing = !!project;
    const [form, setForm] = useState(
        isEditing
            ? {
                title: project.title || '',
                description: project.description || '',
                githubLink: project.github_link || '',
                liveDemoLink: project.live_demo_link || '',
                technologiesUsed: project.technologies_used || '',
                coverImageUrl: project.cover_image_url || '',
            }
            : { ...INITIAL_FORM }
    );
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [serverError, setServerError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validate = () => {
        const errs = {};
        if (!form.title.trim()) errs.title = 'Title is required.';
        if (!form.description.trim()) errs.description = 'Description is required.';
        if (form.githubLink && !/^https?:\/\/.+/.test(form.githubLink))
            errs.githubLink = 'Must be a valid URL starting with http(s)://';
        if (form.liveDemoLink && !/^https?:\/\/.+/.test(form.liveDemoLink))
            errs.liveDemoLink = 'Must be a valid URL starting with http(s)://';
        if (form.coverImageUrl && !/^https?:\/\/.+/.test(form.coverImageUrl))
            errs.coverImageUrl = 'Must be a valid URL starting with http(s)://';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');
        if (!validate()) return;

        setSaving(true);
        try {
            if (isEditing) {
                await portfolioService.updateProject(project.id, form);
            } else {
                await portfolioService.createProject(form);
            }
            onSaved();
        } catch (err) {
            setServerError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    // Close modal on backdrop click
    const handleBackdrop = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={handleBackdrop}
        >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h2 className="font-bold text-slate-800">{isEditing ? 'Edit Project' : 'Add New Project'}</h2>
                    <button
                        onClick={onClose}
                        className="h-8 w-8 rounded-lg text-slate-400 hover:bg-slate-100 flex items-center justify-center transition-colors"
                        aria-label="Close"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                    {serverError && (
                        <div className="rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3">
                            {serverError}
                        </div>
                    )}

                    <InputField
                        label="Project title *"
                        id="title"
                        name="title"
                        placeholder="My Awesome Project"
                        value={form.title}
                        onChange={handleChange}
                        error={errors.title}
                    />

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="description" className="text-sm font-medium text-slate-700">
                            Description *
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={3}
                            placeholder="Describe what you built and the problem it solves..."
                            value={form.description}
                            onChange={handleChange}
                            className={`input-field resize-none ${errors.description ? 'border-red-400 focus:ring-red-200' : ''}`}
                        />
                        {errors.description && <span className="text-xs text-red-500">{errors.description}</span>}
                    </div>

                    <InputField
                        label="Technologies used"
                        id="technologiesUsed"
                        name="technologiesUsed"
                        placeholder="React, Node.js, MySQL, Tailwind CSS"
                        value={form.technologiesUsed}
                        onChange={handleChange}
                        error={errors.technologiesUsed}
                    />
                    <p className="text-xs text-slate-400 -mt-2">Separate technologies with commas.</p>

                    <InputField
                        label="GitHub repository URL"
                        id="githubLink"
                        name="githubLink"
                        placeholder="https://github.com/username/repo"
                        value={form.githubLink}
                        onChange={handleChange}
                        error={errors.githubLink}
                    />

                    <InputField
                        label="Live demo URL"
                        id="liveDemoLink"
                        name="liveDemoLink"
                        placeholder="https://myproject.vercel.app"
                        value={form.liveDemoLink}
                        onChange={handleChange}
                        error={errors.liveDemoLink}
                    />

                    <InputField
                        label="Cover image URL"
                        id="coverImageUrl"
                        name="coverImageUrl"
                        placeholder="https://i.imgur.com/example.png"
                        value={form.coverImageUrl}
                        onChange={handleChange}
                        error={errors.coverImageUrl}
                    />

                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="outline" fullWidth onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" fullWidth loading={saving}>
                            {isEditing ? 'Save Changes' : 'Add Project'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ─── Delete confirmation dialog ───────────────────────────────────────────────
const DeleteDialog = ({ project, onConfirm, onCancel, loading }) => (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="h-12 w-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="h-6 w-6 text-red-500" />
            </div>
            <h3 className="text-center font-bold text-slate-800 mb-2">Delete Project?</h3>
            <p className="text-center text-sm text-slate-500 mb-6">
                Are you sure you want to delete <span className="font-semibold text-slate-700">{project.title}</span>? This
                cannot be undone.
            </p>
            <div className="flex gap-3">
                <Button variant="outline" fullWidth onClick={onCancel} disabled={loading}>
                    Cancel
                </Button>
                <button
                    onClick={onConfirm}
                    disabled={loading}
                    className="flex-1 btn bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Delete
                </button>
            </div>
        </div>
    </div>
);

// ─── Main Portfolio page ──────────────────────────────────────────────────────
const Portfolio = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [modalProject, setModalProject] = useState(undefined); // undefined = closed, null = new, obj = edit
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await portfolioService.getMyProjects();
            setProjects(res.data);
        } catch {
            setError('Could not load your projects. Please refresh the page.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const handleSaved = () => {
        setModalProject(undefined);
        fetchProjects();
    };

    const handleDeleteConfirm = async () => {
        setDeleting(true);
        try {
            await portfolioService.deleteProject(deleteTarget.id);
            setDeleteTarget(null);
            fetchProjects();
        } catch {
            // Silently fail — could toast here
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">My Portfolio</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Showcase your projects with GitHub links and live demos.
                    </p>
                </div>
                <Button variant="primary" onClick={() => setModalProject(null)}>
                    <Plus className="h-4 w-4" />
                    Add Project
                </Button>
            </div>

            {/* Content */}
            {loading ? (
                <LoadingSpinner label="Loading your projects..." />
            ) : error ? (
                <EmptyState title="Could not load projects" description={error} />
            ) : projects.length === 0 ? (
                <EmptyState
                    icon={FolderGit2}
                    title="No projects yet"
                    description="Add your first project to start building a portfolio that stands out to employers."
                    action={
                        <Button variant="primary" onClick={() => setModalProject(null)}>
                            <Plus className="h-4 w-4" />
                            Add Your First Project
                        </Button>
                    }
                />
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {projects.map((p) => (
                        <ProjectCard
                            key={p.id}
                            project={p}
                            onEdit={(proj) => setModalProject(proj)}
                            onDelete={(proj) => setDeleteTarget(proj)}
                        />
                    ))}
                </div>
            )}

            {/* Modals */}
            {modalProject !== undefined && (
                <ProjectModal
                    project={modalProject}
                    onClose={() => setModalProject(undefined)}
                    onSaved={handleSaved}
                />
            )}
            {deleteTarget && (
                <DeleteDialog
                    project={deleteTarget}
                    loading={deleting}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}
        </div>
    );
};

export default Portfolio;
