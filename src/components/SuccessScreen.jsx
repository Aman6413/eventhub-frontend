import React from "react";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

const SuccessScreen = ({ message }) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-xl mx-auto mt-20 p-6 bg-white shadow rounded text-center">
      <h2 className="text-2xl font-bold text-green-600 mb-4">🎉 {message}</h2>
      <Button onClick={() => navigate("/homepage")}>Go to Homepage</Button>
    </div>
  );
};

export default SuccessScreen;