'use client';
import 'game/app/page/css/modal.css';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { FaTimes } from 'react-icons/fa';
import { Form, Button, Alert } from 'react-bootstrap';
import { useDeleteDataMutation } from 'game/app/store/services/users/user.api';

const DeleteUserModal = ({ isOpen, onRequestClose, user, onDelete }) => {
    const router = useRouter();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const [deleteUser, setDeleteUser] = useState({
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
            setDeleteUser(user);
            setSuccessMessage('');
        }
    }, [user, isOpen]);

    const [deleteData, { isLoading, isError, error }] = useDeleteDataMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = deleteUser.userId;
        const datau = deleteUser;
        try {
            const result = await deleteData({ userId, data: datau }).unwrap();
            setSuccessMessage(
                result.message ? result.message : 'Error inesperado',
            );
            onDelete(userId);
            onRequestClose();
        } catch (err) {
            console.error('Error updating user:', err);
            setSuccessMessage(null);
        }
    };

    return (
        <Modal show={isOpen} onHide={onRequestClose} className="modal-custom">
            <Modal.Header closeButton className="modal-header">
                <Modal.Title>Eliminar Usuario</Modal.Title>
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
                                {deleteUser.email}
                            </p>
                        </div>

                        <div className="mb-2">
                            <p className="tit m-0">Usuario</p>
                            <p className="form-control input-white-placeholder p-2">
                                {deleteUser.username}
                            </p>
                        </div>

                        <div className="mb-2">
                            <p className="tit m-0">Nombre</p>
                            <p className="form-control input-white-placeholder p-2">
                                {deleteUser.name}
                            </p>
                        </div>

                        <div className="mb-2">
                            <p className="tit m-0">Role</p>
                            <p className="form-control input-white-placeholder p-2">
                                {deleteUser.role}
                            </p>
                        </div>

                        <div className="mb-2">
                            <p className="tit m-0">Estado</p>
                            <p className="form-control input-white-placeholder p-2">
                                {deleteUser.status}
                            </p>
                        </div>

                        <Form.Group className="pt-2 mb-2">
                            <Button
                                variant="warning"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Cargando...' : 'Eliminar'}
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

export default DeleteUserModal;
