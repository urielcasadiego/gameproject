import { useState } from 'react';

const emailInputHook = (initialValue) => {
    const [value, setValue] = useState(initialValue);
    const [error, setError] = useState(null);
    const isEmailValid =
        value.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    const handleChange = (e) => {
        const emailValue = e.target.value;
        setValue(emailValue);

        if (emailValue.length > 0) {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
                setError('Por favor, ingresa un email válido.');
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

    return {
        value,
        reset,
        onChange: handleChange,
        error,
        isEmailValid,
    };
};

export default emailInputHook;
