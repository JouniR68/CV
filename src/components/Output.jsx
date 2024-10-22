import Education from "./Education"
import Work from "./Work";
import Tech from "./Tech";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import "../css/output.css"
import Looking from "./Looking";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { generatePDF } from "./services/CVPdf" 

const CV = () => {
    const { t } = useTranslation()
    const [showKoulutus, setShowKoulutus] = useState(false)
    const [showHistoria, setShowHistoria] = useState(false)
    const [showTechs, setShowTechs] = useState(false)
    const [showEtsin, setShowEtsin] = useState(false)
    const navigate = useNavigate()
    //const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
    //const [viewportHeight, setViewportHeight] = useState(window.innerHeight);


    /*
  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);
*/

    const showContent = (section) => {
        if (section === 'koulutus') {
            setShowKoulutus(!showKoulutus);
            setShowHistoria(false);
            setShowTechs(false);
            setShowEtsin(false)
        } else if (section === 'taidot') {
            setShowTechs(!showTechs);
            setShowKoulutus(false);
            setShowHistoria(false);
            setShowEtsin(false)
        } else if (section === 'historia') {
            setShowHistoria(!showHistoria);
            setShowKoulutus(false);
            setShowTechs(false);
            setShowEtsin(false)
        } else if (section === 'etsin') {
            setShowEtsin(!showEtsin);
            setShowKoulutus(false);
            setShowTechs(false);
            setShowHistoria(false);
        }

    }

    return (
        <div className="output">
            <div className="output-sections">
            
                <Button variant = "contained" onClick = {generatePDF}>{t('LoadCV')}</Button>

                <Button onClick={() => showContent('koulutus')}><h3>{t('Output-education')}</h3></Button>
                {showKoulutus && <Education />}

                <Button onClick={() => showContent('taidot')}><h3>{t('Output-techs')}</h3></Button>
                {showTechs && <Tech />}

                <Button onClick={() => showContent('historia')}><h3>{t('Output-work')}</h3></Button>
                {showHistoria && <Work />}

                <Button onClick={() => showContent('etsin')}><h3>{t('Looking')}</h3></Button>
                {showEtsin && <Looking />}
            </div>
        </div>
    );
}

export default CV