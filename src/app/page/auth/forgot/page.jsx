'use client';
import Row from 'react-bootstrap/Row';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { FaEnvelope } from 'react-icons/fa';
import { loginSuccess } from 'game/app/store/slice/authslice';
import { useLoginUserMutation } from 'game/app/store/services/users/user.api';
import emailInputHook from 'game/app/hooks/users/email-input-hook';

export default function LoginPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [errorMessage, setError] = useState(null);
    const [isFormValid, setIsFormValid] = useState(false);
    const [loading, setLoading] = useState(false);

    const [loginUser] = useLoginUserMutation();

    const emailInput = emailInputHook('');

    useEffect(() => {
        const isValid = emailInput.isEmailValid;
        setIsFormValid(isValid);
    }, [emailInput.value, emailInput.isEmailValid]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const userData = await loginUser({
                email: emailInput.value,
            }).unwrap();
            dispatch(loginSuccess(userData));
            setLoading(true);
            router.push('/');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signinwrapper">
            <div className="signinbackdrop"></div>
            <Form className="shadow p-4 bgform rounded" onSubmit={handleSubmit}>
                <Row className="justify-content-center mb-4 my-4">
                    <div className="h4 mb-4 text-center text-bold">
                        Recuperar contraseña
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
                <Row className="mb-2">
                    <div className="text-center">
                        <span className="mx-2 text-2 text-white-50">
                            Regresar a
                        </span>{' '}
                        <span
                            className="text-white cursor-pointer"
                            onClick={() => router.push('/page/auth/login')}
                        >
                            Inicio de sesión
                        </span>
                    </div>
                </Row>
                {errorMessage && <div className="error">{errorMessage}</div>}
            </Form>
        </div>
    );
}
