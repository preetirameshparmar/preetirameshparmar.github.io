import React, { useEffect, useState } from 'react';
import { backend } from '../services/backend';
import SectionEditor from './SectionEditor';
import './ContentManager.css';

const ContentManager = () => {
    const [sections, setSections] = useState([]);
    const [editingSection, setEditingSection] = useState(null);
    const [isCreating, setIsCreating] = useState(false);

    const loadSections = async () => {
        try {
            const data = await backend.getSections();
            setSections(data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        loadSections();
    }, []);

    const handleEdit = (section) => {
        // Must set form values - for now we pass ID or object to editor
        setEditingSection(section);
        setIsCreating(false);
    };

    const handleCreate = () => {
        setEditingSection(null);
        setIsCreating(true);
    };

    const handleSave = () => {
        setEditingSection(null);
        setIsCreating(false);
        loadSections();
    };

    return (
        <div className="content-manager">
            <div className="header">
                <h2>Content Sections</h2>
                <button onClick={handleCreate}>+ New Section</button>
            </div>

            {(editingSection || isCreating) ? (
                <SectionEditor
                    sectionId={editingSection?.id}
                    // Pre-fill logic would go here or in Editor
                    onSave={handleSave}
                    onCancel={() => { setEditingSection(null); setIsCreating(false); }}
                />
            ) : (
                <div className="sections-list">
                    <table>
                        <thead>
                            <tr>
                                <th>Order</th>
                                <th>Title</th>
                                <th>Type</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sections.map(sec => (
                                <tr key={sec.id}>
                                    <td>{sec.order}</td>
                                    <td>{sec.title}</td>
                                    <td>{sec.type}</td>
                                    <td>
                                        <button onClick={() => handleEdit(sec)}>Edit</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ContentManager;
