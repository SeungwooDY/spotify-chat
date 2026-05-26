const BACKEND_URI = 'http://127.0.0.1:3000';

export default function Login() {
  const handleLogin = () => {
    window.location.href = `${BACKEND_URI}/login`;
  };

  return (
    <div>
      <h1>Welcome</h1>
      <button onClick={handleLogin}>Log in with Spotify</button>
    </div>
  );
}