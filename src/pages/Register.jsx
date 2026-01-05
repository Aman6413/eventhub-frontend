import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUserThunk } from "../store/thunks/authThunk";
import InputField from "../components/InputField";
import Button from "../components/Button";
import Toast from "../components/Toast";
import { useNavigate } from "react-router-dom";
import GoogleLoginButton from "../components/GoogleLoginButton";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { name, email, password } = form;
    if (!name.trim()) return "Name is required.";
    if (!email.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "Enter a valid email.";
    if (!password.trim()) return "Password is required.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setToast(error);
      setTimeout(() => setToast(null), 3000);
      return;
    }

    const result = await dispatch(registerUserThunk(form));
    if (result.error) {
      setToast(result.error.message);
      setTimeout(() => setToast(null), 3000);
    } else {
      if (result.payload.role === "student") {
        console.log(result.payload.role);
        navigate("/homepage");
      } else {
        console.log(result.payload.role);
        navigate("/admin");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow relative">
      {toast && <Toast message={toast} />}
      <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">
        Create an Account
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
        />
        <InputField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
        />
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-sm">Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
          >
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </Button>
      </form>
      {/* <div className="my-4 text-center text-gray-500">OR</div>
      <GoogleLoginButton /> */}
    </div>
  );
};

export default Register;
