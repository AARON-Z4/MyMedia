import { useState, useEffect } from 'react';
import { api } from '../api/client';
import ProjectCard from '../components/projects/ProjectCard';
import CreateProjectForm from '../components/projects/CreateProjectForm';
import Spinner from '../components/ui/Spinner';
import styles from './ProjectsPage.module.css';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const load = async (p = 1) => {
    setLoading(true);
    try {
      const res = await api.getProjects(p, 9);
      setProjects(res.data);
      setPagination(res.pagination);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(page); }, [page]);

  const handleCreated = (project) => {
    setProjects((prev) => [project, ...prev]);
  };

  const handleDeleted = (id) => {
    setProjects((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <div>
      <div className={styles.topbar}>
        <div>
          <h1 className={styles.heading}>Projects</h1>
          {pagination && (
            <p className={styles.sub}>{pagination.total} project{pagination.total !== 1 ? 's' : ''}</p>
          )}
        </div>
        <CreateProjectForm onCreated={handleCreated} />
      </div>

      {loading ? (
        <div className={styles.center}><Spinner size={32} /></div>
      ) : projects.length === 0 ? (
        <div className={styles.empty}>
          <p>No projects yet. Create your first one above.</p>
        </div>
      ) : (
        <>
          <div className={styles.grid}>
            {projects.map((p) => (
              <ProjectCard key={p._id} project={p} onDeleted={handleDeleted} />
            ))}
          </div>

          {pagination && pagination.pages > 1 && (
            <div className={styles.pager}>
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className={styles.pageBtn}
              >
                ← Prev
              </button>
              <span className={styles.pageInfo}>
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                disabled={page >= pagination.pages}
                onClick={() => setPage((p) => p + 1)}
                className={styles.pageBtn}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
