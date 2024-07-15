import Education from "./Education"
import Profile from "./Profile";
import Why from "./Why";
import Intrests from "./Intrest"
import Work from "./Work";
import Tech from "./Tech";
import Looking from './Looking';
import { useTranslation } from "react-i18next";

const CV = () => {

    const {t} = useTranslation()

    return (
        <div>              
                    
            <h3 className = "output--text">{t('Output-profile')}</h3>                      
            <Profile />
                 
            <h3 className = "output--text">{t('Output-intrest')}</h3>
            <Intrests />
                        
            <h3 className = "output--text">{t('Output-looking')}</h3>
            <Looking />

            
            <h3 className = "output--text">{t('Output-why')}</h3>
            <Why />

            <h3 className = "output--text">{t('Output-education')}</h3>
            <Education />
            
            <h3 className = "output--text">{t('Output-techs')}</h3>
            <Tech />
            
            <h3 className = "output--text">{t('Output-work')}</h3>
            <Work />
            
        </div>
    );
}

export default CV;