import React, { useState, useEffect } from 'react';
import './HiddenSection.css';

const HiddenSection = ({ data, title }) => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        if (data && data.items) {
            setItems(data.items);
        } else if (data && typeof data === 'object') {
            // Handle if items is just an array directly or some other structure
            // For now assuming existing standard { items: [] } structure
            // But if user creates custom, let's look for items
        }
    }, [data]);

    return (
        <div className="hidden-section-container">
            <h2>{title}</h2>
            <div className="hidden-items-grid">
                {items.map((item, index) => (
                    <div className="hidden-item-card" key={index}>
                        <h3 className="item-title">{item.title}</h3>
                        {item.price && <span className="item-price">{item.price}</span>}
                        <div className="item-details">
                            {item.details && item.details.split('\n').map((line, i) => (
                                <p key={i}>{line}</p>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HiddenSection;
