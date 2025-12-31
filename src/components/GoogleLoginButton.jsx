import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const GoogleLoginButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showRoleSelect, setShowRoleSelect] = useState(false);
  const [selectedRole, setSelectedRole] = useState("student");
  const [googleCredential, setGoogleCredential] = useState(null);

  const handleGoogleResponse = async (credential, role = null) => {
    const res = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/auth/google`,
      { credential, role }
    );

    // 🔹 EXISTING USER → LOGIN DIRECTLY
    if (res.data.status === "LOGIN") {
      localStorage.setItem("eventhub user", JSON.stringify(res.data.user));
      dispatch(setUser(res.data.user));

      if (res.data.user.role === "admin") navigate("/admin");
      else navigate("/homepage");
    }

    // 🔹 NEW USER → ASK ROLE
    if (res.data.status === "ROLE_REQUIRED") {
      setGoogleCredential(credential);
      setShowRoleSelect(true);
    }
  };

  const handleSuccess = async (credentialResponse) => {
    try {
      await handleGoogleResponse(credentialResponse.credential);
    } catch (error) {
      alert("Google login failed");
    }
  };

  const handleRoleSubmit = async () => {
    try {
      await handleGoogleResponse(googleCredential, selectedRole);
      setShowRoleSelect(false);
    } catch (error) {
      alert("Role selection failed");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Google Button */}
      {!showRoleSelect && (
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => alert("Google login failed")}
        />
      )}

      {/* Role Selection */}
      {showRoleSelect && (
        <div className="bg-white border p-4 rounded shadow w-64 text-center">
          <h3 className="font-semibold mb-3">Select your role</h3>

          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full border rounded px-2 py-1 mb-3"
          >
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>

          <button
            onClick={handleRoleSubmit}
            className="w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
};

export default GoogleLoginButton;
