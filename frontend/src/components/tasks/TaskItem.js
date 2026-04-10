import { useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../../api/client';
import ConfirmModal from '../ui/ConfirmModal';
import styles from './TaskItem.module.css';

const statusOptions = ['todo', 'in-progress', 'done'];
const priorityOptions = ['low', 'medium', 'high'];

export default function TaskItem({ task, onUpdated, onDeleted }) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);

  const patch = async (changes) => {
    setUpdating(true);
    try {
      const updated = await api.updateTask(task._id, changes);
      onUpdated(updated);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.deleteTask(task._id);
      toast.success('Task deleted');
      onDeleted(task._id);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setDeleting(false);
      setConfirming(false);
    }
  };

  const due = task.due_date
    ? new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null;

  const isOverdue = task.due_date && task.status !== 'done' && new Date(task.due_date) < new Date();

  return (
    <>
      <div className={`${styles.item} ${updating ? styles.updating : ''}`}>
        <div className={styles.main}>
          <div className={styles.topRow}>
            <span className={styles.title}>{task.title}</span>
            <button
              className={styles.del}
              onClick={() => setConfirming(true)}
              title="Delete task"
            >
              ✕
            </button>
          </div>
          {task.description && <p className={styles.desc}>{task.description}</p>}
          <div className={styles.meta}>
            <select
              className={`${styles.select} badge badge-${task.status}`}
              value={task.status}
              onChange={(e) => patch({ status: e.target.value })}
              onClick={(e) => e.stopPropagation()}
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <select
              className={`${styles.select} badge badge-${task.priority}`}
              value={task.priority}
              onChange={(e) => patch({ priority: e.target.value })}
              onClick={(e) => e.stopPropagation()}
            >
              {priorityOptions.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            {due && (
              <span className={`${styles.due} ${isOverdue ? styles.overdue : ''}`}>
                {isOverdue ? '⚠ ' : ''}{due}
              </span>
            )}
          </div>
        </div>
      </div>

      {confirming && (
        <ConfirmModal
          title="Delete task?"
          message={`"${task.title}" will be permanently removed.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirming(false)}
          loading={deleting}
        />
      )}
    </>
  );
}
