'use client';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Pagination from 'game/app/components/layout/pagination/page';
import UserTable from 'game/app/components/layout/tables/users/page';
import { useGetAllUsersQuery } from 'game/app/store/services/users/user.api';

export default function AdminUsersPage() {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const entriesPerPage = 10;

    const { data, error, isLoading, refetch } = useGetAllUsersQuery(
        {
            page: currentPage,
            limit: entriesPerPage,
        },
        { skip: !isAuthenticated },
    );
    const totalPages = data?.totalPages || 1;
    const totalEntries = data?.totalEntries;
    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/page/auth/login');
        }
    }, [isAuthenticated, router]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    if (!isAuthenticated) return null;

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
                    {isLoading && <p className="text-white p-4">Loading...</p>}
                    {error && (
                        <p className="text-danger">Error: {error.message}</p>
                    )}
                    {!isLoading && !error && (
                        <div className="table-wrapper">
                            <div className="table-title">
                                <div className="row">
                                    <div className="col-sm-6 m-0">
                                        <h2>Usuarios</h2>
                                    </div>
                                </div>
                            </div>
                            <UserTable
                                users={data?.data || []}
                                action={false}
                            />
                            <div className="pt-1 mb-4">
                                <Pagination
                                    key={currentPage}
                                    currentPage={currentPage}
                                    totalEntries={totalEntries}
                                    entriesPerPage={entriesPerPage}
                                    totalPages={totalPages}
                                    hasNextPage={hasNextPage}
                                    hasPrevPage={hasPrevPage}
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
