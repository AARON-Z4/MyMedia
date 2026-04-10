import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../../api/client';
import ConfirmModal from '../ui/ConfirmModal';
import styles from './ProjectCard.module.css';

export default function ProjectCard({ project, onDeleted }) {
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.deleteProject(project._id);
      toast.success('Project deleted');
      onDeleted(project._id);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setDeleting(false);
      setConfirming(false);
    }
  };

  const created = new Date(project.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <>
      <div className={styles.card} onClick={() => navigate(`/projects/${project._id}`)}>
        <div className={styles.header}>
          <h3 className={styles.name}>{project.name}</h3>
          <button
            className={styles.deleteBtn}
            onClick={(e) => { e.stopPropagation(); setConfirming(true); }}
            title="Delete project"
          >
            ✕
          </button>
        </div>
        {project.description && (
          <p className={styles.desc}>{project.description}</p>
        )}
        <span className={styles.date}>Created {created}</span>
      </div>

      {confirming && (
        <ConfirmModal
          title="Delete project?"
          message={`"${project.name}" and all its tasks will be permanently deleted.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirming(false)}
          loading={deleting}
        />
      )}
    </>
  );
}
