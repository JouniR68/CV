
function ConfirmationModal({ onConfirm, onCancel }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Ok to read your location (not accurate...)?</h2>
        <button onClick={onConfirm}>Yes</button>
        <button onClick={onCancel}>No</button>
      </div>
    </div>
  );
}

export default ConfirmationModal;
