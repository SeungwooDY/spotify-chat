import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Callback() {
  const navigate = useNavigate();

  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.substring(1));
    const access = params.get('access_token');
    const refresh = params.get('refresh_token');
    const error = params.get('error');

    if (error) {
      navigate('/login?error=' + error, { replace: true });
    } else if (access) {
      login(access, refresh);
      navigate('/', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  return <p>Logging you in...</p>;
}