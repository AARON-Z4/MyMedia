import styles from './TaskFilters.module.css';

export default function TaskFilters({ filters, onChange }) {
  return (
    <div className={styles.row}>
      <select
        value={filters.status}
        onChange={(e) => onChange({ ...filters, status: e.target.value })}
        className={styles.select}
      >
        <option value="">All statuses</option>
        <option value="todo">Todo</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>

      <select
        value={filters.sort}
        onChange={(e) => onChange({ ...filters, sort: e.target.value })}
        className={styles.select}
      >
        <option value="">Sort: Default</option>
        <option value="due_date">Sort: Due date</option>
      </select>
    </div>
  );
}
