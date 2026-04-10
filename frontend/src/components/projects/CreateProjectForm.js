import { useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../../api/client';
import styles from './CreateProjectForm.module.css';

export default function CreateProjectForm({ onCreated }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setLoading(true);
    try {
      const project = await api.createProject(form);
      toast.success('Project created');
      onCreated(project);
      setForm({ name: '', description: '' });
      setOpen(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button className={styles.trigger} onClick={() => setOpen(true)}>
        + New Project
      </button>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3>New Project</h3>
        <button className={styles.close} onClick={() => setOpen(false)}>✕</button>
      </div>
      <form onSubmit={submit} className={styles.form}>
        <input
          placeholder="Project name *"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          autoFocus
          required
        />
        <textarea
          placeholder="Description (optional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
        />
        <div className={styles.actions}>
          <button type="button" className={styles.cancel} onClick={() => setOpen(false)}>
            Cancel
          </button>
          <button type="submit" className={styles.submit} disabled={loading || !form.name.trim()}>
            {loading ? 'Creating...' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
}
