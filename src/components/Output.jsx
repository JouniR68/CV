import Education from "./Education"
import Work from "./Work";
import Tech from "./Tech";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import "../css/output.css"
import Looking from "./Looking";
import { Link, Navigate, useNavigate } from "react-router-dom";


const CV = () => {
    const { t } = useTranslation()
    const [showKoulutus, setShowKoulutus] = useState(false)
    const [showHistoria, setShowHistoria] = useState(false)
    const [showTechs, setShowTechs] = useState(false)
    const [showEtsin, setShowEtsin] = useState(false)
    const navigate = useNavigate()
    const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
    const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
    const navigation = useNavigate();



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
                <Button onClick={() => showContent('koulutus')}>{t('Output-education')}</Button>
                {showKoulutus && <Education />}

                <Button onClick={() => showContent('taidot')}>{t('Output-techs')}</Button>
                {showTechs && <Tech />}

                <Button onClick={() => showContent('historia')}>{t('Output-work')}</Button>
                {showHistoria && <Work />}

                <Button onClick={() => showContent('etsin')}>{t('Looking')}</Button>
                {showEtsin && <Looking />}
            </div>
        </div>
    );
}

export default CV