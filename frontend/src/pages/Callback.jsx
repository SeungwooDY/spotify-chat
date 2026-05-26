import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.substring(1));
    const access = params.get('access_token');
    const refresh = params.get('refresh_token');
    const error = params.get('error');

    if (error) {
      navigate('/?error=' + error, { replace: true });
    } else if (access) {
      sessionStorage.setItem('access_token', access);
      sessionStorage.setItem('refresh_token', refresh);
      navigate('/dashboard', { replace: true });  // ← this both navigates AND clears the hash
    } else {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  return <p>Logging you in...</p>;
}