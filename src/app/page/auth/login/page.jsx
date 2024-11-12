'use client';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { FaGoogle, FaGithub, FaEnvelope, FaLock } from 'react-icons/fa';
import { loginDispatch } from 'game/app/store/authSlice/authslice';
import { useLoginUserMutation } from 'game/app/store/services/users/user.api';
import emailInputHook from 'game/app/hooks/users/email-input-hook';
import passwordInputHook from 'game/app/hooks/users/password-input-hook';

export default function LoginPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [errorMessage, setError] = useState(null);
    const [isFormValid, setIsFormValid] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loginUser] = useLoginUserMutation();
    const emailInput = emailInputHook('');
    const passwordInput = passwordInputHook('');

    useEffect(() => {
        const isValid =
            emailInput.isEmailValid && passwordInput.isPasswordValid;
        setIsFormValid(isValid);
    }, [
        emailInput.value,
        passwordInput.value,
        emailInput.isEmailValid,
        passwordInput.isPasswordValid,
    ]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const userData = await loginUser({
                email: emailInput.value,
                password: passwordInput.value,
            }).unwrap();
            const datauser = {
                token: userData.token,
                user: userData.data,
            };
            dispatch(loginDispatch(datauser));
            setLoading(true);
            router.push('/');
        } catch (error) {
            console.log('Error en la respuesta:', error);
            if (error.data) {
                console.log('Data del error:', error.data.message);
                setError(
                    error.data.message || 'Error sin mensaje personalizado',
                );
            } else {
                setError('Error de red o de configuración');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {};

    const handleGithubSignIn = async () => {};

    return (
        <div className="signinwrapper">
            <div className="signinbackdrop"></div>
            <Form className="shadow p-4 bgform rounded" onSubmit={handleSubmit}>
                <Row className="justify-content-center mb-4 my-4">
                    <div className="h4 mb-4 text-center text-bold">
                        Snake Game
                    </div>
                </Row>

                <Form.Group className="mb-4" controlId="email">
                    <div className="input-group">
                        <span className="input-group-text">
                            <FaEnvelope />
                        </span>
                        <Form.Control
                            type="text"
                            placeholder="email"
                            value={emailInput.value}
                            onChange={emailInput.onChange}
                            required
                            autoComplete=""
                            className="form-control input-white-placeholder"
                        />
                    </div>
                    {emailInput.error && (
                        <Alert variant="danger" className="fontalert">
                            {emailInput.error}
                        </Alert>
                    )}
                </Form.Group>

                <Form.Group className="mb-4" controlId="password">
                    <div className="input-group">
                        <span className="input-group-text">
                            <FaLock />
                        </span>
                        <Form.Control
                            type={
                                passwordInput.isPasswordVisible
                                    ? 'text'
                                    : 'password'
                            }
                            placeholder="Contraseña"
                            value={passwordInput.value}
                            onChange={passwordInput.onChange}
                            autoComplete=""
                            className="form-control input-white-placeholder"
                            required
                        />
                        <button
                            type="button"
                            onClick={passwordInput.togglePasswordVisibility}
                            className="bordercolor btn btn-outline-secondary"
                        >
                            {passwordInput.isPasswordVisible ? (
                                <AiFillEyeInvisible />
                            ) : (
                                <AiFillEye />
                            )}
                        </button>
                    </div>
                    {passwordInput.error && (
                        <Alert variant="danger" className="fontalert">
                            {passwordInput.error}
                        </Alert>
                    )}
                </Form.Group>

                <Form.Group className="mb-2 my-4">
                    <Button
                        className="w-100"
                        variant="warning"
                        type="submit"
                        disabled={!isFormValid}
                    >
                        {loading ? 'Cargando...' : 'Aceptar'}
                    </Button>
                </Form.Group>

                <Form.Group className="mb-2">
                    <div style={{ textAlign: 'center' }}>
                        <div
                            className="mx-2 text-2 text-white"
                            type="button"
                            onClick={() => router.push('/page/auth/register')}
                        >
                            No eres un miembro?{' '}
                            <span style={{ color: '#ffc008' }}>
                                Registrate ahora!
                            </span>
                        </div>
                    </div>
                </Form.Group>

                <Form.Group className="mb-2">
                    <Row>
                        <div className="d-flex align-items-center my-3">
                            <hr className="login-register-hr flex-grow-1" />
                            <span className="mx-2 text-2 text-white-50">
                                Ingrese con perfil social
                            </span>
                            <hr className="login-register-hr flex-grow-1" />
                        </div>
                    </Row>
                    <Row className="mb-4 justify-content-center">
                        <Col xs="auto" className="text-center">
                            <div className="d-flex flex-row align-items-center gap-2">
                                <Button
                                    variant="primary"
                                    onClick={handleGoogleSignIn}
                                >
                                    <FaGoogle />
                                </Button>
                                <Button
                                    variant="dark"
                                    onClick={handleGithubSignIn}
                                >
                                    <FaGithub />
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Form.Group>

                {errorMessage && (
                    <div className="error text-white">{errorMessage}</div>
                )}
            </Form>
        </div>
    );
}
