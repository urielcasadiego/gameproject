import { useState } from 'react';

const passwordInputHook = (initialValue) => {
    const [value, setValue] = useState(initialValue);
    const [error, setError] = useState(null);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const isPasswordValid =
        value.length >= 8 &&
        /^[A-Z]/.test(value) &&
        /(?=.*[A-Za-z])(?=.*\d)/.test(value);

    const handleChange = (e) => {
        const passwordValue = e.target.value;
        setValue(passwordValue);
        if (passwordValue.length > 0) {
            if (passwordValue.length < 8) {
                setError('La contraseña debe tener al menos 8 caracteres.');
                return;
            }
            if (!/^[A-Z]/.test(passwordValue)) {
                setError('La primera letra debe ser mayúscula.');
                return;
            }
            if (!/(?=.*[A-Za-z])(?=.*\d)/.test(passwordValue)) {
                setError(
                    'La contraseña debe contener al menos una letra y un número.',
                );
                return;
            }
            setError(null);
        } else {
            setError(null);
        }
    };

    const reset = () => {
        setValue(initialValue);
        setError('');
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prev) => !prev);
    };

    return {
        value,
        reset,
        onChange: handleChange,
        error,
        isPasswordVisible,
        isPasswordValid,
        togglePasswordVisibility,
    };
};

export default passwordInputHook;
