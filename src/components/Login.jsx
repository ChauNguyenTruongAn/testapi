import { useLocation, useNavigate } from "react-router-dom";

function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const error = location.state?.error;

  const handleGoogleLogin = () => {
    const clientId = "252893217133-7br4o5fnn1l5sosa8gth0ndij3f6pg35.apps.googleusercontent.com";
    const redirectUri = "http://localhost:8080/api/auth/google-callback"; // Giữ nguyên redirect về backend
    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${encodeURIComponent(
      clientId
    )}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=openid%20email%20profile`;
    
    // Lưu trang trước đó
    navigate(location.pathname, { state: { from: location.pathname } });
    window.location.href = authUrl;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-4">News App</h2>
        {error && <div className="bg-red-100 p-2 rounded mb-4 text-red-700">{error}</div>}
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Login with Google
        </button>
      </div>
    </div>
  );
}

export default Login;