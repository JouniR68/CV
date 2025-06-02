import { Link, Outlet } from 'react-router-dom';
import "../css/reissu.css"

export default function ReissuLayout() {
    return (
        <>
            <div className='main'>
                <nav className='host-nav'>
                    <Link to='reissulista'>Tsekkilista</Link>
                    <Link to='diary'>Päivis</Link>
                    <Link to='uVelka'>Velka</Link>
                    <Link to='vLista'>Velkalista</Link>
                </nav>
            </div>
            <Outlet />
        </>
    );
}
