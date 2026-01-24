// src/admin/SectionEditor.js
import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form'; // eslint-disable-line no-unused-vars
import { backend } from '../services/backend';
import './SectionEditor.css';
import CTAButtonEditor from './editors/CTAButtonEditor';
import DynamicListEditor from './editors/DynamicListEditor';
import SimpleTextEditor from './editors/SimpleTextEditor';

const SectionEditor = ({ sectionId, existingData, onSave, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const { register, control, handleSubmit, watch, setValue } = useForm();

    // Watch type to conditional render fields
    const type = watch('type', 'text');

    useEffect(() => {
        if (existingData) {
            setValue('title', existingData.title);
            setValue('type', existingData.type);
            setValue('order', existingData.order);

            // Handle content JSON vs raw
            if (['text', 'skills', 'links'].includes(existingData.type)) {
                // Text-based types: Populate content.raw
                // If stored as JSON but edited as raw key-value
                const raw = existingData.content?.raw ||
                    (typeof existingData.content === 'string' ? existingData.content :
                        Object.entries(existingData.content || {})
                            .filter(([k]) => k !== 'raw')
                            .map(([k, v]) => `${k}: ${v}`).join('\n'));

                setValue('content.raw', raw);
            } else if (['personal'].includes(existingData.type)) {
                // Personal: Populate fields directly
                setValue('content', existingData.content);
            } else if (['experience', 'education', 'project'].includes(existingData.type)) {
                // List types: Populate content.items array
                // If the data structure has 'items', use it. Else empty array.
                const items = existingData.content?.items || [];
                setValue('content.items', items);
            }
            else {
                // Fallback for weird types
                setValue('content', JSON.stringify(existingData.content, null, 2));
            }
        }
    }, [existingData, setValue]);

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
            // If Text Type, we might need to repackage raw string into JSON object if backend expects JSONB
            let payload = { ...data };
            if (sectionId) payload.id = sectionId;

            // If complex type and content is string (from textarea), parse it
            if (typeof payload.content === 'string' && payload.type !== 'text') {
                try {
                    payload.content = JSON.parse(payload.content);
                } catch (e) {
                    // Keep as string or error? Backend expects JSONB.
                    console.error("Invalid JSON content");
                }
            } else if (payload.content?.raw) {
                // For text types, we could parse the raw key-value back to object 
                // OR just save { raw: "..." } if that's what the component expects.
                // The migration saved { raw: "..." } for default types or parsed keys for Personal.
                // Personal component expects { name, phone... } OR { raw } logic?
                // Looking at Personal.js, it expects `data.name`, etc.
                // So we should parse the raw text back to object.
                const lines = payload.content.raw.split('\n');
                const parsed = {};
                lines.forEach(line => {
                    const [k, v] = line.split(':');
                    if (k && v) parsed[k.trim().toLowerCase()] = v.trim();
                });
                payload.content = { ...parsed, raw: payload.content.raw };
            }

            // Save
            await backend.saveSection(payload);
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
                        <option value="text">Text (Generic)</option>
                        <option value="personal">Personal Information</option>
                        <option value="education">Education (Timeline)</option>
                        <option value="experience">Experience (Timeline)</option>
                        <option value="project">Projects (Grid)</option>
                        <option value="skills">Skills</option>
                        <option value="links">Web Links</option>
                    </select>
                </div>

                <div className="form-row">
                    <label>Order</label>
                    <input type="number" {...register('order')} />
                </div>



                {/* Personal Information Editor */}
                {type === 'personal' && (
                    <div className="structured-editor">
                        <h4>Personal Details</h4>
                        <div className="form-row">
                            <label>Name</label>
                            <input {...register('content.name')} placeholder="Full Name" />
                        </div>
                        <div className="form-row">
                            <label>Email</label>
                            <input {...register('content.email')} placeholder="Email Address" />
                        </div>
                        <div className="form-row">
                            <label>Phone</label>
                            <input {...register('content.phone')} placeholder="Phone Number" />
                        </div>
                        <div className="form-row">
                            <label>Quote / Bio</label>
                            <textarea {...register('content.quote')} rows={4} placeholder="Short bio..." />
                        </div>

                        <h4>Social / CTA Buttons</h4>
                        <CTAButtonEditor control={control} register={register} />
                    </div>
                )}

                {/* Dynamic Lists (Experience, Education, Projects) */}
                {['experience', 'education', 'project'].includes(type) && (
                    <div className="structured-editor">
                        <h4>{type.charAt(0).toUpperCase() + type.slice(1)} Items</h4>
                        <DynamicListEditor control={control} register={register} type={type} />
                    </div>
                )}

                {/* Simplified Text Editors */}
                {['skills', 'links', 'text'].includes(type) && (
                    <SimpleTextEditor
                        register={register}
                        placeholder={type === 'skills' ? 'Enter skills...' : 'Enter links...'}
                    />
                )}

                {/* JSON Fallback - Only for unknown types now */}
                {(!['text', 'personal', 'experience', 'education', 'project', 'skills', 'links'].includes(type)) && (
                    <div className="json-editor">
                        <p>JSON Editor (Edit raw data for structure)</p>
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
