import React from 'react';
import { useFieldArray } from 'react-hook-form';

const CTAButtonEditor = ({ control, register }) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "content.cta_buttons"
    });

    return (
        <div className="array-editor">
            {fields.map((item, index) => (
                <div key={item.id} className="array-item" style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <input
                        {...register(`content.cta_buttons.${index}.label`)}
                        placeholder="Label (e.g. LinkedIn)"
                        style={{ flex: 1 }}
                    />
                    <input
                        {...register(`content.cta_buttons.${index}.url`)}
                        placeholder="URL"
                        style={{ flex: 2 }}
                    />
                    <button type="button" onClick={() => remove(index)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' }}>
                        ✕
                    </button>
                </div>
            ))}
            <button
                type="button"
                onClick={() => append({ label: '', url: '' })}
                style={{ background: '#e5e7eb', color: '#374151', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}
            >
                + Add Button
            </button>
        </div>
    );
};

export default CTAButtonEditor;
