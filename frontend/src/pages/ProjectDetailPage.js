import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../api/client';
import TaskItem from '../components/tasks/TaskItem';
import CreateTaskForm from '../components/tasks/CreateTaskForm';
import TaskFilters from '../components/tasks/TaskFilters';
import Spinner from '../components/ui/Spinner';
import styles from './ProjectDetailPage.module.css';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loadingProject, setLoadingProject] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [filters, setFilters] = useState({ status: '', sort: '' });

  useEffect(() => {
    api.getProject(id)
      .then(setProject)
      .catch(() => { toast.error('Project not found'); navigate('/'); })
      .finally(() => setLoadingProject(false));
  }, [id, navigate]);

  useEffect(() => {
    if (!project) return;
    setLoadingTasks(true);
    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.sort) params.sort = filters.sort;

    api.getTasks(id, params)
      .then((res) => setTasks(res.data))
      .catch((e) => toast.error(e.message))
      .finally(() => setLoadingTasks(false));
  }, [id, project, filters]);

  const handleFiltersChange = (next) => setFilters(next);

  const handleTaskCreated = (task) => setTasks((prev) => [task, ...prev]);

  const handleTaskUpdated = (updated) =>
    setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));

  const handleTaskDeleted = (taskId) =>
    setTasks((prev) => prev.filter((t) => t._id !== taskId));

  if (loadingProject) {
    return <div className={styles.center}><Spinner size={32} /></div>;
  }

  if (!project) return null;

  const statusCounts = tasks.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <div className={styles.breadcrumb}>
        <Link to="/" className={styles.back}>← Projects</Link>
      </div>

      <div className={styles.header}>
        <div>
          <h1 className={styles.name}>{project.name}</h1>
          {project.description && <p className={styles.desc}>{project.description}</p>}
        </div>
        <div className={styles.stats}>
          <Stat label="Todo" value={statusCounts.todo || 0} color="var(--muted)" />
          <Stat label="In Progress" value={statusCounts['in-progress'] || 0} color="#818cf8" />
          <Stat label="Done" value={statusCounts.done || 0} color="var(--success)" />
        </div>
      </div>

      <div className={styles.toolbar}>
        <TaskFilters filters={filters} onChange={handleFiltersChange} />
      </div>

      <div className={styles.tasks}>
        <CreateTaskForm projectId={id} onCreated={handleTaskCreated} />

        {loadingTasks ? (
          <div className={styles.center}><Spinner /></div>
        ) : tasks.length === 0 ? (
          <p className={styles.empty}>
            {filters.status ? 'No tasks match this filter.' : 'No tasks yet. Add one above.'}
          </p>
        ) : (
          tasks.map((t) => (
            <TaskItem
              key={t._id}
              task={t}
              onUpdated={handleTaskUpdated}
              onDeleted={handleTaskDeleted}
            />
          ))
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div className={styles.stat}>
      <span className={styles.statVal} style={{ color }}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}
