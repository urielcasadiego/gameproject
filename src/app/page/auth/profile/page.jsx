'use client';
import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Form, Button, Alert, FormGroup } from 'react-bootstrap';
import { FaEnvelope, FaUser, FaUserCog, FaCamera } from 'react-icons/fa';
import { HiStatusOnline } from 'react-icons/hi';
import imageCompression from 'browser-image-compression';
import { profileDispatch } from 'game/app/store/authSlice/authslice';
import {
    useUpdateUserProfileMutation,
    useUploadImageMutation,
    useGetvalidTokenQuery,
} from 'game/app/store/services/users/user.api';
import emailInputHook from 'game/app/hooks/users/email-input-hook';
import nameInputHook from 'game/app/hooks/users/name-input-hook';

export default function RegisterProfilePage() {
    const router = useRouter();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const dispatch = useDispatch();
    const [isFormValid, setIsFormValid] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [updateUser] = useUpdateUserProfileMutation();
    const datauser = useSelector((state) => state.auth.user);
    const [uploadImage] = useUploadImageMutation();
    const emailInput = emailInputHook(datauser?.email || '');
    const usernameInput = nameInputHook(datauser?.username || '');
    const nameInput = nameInputHook(datauser?.name || '');
    const roleInput = nameInputHook(datauser?.role || '');
    const statusInput = nameInputHook(datauser?.status || '');
    const [imagePreview, setImagePreview] = useState(datauser?.avatar || '');
    const {
        error: tokenError,
        isLoading: tokenLoading,
        refetch: refetchToken,
    } = useGetvalidTokenQuery(undefined, {
        skip: !isAuthenticated,
    });

    const xSkip = !isAuthenticated || tokenLoading;

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/page/auth/login');
        }
    }, [isAuthenticated, router]);

    useEffect(() => {
        if (datauser) {
            setLoading(false);
        }
        const isValid = usernameInput.isNameValid && nameInput.isNameValid;
        setIsFormValid(isValid);
    }, [
        router,
        usernameInput.value,
        nameInput.value,
        usernameInput.isNameValid,
        nameInput.isNameValid,
    ]);

    useEffect(() => {
        if (isAuthenticated && !tokenLoading) {
            refetchToken();
        }
    }, [isAuthenticated, tokenLoading, refetchToken]);

    if (!isAuthenticated) return null;

    const handleImageChange = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    const compressedFile = await imageCompression(file, {
                        maxSizeMB: 1,
                        maxWidthOrHeight: 800,
                        useWebWorker: true,
                    });
                    const renamedFile = new File([compressedFile], file.name, {
                        type: compressedFile.type,
                    });

                    const formData = new FormData();
                    formData.append('file', renamedFile);
                    const response = await uploadImage(formData);

                    if (response.data) {
                        console.log('Imagen subida con éxito:', response);
                        setImagePreview(response.data.path);
                    }
                } catch (error) {
                    console.log('Error al comprimir la imagen:', error);
                }
            }
        };
        input.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage(null);
        setLoading(true);
        try {
            const updatedUser = {
                ...datauser,
                email: emailInput.value,
                username: usernameInput.value,
                name: nameInput.value,
                avatar: imagePreview,
            };
            const response = await updateUser({
                userId: updatedUser.userId,
                body: updatedUser,
            }).unwrap();
            setSuccessMessage(response.message);
            dispatch(
                profileDispatch({
                    ...updatedUser,
                }),
            );
            router.push('/');
        } catch (error) {
            setSuccessMessage('Error al actualizar perfil.');
        } finally {
            setLoading(false);
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
                <Form
                    className="shadow mt-4 bgform rounded formprofile"
                    onSubmit={handleSubmit}
                >
                    <Row className="justify-content-center my-4">
                        <Col xs="auto">
                            <div className="h4 mb-4 text-center">Perfil</div>
                        </Col>
                    </Row>
                    <Row className="px-4">
                        <Col md={4} className="text-center">
                            <div className="profile-image-container mb-3">
                                {imagePreview ? (
                                    <img
                                        src={`http://localhost:3001${imagePreview}`}
                                        alt="Avatar"
                                        className="profile-image"
                                        style={{
                                            borderRadius: '50%',
                                            width: '150px',
                                            height: '150px',
                                            objectFit: 'cover',
                                        }}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            borderRadius: '50%',
                                            width: '150px',
                                            height: '150px',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: '#f0f0f0',
                                        }}
                                    >
                                        <FaUser
                                            style={{
                                                fontSize: '50px',
                                                color: '#ccc',
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                            <div
                                className="text-white text-center cursor-pointer"
                                onClick={handleImageChange}
                            >
                                <FaCamera style={{ marginTop: '-3px' }} />{' '}
                                &nbsp;
                                <span className="my-1">Modificar Imagen</span>
                            </div>
                        </Col>
                        <Col md={8} className="px-4">
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
                                    <Alert
                                        variant="danger"
                                        className="fontalert"
                                    >
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
                                    <Alert
                                        variant="danger"
                                        className="fontalert"
                                    >
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
                                        placeholder="Email"
                                        value={emailInput.value}
                                        className="form-control-disabled input-white-placeholder"
                                        readOnly
                                        required
                                    />
                                </div>
                            </FormGroup>

                            <FormGroup className="mb-2" controlId="role">
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <FaUserCog />
                                    </span>
                                    <Form.Control
                                        type="text"
                                        placeholder="Role"
                                        value={roleInput.value}
                                        className="form-control-disabled input-white-placeholder"
                                        readOnly
                                        required
                                    />
                                </div>
                            </FormGroup>

                            <FormGroup className="mb-2" controlId="status">
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <HiStatusOnline />
                                    </span>
                                    <Form.Control
                                        type="text"
                                        placeholder="Estado"
                                        value={statusInput.value}
                                        className="form-control-disabled input-white-placeholder"
                                        readOnly
                                        required
                                    />
                                </div>
                            </FormGroup>

                            <Form.Group className="mb-2 my-4">
                                <Button
                                    className="mb-2"
                                    style={{ marginRight: '15px' }}
                                    variant="warning"
                                    type="submit"
                                    disabled={!isFormValid}
                                >
                                    {loading ? 'Cargando...' : 'Aceptar'}
                                </Button>
                            </Form.Group>
                            {successMessage && (
                                <Alert variant="primary" className="fontalert">
                                    {successMessage}
                                </Alert>
                            )}
                        </Col>
                    </Row>
                </Form>
            )}
        </div>
    );
}
