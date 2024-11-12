'use client';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Button, Alert, FormGroup } from 'react-bootstrap';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { FaGoogle, FaGithub, FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import { useRegisterUserMutation } from 'game/app/store/services/users/user.api';
import emailInputHook from 'game/app/hooks/users/email-input-hook';
import passwordInputHook from 'game/app/hooks/users/password-input-hook';
import nameInputHook from 'game/app/hooks/users/name-input-hook';

export default function RegisterPage() {
    const router = useRouter();
    const [isFormValid, setIsFormValid] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [registerUser] = useRegisterUserMutation();
    const emailInput = emailInputHook('');
    const passwordInput = passwordInputHook('');
    const usernameInput = nameInputHook('');
    const nameInput = nameInputHook('');

    useEffect(() => {
        const isValid =
            emailInput.isEmailValid &&
            passwordInput.isPasswordValid &&
            usernameInput.isNameValid;
        setIsFormValid(isValid);
    }, [
        emailInput.value,
        passwordInput.value,
        usernameInput.value,
        nameInput.value,
        emailInput.isEmailValid,
        passwordInput.isPasswordValid,
        usernameInput.isNameValid,
        nameInput.isNameValid,
    ]);

    const handleGoogleSignIn = async () => {};

    const handleGithubSignIn = async () => {};

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage(null);
        setLoading(true);
        const userData = {
            email: emailInput.value,
            password: passwordInput.value,
            username: usernameInput.value,
            name: nameInput.value,
            role: 'PLAYER',
            status: 'ACTIVE',
        };
        try {
            const response = await registerUser(userData).unwrap();
            setSuccessMessage(response.message);
            router.replace('/page/auth/login');
        } catch (error) {
            console.log(error);
            setSuccessMessage('Error al registrar usuario.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signinwrapper">
            <div className="signinbackdrop"></div>
            <Form
                className="shadow bgform rounded formprofile"
                onSubmit={handleSubmit}
            >
                <Row className="m-0">
                    <Col md={6} className="p-5 bgcol1">
                        <Form.Group className="mb-2">
                            <Row className="mb-4">
                                <div className="d-flex align-items-center">
                                    <hr className="login-register-hr flex-grow-1" />
                                    <span className="mx-2 text-2 text-white-50">
                                        Registrese con perfil de redes sociales
                                    </span>
                                    <hr className="login-register-hr flex-grow-1" />
                                </div>
                            </Row>
                            <Row className="mb-4 justify-content-center my-4">
                                <Col xs="auto" className="text-center w-100">
                                    <div className="align-items-center gap-2">
                                        <Button
                                            className="w-100 mb-4"
                                            variant="primary"
                                            onClick={handleGoogleSignIn}
                                        >
                                            <FaGoogle />
                                            &nbsp; Registrarse con Google
                                        </Button>
                                        <Button
                                            className="w-100 mb-4"
                                            variant="dark"
                                            onClick={handleGithubSignIn}
                                        >
                                            <FaGithub />
                                            &nbsp; Registrarse con GitHub
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="mb-2">
                                <div className="text-center">
                                    <span className="mx-2 text-2 text-white-50">
                                        Ya eres miembro
                                    </span>{' '}
                                    <span
                                        className="text-white cursor-pointer"
                                        onClick={() =>
                                            router.push('/page/auth/login')
                                        }
                                    >
                                        Inicia sesión ahora
                                    </span>
                                </div>
                            </Row>
                        </Form.Group>
                    </Col>
                    <Col md={6} className="p-5">
                        <Row className="justify-content-center my-4">
                            <Col xs="auto">
                                <div className="h4 mb-4 text-center">
                                    Registro
                                </div>
                            </Col>
                        </Row>
                        <FormGroup className="mb-2" controlId="username">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <FaUser />
                                </span>
                                <Form.Control
                                    type="text"
                                    placeholder="Username"
                                    value={usernameInput.value}
                                    onChange={usernameInput.onChange}
                                    className="form-control input-white-placeholder"
                                    required
                                />
                            </div>
                            {usernameInput.error && (
                                <Alert variant="danger" className="fontalert">
                                    {usernameInput.error}
                                </Alert>
                            )}
                        </FormGroup>
                        <FormGroup className="mb-2" controlId="name">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <FaUser />
                                </span>
                                <Form.Control
                                    type="text"
                                    placeholder="Nombre"
                                    value={nameInput.value}
                                    onChange={nameInput.onChange}
                                    className="form-control input-white-placeholder"
                                    required
                                />
                            </div>
                            {nameInput.error && (
                                <Alert variant="danger" className="fontalert">
                                    {nameInput.error}
                                </Alert>
                            )}
                        </FormGroup>
                        <FormGroup className="mb-2" controlId="email">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <FaEnvelope />
                                </span>
                                <Form.Control
                                    type="text"
                                    placeholder="email"
                                    value={emailInput.value}
                                    onChange={emailInput.onChange}
                                    className="form-control input-white-placeholder"
                                    required
                                />
                            </div>
                            {emailInput.error && (
                                <Alert variant="danger" className="fontalert">
                                    {emailInput.error}
                                </Alert>
                            )}{' '}
                            {}
                        </FormGroup>
                        <Form.Group className="mb-2" controlId="password">
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
                                    onClick={
                                        passwordInput.togglePasswordVisibility
                                    }
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
                                className="w-100 mb-2"
                                variant="warning"
                                type="submit"
                                disabled={!isFormValid}
                            >
                                {loading ? 'Cargando...' : 'Aceptar'}
                            </Button>
                        </Form.Group>
                    </Col>
                </Row>
                {successMessage && (
                    <Alert variant="primary" className="fontalert">
                        {successMessage}
                    </Alert>
                )}{' '}
                {}
            </Form>
        </div>
    );
}
