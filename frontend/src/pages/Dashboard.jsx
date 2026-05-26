import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('access_token');
    if (!stored) {
      navigate('/', { replace: true });
      return;
    }
    setToken(stored);
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    navigate('/', { replace: true });
  };

  if (!token) return null;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Token: {token.substring(0, 20)}...</p>
      <button onClick={handleLogout}>Log out</button>
    </div>
  );
}