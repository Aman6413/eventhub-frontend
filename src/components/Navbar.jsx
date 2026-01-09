import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleHomeClick = () => {
    if (user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/homepage");
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Left side - Logo */}
        <Link to="/" className="text-2xl font-bold text-white flex items-center gap-2 hover:opacity-90 transition-opacity">
          🎉 EventHub
        </Link>

        {/* Center - Navigation Links */}
        <div className="flex gap-6 items-center">
          {user ? (
            <>
              <button
                onClick={handleHomeClick}
                className="text-white hover:text-blue-100 font-semibold transition-colors text-sm md:text-base"
              >
                🏠 Home
              </button>
              <Link to="/profile" className="text-white hover:text-blue-100 font-semibold transition-colors text-sm md:text-base">
                👤 Profile
              </Link>
            </>
          ) : (
            <>
              {isRegisterPage && (
                <Link to="/login" className="text-white hover:text-blue-100 font-semibold transition-colors text-sm md:text-base">
                  🔐 Login
                </Link>
              )}
              {isLoginPage && (
                <Link to="/register" className="text-white hover:text-blue-100 font-semibold transition-colors text-sm md:text-base">
                  ✍️ Register
                </Link>
              )}
            </>
          )}
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-3">
              <span className="hidden sm:block text-white text-sm font-semibold">
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 hover:shadow-lg transform hover:scale-105 active:scale-95 text-sm md:text-base"
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
