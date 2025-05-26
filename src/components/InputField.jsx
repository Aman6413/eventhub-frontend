const InputField = ({ label, name, value, onChange, type = "text" }) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="mb-1 font-medium text-sm">{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />
    </div>
  );
};

export default InputField;