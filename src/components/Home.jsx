import { Link } from 'react-router-dom';
import Sos from "./Sos"

export default function Home() {
  return (
    <>
      <h1>Welcome</h1>
      <div className='home-container'>
        Sole purpose of these pages is to act as a net based CV. Naturally as an
        capitalist open for new offers (who wouldn't).
        <p></p>
        Note that I haven't prepared pages for the mobile usage so if using
        mobile, sorry in advanced.
        <p></p>
        <Link to='https://github.com/JR-Portfolio'>GitHub showcase</Link>
      </div>
    </>
  );
}
