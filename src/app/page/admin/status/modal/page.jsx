'use client';
import 'game/app/page/css/modal.css';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { FaTimes } from 'react-icons/fa';
import { TbLockFilled } from 'react-icons/tb';
import { Form, Button, Alert, FormGroup } from 'react-bootstrap';
import { usePatchDataMutation } from 'game/app/store/services/users/user.api';

const EditUserModal = ({ isOpen, onRequestClose, user, onSave }) => {
    const router = useRouter();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const [editedUser, setEditedUser] = useState({
        email: '',
        name: '',
        role: '',
        avatar: '',
        status: '',
        username: '',
    });
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/page/auth/login');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return null;

    useEffect(() => {
        if (isOpen && user) {
            setEditedUser(user);
            setSuccessMessage('');
        }
    }, [user, isOpen]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedUser((prev) => ({ ...prev, [name]: value }));
    };

    const [patchData, { isLoading, isError, error }] = usePatchDataMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = editedUser.userId;
        const datau = editedUser;
        try {
            const result = await patchData({ userId, data: datau }).unwrap();
            setSuccessMessage(
                result.message ? result.message : 'Error inesperado',
            );
            onSave(editedUser);
            onRequestClose();
        } catch (err) {
            console.error('Error updating user:', err);
            setSuccessMessage(null);
        }
    };

    return (
        <Modal show={isOpen} onHide={onRequestClose} className="modal-custom">
            <Modal.Header closeButton className="modal-header">
                <Modal.Title>Bloquear Usuario</Modal.Title>
                <FaTimes
                    onClick={onRequestClose}
                    style={{
                        cursor: 'pointer',
                        color: 'white',
                        fontSize: '1.5rem',
                        marginLeft: 'auto',
                    }}
                />
            </Modal.Header>
            <Modal.Body>
                <Form className="p-3 bgform" onSubmit={handleSubmit}>
                    <Row>
                        <div className="mb-2">
                            <p className="tit m-0">Correo</p>
                            <p className="form-control input-white-placeholder p-2">
                                {editedUser.email}
                            </p>
                        </div>

                        <div className="mb-2">
                            <p className="tit m-0">Usuario</p>
                            <p className="form-control input-white-placeholder p-2">
                                {editedUser.username}
                            </p>
                        </div>

                        <div className="mb-2">
                            <p className="tit m-0">Nombre</p>
                            <p className="form-control input-white-placeholder p-2">
                                {editedUser.name}
                            </p>
                        </div>

                        <div className="mb-2">
                            <p className="tit m-0">Role</p>
                            <p className="form-control input-white-placeholder p-2">
                                {editedUser.role}
                            </p>
                        </div>

                        <FormGroup className="mb-2" controlId="status">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <TbLockFilled />
                                </span>
                                <Form.Select
                                    name="status"
                                    className="form-control input-white-placeholder"
                                    value={editedUser.status}
                                    onChange={handleInputChange}
                                >
                                    <option value="ACTIVE">Activo</option>
                                    <option value="BLOCKED">Bloqueado</option>
                                </Form.Select>
                            </div>
                        </FormGroup>

                        <Form.Group className="pt-2 mb-2">
                            <Button
                                variant="warning"
                                type="submit"
                                disabled={isLoading}
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
                                    'Error al actualizar el usuario'}
                            </Alert>
                        )}
                    </Row>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EditUserModal;
