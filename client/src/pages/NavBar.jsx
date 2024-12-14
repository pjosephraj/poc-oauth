import { Link, useNavigate } from 'react-router-dom';

const NavBar = () => {
  const navigate = useNavigate();

  const clearCookies = () => { 
    document.cookie.split(";").forEach((c) => { 
      document.cookie = c.trim().split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;"; 
    });
  };

  const handleLogout = () => {
    fetch('http://localhost:5000/logout', {
      method: 'GET'
    })
      .then(() => {
        clearCookies();
        navigate('/login');
      })
      .catch(error => console.error('Error logging out:', error));
  };

  return (
    <nav>
      <ul>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/products">Products</Link></li>
        <li><button onClick={handleLogout}>Logout</button></li>
      </ul>
    </nav>
  );
};

export default NavBar;
