'use client';
import 'game/app/page/css/modal.css';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { FaTimes } from 'react-icons/fa';
import { Form, Button, Alert } from 'react-bootstrap';
import { useRegisterLogMutation } from 'game/app/store/services/logsgame/logsgame.api';
import { useDeleteScoreMutation } from 'game/app/store/services/scores/score.api';

const DeleteScoreModal = ({ isOpen, onRequestClose, score, onDelete }) => {
    const router = useRouter();
    const datauser = useSelector((state) => state.auth.user);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const [deleteScore, setDeleteScore] = useState({
        game: '',
        name: '',
        score: '',
        userId: '',
        scoreId: '',
        createdAt: '',
        updatedAt: '',
    });
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/page/auth/login');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return null;

    useEffect(() => {
        if (isOpen && score) {
            setDeleteScore({
                ...score,
                email: datauser.email,
            });
            setSuccessMessage('');
        }
    }, [score, isOpen, datauser.email]);

    const [deleteData, { isLoading, isError, error }] =
        useDeleteScoreMutation();

    const [createLog] = useRegisterLogMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const registerLog = {
                userId: deleteScore.userId,
                action: 'DELETE SCORE',
                email: deleteScore.email,
                adminid: datauser.email,
            };
            const result = await deleteData({
                scoreId: deleteScore.scoreId,
            }).unwrap();
            await createLog(registerLog).unwrap();
            setSuccessMessage(result.message);
            onDelete(deleteScore.scoreId);
            onRequestClose();
        } catch (err) {
            console.error('Error eliminando el puntaje:', err);
            setSuccessMessage(
                'No se pudo eliminar el puntaje. Intenta nuevamente.',
            );
        }
    };

    return (
        <Modal show={isOpen} onHide={onRequestClose} className="modal-custom">
            <Modal.Header closeButton className="modal-header">
                <Modal.Title>Eliminar Puntaje</Modal.Title>
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
                            <p className="tit m-0">Juego</p>
                            <p className="form-control input-white-placeholder p-2">
                                {deleteScore.game}
                            </p>
                        </div>

                        <div className="mb-2">
                            <p className="tit m-0">Usuario</p>
                            <p className="form-control input-white-placeholder p-2">
                                {deleteScore.name}
                            </p>
                        </div>

                        <div className="mb-2">
                            <p className="tit m-0">Puntaje</p>
                            <p className="form-control input-white-placeholder p-2">
                                {deleteScore.score}
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
                                    'Error al eliminar el score'}
                            </Alert>
                        )}
                    </Row>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default DeleteScoreModal;
