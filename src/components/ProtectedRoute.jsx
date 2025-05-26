import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useSelector((state) => state.auth);

    if (!user && localStorage.getItem("eventhub user")) {
        // Load user from localStorage (optional)
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/login" replace />;
    }

    return children;
};


export default ProtectedRoute;
