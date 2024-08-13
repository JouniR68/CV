import { useTranslation } from "react-i18next";


export default function Looking() {

  const {t} = useTranslation();

  return (
    
    <div className='output--text'>
      <hr></hr>
      <p>
      {t('Looking')}
        
      
<p></p>
      {t('Appealing')}
      </p>

      <table className="taulu">
        <tbody>
          <tr>
            <td>Sw Development Manager / Project Manager</td>
          </tr>

          <tr>
            <td>Sw Developer (web)</td>
          </tr>
          <tr>
            <td>System expert</td>
          </tr>
          <tr>
            <td>{t('OpenFor')}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
