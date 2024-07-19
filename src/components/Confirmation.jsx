import { useTranslation } from "react-i18next";


function ConfirmationModal({onConfirm, onCancel}) {
  const {t} = useTranslation()

  if (!onConfirm || !onCancel){
    console.log("onConfirm or onCancel prop funcs have issues")
    return
  }

  return (
    <div className="confirmation-container">

      <div className="confirmation-content">
        
        <h2>{t('Confirmation-text')}</h2> 
        <h4>{t('Confirmation-expl')}</h4>
        <button id="ok" onClick={onConfirm}>{t('Yes')}</button>
        <button id="nok" onClick={onCancel}>{t('No')}</button>
        
      </div>
    </div>
  );
}

export default ConfirmationModal;
