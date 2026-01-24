import React, { useEffect, useState } from 'react';
import { backend } from '../services/backend';
import BlogEditor from './BlogEditor';
import './ContentManager.css'; // Reuse styles

const BlogManager = () => {
    const [blogs, setBlogs] = useState([]);
    const [editingBlog, setEditingBlog] = useState(null);
    const [isCreating, setIsCreating] = useState(false);

    const loadBlogs = async () => {
        try {
            const data = await backend.getBlogs();
            setBlogs(data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        loadBlogs();
    }, []);

    const handleEdit = (blog) => {
        setEditingBlog(blog);
        setIsCreating(false);
    };

    const handleCreate = () => {
        setEditingBlog(null);
        setIsCreating(true);
    };

    const handleSave = () => {
        setEditingBlog(null);
        setIsCreating(false);
        loadBlogs();
    };

    return (
        <div className="content-manager">
            <div className="header">
                <h2>Blog Posts</h2>
                <button onClick={handleCreate}>+ New Post</button>
            </div>

            {(editingBlog || isCreating) ? (
                <BlogEditor
                    blogId={editingBlog?.id}
                    existingData={editingBlog}
                    onSave={handleSave}
                    onCancel={() => { setEditingBlog(null); setIsCreating(false); }}
                />
            ) : (
                <div className="sections-list">
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Slug</th>
                                <th>Published</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blogs.map(blog => (
                                <tr key={blog.id}>
                                    <td>{blog.title}</td>
                                    <td>{blog.slug}</td>
                                    <td>{blog.published_at ? new Date(blog.published_at).toLocaleDateString() : 'Draft'}</td>
                                    <td>
                                        <button onClick={() => handleEdit(blog)}>Edit</button>
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

export default BlogManager;
