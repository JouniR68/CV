import Education from "./Education"
import Profile from "./Profile";
import Why from "./Why";
import Intrests from "./Intrest"
import Work from "./Work";
import Tech from "./Tech";
import Looking from './Looking';
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Button } from "@mui/material";

const CV = () => {
    const { t } = useTranslation()
    const [showKoulutus, setShowKoulutus] = useState(false)
    const [showHistoria, setShowHistoria] = useState(false)
    const [showTechs, setShowTechs] = useState(false)
    const [showProfile, setShowProfile] = useState(false)


    /*
                <Button onClick={() => showContent('profiili')}><h3>{t('Output-profile')}</h3></Button>
                {showProfile && <Profile hideButton = {true}/>}

    */
    //<Button style={{marginTop:'2rem'}} onClick={() => showContent()}>{t('Show')} {t('Output-education')} {t('Output-techs')}</Button>
    const showContent = (section) => {
        if (section === 'koulutus') {
            setShowKoulutus(!showKoulutus);
        } else if (section === 'taidot') {
            setShowTechs(!showTechs);
        } else if (section === 'historia') {
            setShowHistoria(!showHistoria);
        }
        else if (section === 'profiili') {
            setShowProfile(!showProfile);
        }

    };

    return (
        <div className="output">

            <div className="output-content">                

                <Button onClick={() => showContent('koulutus')}><h3>{t('Output-education')}</h3></Button>
                {showKoulutus && <Education />}

                <Button onClick={() => showContent('taidot')}><h3>{t('Output-techs')}</h3></Button>
                {showTechs && <Tech />}

                <Button onClick={() => showContent('historia')}><h3>{t('Output-work')}</h3></Button>
                {showHistoria && <Work />}
            </div>
        </div>
    );
}

export default CV;