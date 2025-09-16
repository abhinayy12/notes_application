'use client'

import { useEffect, useState } from 'react';
import api from '../utils/api';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

interface Note {
  _id: string;
  title: string;
  content: string;
}

export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [tenantPlan, setTenantPlan] = useState('Free');

  const token = Cookies.get('token');
  const tenant = Cookies.get('tenant');

  const fetchNotes = async () => {
    try {
      const res = await api.get('/notes', { headers: { Authorization: `Bearer ${token}` } });
      setNotes(res.data);
    } catch (err: any) {
      toast.error('Failed to fetch notes');
    }
  };

  const fetchTenant = async () => {
    try {
      const res = await api.get(`/tenants/${tenant}`, { headers: { Authorization: `Bearer ${token}` } });
      setTenantPlan(res.data.plan);
    } catch (err: any) {
      toast.error('Failed to fetch tenant info');
    }
  };

  const addNote = async () => {
    if (!title || !content) return toast.warning('Title and content required');
    setLoading(true);
    try {
      await api.post('/notes', { title, content }, { headers: { Authorization: `Bearer ${token}` } });
      setTitle('');
      setContent('');
      fetchNotes();
    } catch (err: any) {
      if (err.response?.data?.message === 'Free plan limit reached') {
        toast.error('Free plan limit reached. Upgrade to Pro to add more notes.');
      } else toast.error('Failed to create note');
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await api.delete(`/notes/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchNotes();
    } catch {
      toast.error('Failed to delete note');
    }
  };

  const upgradeTenant = async () => {
    try {
      await api.post(`/tenants/${tenant}/upgrade`, {}, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Tenant upgraded to Pro!');
      fetchTenant();
    } catch {
      toast.error('Upgrade failed');
    }
  };

  useEffect(() => {
    fetchNotes();
    fetchTenant();
  }, []);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Notes</h1>

      {tenantPlan === 'Free' && notes.length >= 3 && (
        <div className="bg-yellow-200 p-4 mb-4 rounded">
          Free plan limit reached. <button onClick={upgradeTenant} className="text-blue-600 underline">Upgrade to Pro</button>
        </div>
      )}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 mr-2 rounded"
        />
        <input
          type="text"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-2 mr-2 rounded"
        />
        <button onClick={addNote} className="bg-blue-500 text-white p-2 rounded">
          {loading ? 'Adding...' : 'Add Note'}
        </button>
      </div>

      <ul>
        {notes.map((note) => (
          <li key={note._id} className="border p-2 mb-2 flex justify-between">
            <div>
              <strong>{note.title}</strong>: {note.content}
            </div>
            <button onClick={() => deleteNote(note._id)} className="text-red-500">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}