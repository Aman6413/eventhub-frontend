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
    navigate("/homepage");
  };

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      {/* Left side */}
      <div className="w-1/3 flex justify-start">
        {user ? (
          <button
            onClick={handleHomeClick}
            className="text-blue-600 hover:underline"
          >
            Home
          </button>
        ) : (
          <>
            {isRegisterPage && (
              <Link to="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
            )}
            {isLoginPage && (
              <Link to="/register" className="text-blue-600 hover:underline">
                Register
              </Link>
            )}
          </>
        )}
      </div>

      {/* Center */}
      <div className="w-1/3 flex justify-center">
        <Link to="/" className="text-xl font-bold text-blue-600">
          EVENTHUB
        </Link>
      </div>

      {/* Right side */}
      <div className="w-1/3 flex justify-end items-center gap-4">
        {user && (
          <>
            <Link
              to="/myregistrations"
              className="text-blue-600 hover:underline"
            >
              My Registrations
            </Link>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:underline"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;