import React from 'react';
import { useFieldArray } from 'react-hook-form';
import { backend } from '../../services/backend';

const DynamicListEditor = ({ control, register, setValue, type }) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "content.items"
    });

    const addItem = () => {
        if (type === 'experience') {
            append({ company_name: '', start: '', end: '', city: '', on_field_work: '' });
        } else if (type === 'education') {
            append({ institution: '', degree: '', start: '', end: '', city: '' });
        } else if (type === 'project') {
            append({ name: '', description: '', image: '', tags: '', cta: '' });
        }
    };

    const deleteItem = (index) => {
        if (window.confirm("Are you sure you want to delete this item? This action cannot be undone.")) {
            remove(index);
        }
    };

    const handleFileUpload = async (index, e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const url = await backend.uploadMedia(file);
            // Update the specific field using setValue
            // Format: content.items[index].image
            setValue(`content.items.${index}.image`, url, { shouldDirty: true });
        } catch (err) {
            console.error(err);
            alert("Upload failed");
        }
    };

    return (
        <div className="array-editor">
            {fields.map((item, index) => (
                <div key={item.id} className="array-item-card" style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem', borderRadius: '8px', background: '#fafafa' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <h5 style={{ margin: 0 }}>Item #{index + 1}</h5>
                        <button type="button" onClick={() => deleteItem(index)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Delete</button>
                    </div>

                    {/* Fields for Experience / Education based on Type */}
                    {(type === 'experience' || type === 'education') && (
                        <div className="grid-fields" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <div>
                                <label>{type === 'experience' ? 'Company' : 'Institution'}</label>
                                <input {...register(`content.items.${index}.${type === 'experience' ? 'company_name' : 'institution'}`)} />
                            </div>
                            {type === 'education' && (
                                <div>
                                    <label>Degree</label>
                                    <input {...register(`content.items.${index}.degree`)} />
                                </div>
                            )}
                            <div>
                                <label>City</label>
                                <input {...register(`content.items.${index}.city`)} />
                            </div>
                            <div>
                                <label>Start</label>
                                <input {...register(`content.items.${index}.start`)} />
                            </div>
                            <div>
                                <label>End</label>
                                <input {...register(`content.items.${index}.end`)} />
                            </div>
                        </div>
                    )}

                    {/* Specific for Work Experience Details */}
                    {type === 'experience' && (
                        <div style={{ marginTop: '10px' }}>
                            <label>Description / On Field Work (Bullets)</label>
                            <textarea {...register(`content.items.${index}.on_field_work`)} rows={5} />
                        </div>
                    )}

                    {/* Specific for Projects */}
                    {type === 'project' && (
                        <div className="grid-fields" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div>
                                <label>Project Name</label>
                                <input {...register(`content.items.${index}.name`)} placeholder="Project Name" />
                            </div>
                            <div>
                                <label>Description</label>
                                <textarea {...register(`content.items.${index}.description`)} placeholder="Description" rows={3} />
                            </div>
                            <div>
                                <label>Artifact (Image related to Project)</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input {...register(`content.items.${index}.image`)} placeholder="Image URL / Media Path" style={{ flex: 1 }} />
                                    <label className="upload-btn" style={{ cursor: 'pointer', background: '#4f46e5', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px', fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}>
                                        Upload
                                        <input type="file" onChange={(e) => handleFileUpload(index, e)} style={{ display: 'none' }} />
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label>Skills</label>
                                <input {...register(`content.items.${index}.tags`)} placeholder="Tech Stack / Tags (comma separated)" />
                            </div>
                            <div>
                                <label>CTA Button Label</label>
                                <input {...register(`content.items.${index}.cta`)} placeholder="e.g. More..." />
                            </div>
                        </div>
                    )}

                </div>
            ))}

            <button
                type="button"
                onClick={addItem}
                className="add-btn"
                style={{ background: '#e5e7eb', color: '#374151', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}
            >
                + Add Item
            </button>
        </div>
    );
};

export default DynamicListEditor;
