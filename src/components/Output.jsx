import Education from "./Education"
import Profile from "./Profile";
import Why from "./Why";
import Intrests from "./Intrest"
import Work from "./Work";
import Tech from "./Tech";
import Looking from './Looking';

const CV = () => {
    return (
        <div>              
            <Profile />        
            <h3 className = "output--text">My intrests</h3>                      
            <Intrests />     
            <h3 className = "output--text">Looking</h3>
            <Looking />            
            <h3 className = "output--text">Value for the money</h3>
            <Why />
            <h3 className = "output--text">Education</h3>
            <Education />
            <h3 className = "output--text">Tech skills</h3>
            <Tech />
            <h3 className = "output--text">Work History</h3>
            <Work />
        </div>
    );
}

export default CV;