
function ConfirmationModal({ onConfirm, onCancel }) {
  return (
    <div className="confirmation-container">

      <div className="confirmation-content">
        
        <h2>Ok to read your location ?</h2> 
        <h4>(Not accurate & will not be used for anything...)</h4>
        <button id="ok" onClick={onConfirm}>Yes</button>
        <button id="nok" onClick={onCancel}>No</button>
        
      </div>
    </div>
  );
}

export default ConfirmationModal;
