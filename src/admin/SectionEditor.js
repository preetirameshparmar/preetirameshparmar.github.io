// src/admin/SectionEditor.js
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { backend } from '../services/backend';
import './SectionEditor.css';

const SectionEditor = ({ sectionId, onSave, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, watch } = useForm();

    // Watch type to conditional render fields
    const type = watch('type', 'text');

    useEffect(() => {
        if (sectionId) {
            // Load data if editing existing
            // For simplicity, we might pass the full object or fetch it.
            // Let's assume passed for now or fetch list in parent.
        }
    }, [sectionId]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            // Check Admin permissions (strictly via RLS on backend, but UI check here)
            const user = await backend.getUser();
            if (!user) {
                alert("You must be logged in.");
                return;
            }

            // Parse content to JSON if it's string (handled by react-hook-form largely)
            // Save
            await backend.saveSection(data);
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
            // Insert URL into current cursor or field
            // For now, just alert the URL to copy-paste or set a specific field
            prompt("Image uploaded! Copy this URL:", url);
        } catch (err) {
            alert("Upload failed");
        }
    };

    return (
        <div className="section-editor">
            <h3>{sectionId ? 'Edit Section' : 'New Section'}</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-row">
                    <label>Title</label>
                    <input {...register('title', { required: true })} />
                </div>

                <div className="form-row">
                    <label>Type</label>
                    <select {...register('type')}>
                        <option value="text">Text (Personal/Bio)</option>
                        <option value="education">Education (Timeline)</option>
                        <option value="experience">Experience (Timeline)</option>
                        <option value="project">Projects (Grid)</option>
                        <option value="links">Web Links</option>
                    </select>
                </div>

                <div className="form-row">
                    <label>Order</label>
                    <input type="number" {...register('order')} />
                </div>

                {/* Dynamic Fields based on Type */}
                {type === 'text' && (
                    <div className="form-row">
                        <label>Content (Key: Value pair lines)</label>
                        <textarea {...register('content.raw')} rows={10} />
                    </div>
                )}

                {(type === 'education' || type === 'experience') && (
                    <div className="json-editor">
                        <p>Use local JSON editor for now (Prototype)</p>
                        <textarea {...register('content', {
                            setValueAs: v => {
                                try { return JSON.parse(v) } catch (e) { return v }
                            }
                        })} rows={15} defaultValue={JSON.stringify({ items: [] }, null, 2)} />
                    </div>
                )}

                <div className="form-row">
                    <label>Upload Image</label>
                    <input type="file" onChange={handleFileUpload} />
                </div>

                <div className="actions">
                    <button type="submit" disabled={loading}>Save Section</button>
                    <button type="button" onClick={onCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default SectionEditor;
