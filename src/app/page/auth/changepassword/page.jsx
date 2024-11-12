'use client';
import 'game/app/page/css/modal.css';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import { FaLock } from 'react-icons/fa';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { Form, Button, Alert } from 'react-bootstrap';
import passwordInputHook from 'game/app/hooks/users/password-input-hook';
import {
    useGetvalidTokenQuery,
    useChangeUserPasswordMutation,
} from 'game/app/store/services/users/user.api';

const ChangePasswordModal = () => {
    const router = useRouter();
    const currentPassword = passwordInputHook('');
    const newPassword = passwordInputHook('');
    const confirmPassword = passwordInputHook('');
    const datauser = useSelector((state) => state.auth.user);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const { error: tokenError } = useGetvalidTokenQuery(undefined, {
        pollingInterval: 100000,
        skip: !isAuthenticated,
    });

    const [passwordChange, { isLoading, isError, error }] =
        useChangeUserPasswordMutation();
    const [isFormValid, setIsFormValid] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/page/auth/login');
            return;
        }

        const isValid =
            currentPassword.isPasswordValid &&
            newPassword.isPasswordValid &&
            confirmPassword.isPasswordValid;
        setIsFormValid(isValid);
    }, [
        isAuthenticated,
        router,
        currentPassword.isPasswordValid,
        newPassword.isPasswordValid,
        confirmPassword.isPasswordValid,
    ]);

    if (!isAuthenticated) return null;

    const handlePasswordChange = (setPasswordState) => (e) => {
        setPasswordState((prev) => ({
            ...prev,
            value: e.target.value,
            error: '',
        }));
    };

    const toggleVisibility = (setPasswordState) => () => {
        setPasswordState((prev) => ({ ...prev, isVisible: !prev.isVisible }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword.value !== confirmPassword.value) {
            setSuccessMessage('Las contraseñas no coinciden');
            return;
        }
        try {
            const result = await passwordChange({
                userId: datauser.userId,
                body: {
                    currentPassword: currentPassword.value,
                    newPassword: newPassword.value,
                },
            }).unwrap();

            setSuccessMessage(result.message);
        } catch (err) {
            setSuccessMessage(null);
        }
    };

    return (
        <div className="signinwrapper">
            {tokenError ? (
                <div className="container mt-4">
                    <p className="text-white mt-4">
                        Sesión ha expirado. Por favor, inicia sesión nuevamente.
                    </p>
                </div>
            ) : (
                <Form className="p-3 bgform" onSubmit={handleSubmit}>
                    <Row>
                        <Form.Group
                            className="mb-4"
                            controlId="currentPassword"
                        >
                            <Row className="justify-content-center my-4">
                                <div xs="auto">
                                    <div className="h4 mb-4 text-center">
                                        Cambio de Contraseña
                                    </div>
                                </div>
                            </Row>
                            <div className="input-group">
                                <span className="input-group-text">
                                    <FaLock />
                                </span>
                                <Form.Control
                                    type={
                                        currentPassword.isPasswordVisible
                                            ? 'text'
                                            : 'password'
                                    }
                                    placeholder="Contraseña Actual"
                                    value={currentPassword.value}
                                    onChange={currentPassword.onChange}
                                    className="input-white-placeholder"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={
                                        currentPassword.togglePasswordVisibility
                                    }
                                    className="bordercolor btn btn-outline-secondary"
                                >
                                    {currentPassword.isPasswordVisible ? (
                                        <AiFillEyeInvisible />
                                    ) : (
                                        <AiFillEye />
                                    )}
                                </button>
                            </div>
                            {currentPassword.error && (
                                <Alert variant="danger" className="fontalert">
                                    {currentPassword.error}
                                </Alert>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="newPassword">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <FaLock />
                                </span>
                                <Form.Control
                                    type={
                                        newPassword.isPasswordVisible
                                            ? 'text'
                                            : 'password'
                                    }
                                    placeholder="Contraseña Nueva"
                                    value={newPassword.value}
                                    onChange={newPassword.onChange}
                                    className="input-white-placeholder"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={
                                        newPassword.togglePasswordVisibility
                                    }
                                    className="bordercolor btn btn-outline-secondary"
                                >
                                    {newPassword.isPasswordVisible ? (
                                        <AiFillEyeInvisible />
                                    ) : (
                                        <AiFillEye />
                                    )}
                                </button>
                            </div>
                            {newPassword.error && (
                                <Alert variant="danger" className="fontalert">
                                    {newPassword.error}
                                </Alert>
                            )}
                        </Form.Group>

                        <Form.Group
                            className="mb-4"
                            controlId="confirmPassword"
                        >
                            <div className="input-group">
                                <span className="input-group-text">
                                    <FaLock />
                                </span>
                                <Form.Control
                                    type={
                                        confirmPassword.isPasswordVisible
                                            ? 'text'
                                            : 'password'
                                    }
                                    placeholder="Confirmar Contraseña"
                                    value={confirmPassword.value}
                                    onChange={confirmPassword.onChange}
                                    className="input-white-placeholder"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={
                                        confirmPassword.togglePasswordVisibility
                                    }
                                    className="bordercolor btn btn-outline-secondary"
                                >
                                    {confirmPassword.isPasswordVisible ? (
                                        <AiFillEyeInvisible />
                                    ) : (
                                        <AiFillEye />
                                    )}
                                </button>
                            </div>
                            {confirmPassword.error && (
                                <Alert variant="danger" className="fontalert">
                                    {confirmPassword.error}
                                </Alert>
                            )}
                        </Form.Group>

                        <Form.Group className="pt-2 mb-2">
                            <Button
                                variant="warning"
                                type="submit"
                                disabled={isLoading || !isFormValid}
                            >
                                {isLoading ? 'Cargando...' : 'Aceptar'}
                            </Button>
                        </Form.Group>

                        {successMessage && (
                            <Alert variant="primary" className="fontalert">
                                {successMessage}
                            </Alert>
                        )}
                        {isError && (
                            <Alert variant="danger" className="fontalert">
                                {error?.data?.message ||
                                    'Error al actualizar la contraseña'}
                            </Alert>
                        )}
                    </Row>
                </Form>
            )}
        </div>
    );
};

export default ChangePasswordModal;
