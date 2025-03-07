import Education from "./Education"
import Work from "./Work";
import Tech from "./Tech";
import Profile from "./Profile";
import "../../css/cv.css"

const MindMap = () => {
    return (
        <div className="grid-container">
            <div className="skills"><Tech /></div>
            <div className="education"><Education /></div>            
            <div className="profile"><Profile /></div>
            <div className="work-history"><Work /></div>
        </div>
    );
}

export default MindMap;

