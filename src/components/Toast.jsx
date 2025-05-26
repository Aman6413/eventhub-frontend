// src/components/Toast.jsx
const Toast = ({ message, type = "error" }) => {
  return (
    <div className={`fixed top-12 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded shadow text-white z-50
      ${type === "error" ? "bg-red-500" : "bg-green-500"}`}>
      {message}
    </div>
  );
};

export default Toast;