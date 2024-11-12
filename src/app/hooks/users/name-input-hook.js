import { useState } from "react";

const nameInputHook = (initialValue = "") => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState("");
  const isNameValid = value.length > 5;

  const handleChange = (e) => {
    const nameValue = e.target.value;
    setValue(nameValue);
    if (nameValue.length < 6) {
      setError("El campo debe ser mayor de 5 caracteres.");
      return;
    } else {
      setError(null);
    }
  };

  const reset = () => {
    setValue(initialValue);
    setError("");
  };

  return {
    value,
    onChange: handleChange,
    reset,
    isNameValid,
    error,
  };
};

export default nameInputHook;
