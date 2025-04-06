import { Link, useNavigate } from "react-router-dom";
import api from "../api";

function Navbar() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("access_token");
  const role = localStorage.getItem("role");

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
      localStorage.removeItem("access_token");
      localStorage.removeItem("role");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-900 text-white shadow-lg z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">News App</Link>
        <ul className="flex space-x-6">
          <li>
            <Link to="/" className="hover:text-blue-400">Home</Link>
          </li>
          {isAuthenticated ? (
            <>
              {role === "admin" && (
                <li>
                  <Link to="/dashboard" className="hover:text-blue-400">Dashboard</Link>
                </li>
              )}
              {role === "admin" && (
                <li>
                  <Link to="/add-article" className="hover:text-blue-400">Add Article</Link>
                </li>
              )}
              <li>
                <button onClick={handleLogout} className="hover:text-blue-400 bg-transparent border-none">Logout</button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" state={{ from: window.location.pathname }} className="hover:text-blue-400">Login</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;