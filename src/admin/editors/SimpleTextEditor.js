import React from 'react';

const SimpleTextEditor = ({ register, placeholder }) => {
    return (
        <div className="form-row">
            <label>Raw Content (One item per line or formatted text)</label>
            <textarea
                {...register('content.raw')}
                rows={12}
                placeholder={placeholder}
                style={{ fontFamily: 'monospace' }}
            />
        </div>
    );
};

export default SimpleTextEditor;
