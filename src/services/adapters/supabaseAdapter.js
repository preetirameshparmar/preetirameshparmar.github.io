// src/services/adapters/supabaseAdapter.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Fail gracefully if env vars are missing (e.g. during preliminary local builds)
const supabase = (supabaseUrl && supabaseKey)
    ? createClient(supabaseUrl, supabaseKey)
    : null;

export const getSections = async () => {
    const { data, error } = await supabase
        .from('sections')
        .select('*')
        .order('order', { ascending: true });

    if (error) throw error;
    return data;
};

export const saveSection = async (section) => {
    const { data, error } = await supabase
        .from('sections')
        .upsert(section)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const getBlogs = async () => {
    const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('published_at', { ascending: false });

    if (error) throw error;
    return data;
};

export const saveBlog = async (blog) => {
    const { data, error } = await supabase
        .from('blogs')
        .upsert(blog)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const uploadMedia = async (file) => {
    const filename = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
        .from('media')
        .upload(filename, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filename);

    // Also save to media table for metadata consistency provided by SQL schema
    await supabase.from('media').insert({
        filename: filename,
        url: publicUrl,
        mime_type: file.type,
        size_bytes: file.size
    });

    return publicUrl;
};

export const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) throw error;
    return data;
};

export const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};

export const getUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user ?? null;
};
