import { Link, Outlet } from "react-router-dom";

const Huollot = () => {
    return ( 
          <>
              <nav className="host-nav">
                <Link to="createsuberb">Luo uusi data (suberb)</Link>
                <Link to="showsuberb">Huoltohistoria (suberb)</Link>  
                <Link to="uploadsuberb">Lataa suberb data Firebaseen (jalostettu)</Link>
                
                <Link to="createWRellu">Luo uusi data (valkoinen rellu)</Link>
                <Link to="showWRellu">Huoltohistoria (valkoinen rellu)</Link>  
                <Link to="uploadWRellu">Lataa valkoisen rellun data Firebaseen (jalostettu)</Link>                
              </nav>
              <Outlet />
            </>
     );
}
 
export default Huollot;