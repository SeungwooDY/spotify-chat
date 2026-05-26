import "../App.css";
import {NavLink} from 'react-router-dom';

const Navbar = () => {
  return (
    <>
      <div className="navbar-container">
        <NavLink to="/profile" className="nav-link">Profile</NavLink>
        <div className="nav-text">
          <NavLink to="/" className="nav-link">Discover</NavLink>
          <NavLink to="/liked-songs" className="nav-link">Liked Songs</NavLink>
          <NavLink to="/top-artists" className="nav-link">Top Artists</NavLink>
          <NavLink to="/forum" className="nav-link">Forum</NavLink>
          <NavLink to="/top-songs" className="nav-link">Top Songs</NavLink>
          <NavLink to="/inbox" className="nav-link">Inbox</NavLink>
        </div>
      </div>
    </>
  );
}
export default Navbar;