import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { backend } from '../services/backend';
import './SectionEditor.css'; // Reuse form styles

const BlogEditor = ({ blogId, existingData, onSave, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, setValue } = useForm();

    useEffect(() => {
        if (existingData) {
            setValue('title', existingData.title);
            setValue('slug', existingData.slug);
            setValue('excerpt', existingData.excerpt);
            setValue('content', existingData.content);
            setValue('cover_image', existingData.cover_image);
            setValue('published_at', existingData.published_at ? existingData.published_at.split('T')[0] : '');
        }
    }, [existingData, setValue]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const blogData = {
                ...data,
                id: blogId,
                // If date is empty, set null (Draft)
                published_at: data.published_at || null
            };

            await backend.saveBlog(blogData);
            if (onSave) onSave();
        } catch (e) {
            console.error(e);
            alert('Save failed: ' + e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const url = await backend.uploadMedia(file);
            setValue('cover_image', url);
            alert("Cover image uploaded!");
        } catch (err) {
            alert("Upload failed");
        }
    };

    return (
        <div className="section-editor">
            <h3>{blogId ? 'Edit Post' : 'New Post'}</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-row">
                    <label>Title</label>
                    <input {...register('title', { required: true })} />
                </div>

                <div className="form-row">
                    <label>Slug (URL Path)</label>
                    <input {...register('slug', { required: true })} />
                </div>

                <div className="form-row">
                    <label>Excerpt & SEO Description</label>
                    <textarea {...register('excerpt')} rows={3} />
                </div>

                <div className="form-row">
                    <label>Content (Markdown)</label>
                    <textarea {...register('content')} rows={20} style={{ fontFamily: 'monospace' }} />
                </div>

                <div className="form-row">
                    <label>Cover Image URL</label>
                    <input {...register('cover_image')} placeholder="Upload or paste URL" />
                    <input type="file" onChange={handleFileUpload} style={{ marginTop: '0.5rem' }} />
                </div>

                <div className="form-row">
                    <label>Publish Date (Leave empty for Draft)</label>
                    <input type="date" {...register('published_at')} />
                </div>

                <div className="actions">
                    <button type="submit" disabled={loading}>Save Post</button>
                    <button type="button" onClick={onCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default BlogEditor;
