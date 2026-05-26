import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const access = params.get('access_token');
    const refresh = params.get('refresh_token');
    const error = params.get('error');

    if (error) {
      navigate('/?error=' + error, { replace: true });
      return;
    }

    if (access) {
      sessionStorage.setItem('access_token', access);
      sessionStorage.setItem('refresh_token', refresh);
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  return <p>Logging you in...</p>;
}