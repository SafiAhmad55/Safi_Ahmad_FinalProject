
import "./ConfirmDeleteModal.css";

export default function ConfirmDeleteModal({
  show,
  title = "Delete Item",
  message = "Are you sure you want to delete this item?",
  itemName,
  loading = false,
  onCancel,
  onConfirm,
}) {
  if (!show) return null;

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal" role="dialog" aria-modal="true">
        <div className="delete-modal-header">
          <h3>{title}</h3>
          <button
            className="modal-close"
            onClick={onCancel}
            disabled={loading}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="delete-modal-body">
          <p>{message}</p>
          {itemName && <strong>{itemName}</strong>}
        </div>

        <div className="delete-modal-footer">
          <button
            className="cancel-button"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            className="confirm-delete-button"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
