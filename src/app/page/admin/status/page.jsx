'use client';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Pagination from 'game/app/components/layout/pagination/page';
import EditUserModal from './modal/page';
import DeleteUserModal from './modal-delete/page';
import UserTable from 'game/app/components/layout/tables/users/page';
import { useGetAllUsersQuery } from 'game/app/store/services/users/user.api';

export default function AdminUsersStatusPage() {
    const router = useRouter();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const entriesPerPage = 10;

    const { data, isLoading, error, refetch } = useGetAllUsersQuery(
        {
            page: currentPage,
            limit: entriesPerPage,
        },
        { skip: !isAuthenticated },
    );

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/page/auth/login');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return null;

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleEdit = (user, action) => {
        if (user.role === 'ADMIN') {
            alert('No puedes editar ni eliminar este usuario.');
            return;
        }
        setSelectedUser(user);
        if (action === 'Delete') {
            setIsDeleteModalOpen(true);
        } else {
            setIsModalOpen(true);
        }
    };

    const handleRequestClose = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    const handleDeleteRequestClose = () => {
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
    };

    const handleDelete = async (userId) => {
        try {
            refetch();
            handleDeleteRequestClose();
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
        }
    };

    return (
        <div className="signinwrapper">
            {error ? (
                <div className="container mt-4">
                    <p className="text-white mt-4">
                        Sesión ha expirado. Por favor, inicia sesión nuevamente.
                    </p>
                </div>
            ) : (
                <div className="container">
                    {isLoading && <p className="text-white pt-4">Loading...</p>}
                    {!isLoading && (
                        <div className="table-wrapper">
                            <div className="table-title">
                                <div className="row">
                                    <div className="col-sm-6 m-0">
                                        <h2>Editar Estado de Usuarios</h2>
                                    </div>
                                </div>
                            </div>
                            <UserTable
                                users={data?.data || []}
                                action={true}
                                onEdit={handleEdit}
                            />
                            {isModalOpen && (
                                <EditUserModal
                                    isOpen={isModalOpen}
                                    onRequestClose={handleRequestClose}
                                    user={selectedUser}
                                    onSave={() => refetch()}
                                />
                            )}
                            {isDeleteModalOpen && (
                                <DeleteUserModal
                                    isOpen={isDeleteModalOpen}
                                    onRequestClose={handleDeleteRequestClose}
                                    user={selectedUser}
                                    onDelete={() =>
                                        handleDelete(selectedUser.userId)
                                    }
                                />
                            )}
                            <div className="pt-1">
                                <Pagination
                                    key={currentPage}
                                    currentPage={currentPage}
                                    totalEntries={data?.totalEntries || 0}
                                    entriesPerPage={entriesPerPage}
                                    handlePageChange={handlePageChange}
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
