import { useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../../api/client';
import styles from './CreateTaskForm.module.css';

const empty = { title: '', description: '', status: 'todo', priority: 'medium', due_date: '' };

export default function CreateTaskForm({ projectId, onCreated }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      if (!payload.due_date) delete payload.due_date;
      const task = await api.createTask(projectId, payload);
      toast.success('Task created');
      onCreated(task);
      setForm(empty);
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
        + Add Task
      </button>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h4>New Task</h4>
        <button className={styles.close} onClick={() => setOpen(false)}>✕</button>
      </div>
      <form onSubmit={submit} className={styles.form}>
        <input
          placeholder="Task title *"
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          autoFocus
          required
        />
        <textarea
          placeholder="Description (optional)"
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          rows={2}
        />
        <div className={styles.row}>
          <div className={styles.field}>
            <label>Status</label>
            <select value={form.status} onChange={(e) => set('status', e.target.value)}>
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div className={styles.field}>
            <label>Priority</label>
            <select value={form.priority} onChange={(e) => set('priority', e.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className={styles.field}>
            <label>Due date</label>
            <input
              type="date"
              value={form.due_date}
              onChange={(e) => set('due_date', e.target.value)}
            />
          </div>
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.cancel} onClick={() => setOpen(false)}>
            Cancel
          </button>
          <button type="submit" className={styles.submit} disabled={loading || !form.title.trim()}>
            {loading ? 'Adding...' : 'Add Task'}
          </button>
        </div>
      </form>
    </div>
  );
}
