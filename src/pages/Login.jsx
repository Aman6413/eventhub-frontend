import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/thunks/authThunk";
import { Link, useNavigate } from "react-router-dom";
import Toast from "../components/Toast";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setToast("Please fill in all fields.");
      setTimeout(() => setToast(null), 3000);
      return;
    }

    const result = await dispatch(loginUser(formData));
    if (result.error) {
        setToast(result.error.message);
        setTimeout(() => setToast(null), 3000);
    } else {
      if (result.payload.role === "student") {
        console.log(result.payload.role);
        navigate("/homepage");
      }
      else {
        console.log(result.payload.role);
        navigate("/admin");
      }
    }
  };

  return (
    <>
      {toast && <Toast message={toast} />}
      <div className="px-4 py-12">
        <div className="bg-white p-6 rounded shadow-md w-full max-w-md mx-auto">
          <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">Login</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-sm text-center mt-4">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;