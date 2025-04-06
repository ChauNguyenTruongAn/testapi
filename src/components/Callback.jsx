import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Callback() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get("access_token");
    const role = params.get("role");
    const error = params.get("error");

    if (error) {
      navigate("/", { state: { error: "Login failed: " + error }, replace: true });
      return;
    }

    if (accessToken && role) {
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("role", role);

      if (role === "admin") {
        navigate("/dashboard", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } else {
      navigate("/", { state: { error: "Invalid login response" }, replace: true });
    }
  }, [location, navigate, from]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <p className="text-lg">Logging in...</p>
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mt-4"></div>
      </div>
    </div>
  );
}

export default Callback;