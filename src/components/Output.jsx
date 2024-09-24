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
    const [show, setShow] = useState(true)

    //<Button style={{marginTop:'2rem'}} onClick={() => showContent()}>{t('Show')} {t('Output-education')} {t('Output-techs')}</Button>
    const showContent = () => {
        setShow(!show)
    }

    return (
        <div className="output">
            <div>
                <h3>{t('Output-profile')}</h3>
                <Profile />                
            </div>
            {show && <div><h3>{t('Output-education')}</h3>
                <Education />

                <h3>{t('Output-techs')}</h3>
                <Tech />
            </div>
            }
            <h3>{t('Output-work')}</h3>
            <Work />
        </div>
    );
}

export default CV;