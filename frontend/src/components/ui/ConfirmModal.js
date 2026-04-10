import styles from './ConfirmModal.module.css';

export default function ConfirmModal({ title, message, onConfirm, onCancel, loading }) {
  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button className={styles.confirm} onClick={onConfirm} disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
