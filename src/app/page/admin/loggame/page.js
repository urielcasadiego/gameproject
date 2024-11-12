'use client';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Pagination from 'game/app/components/layout/pagination/page';
import LogTable from 'game/app/components/layout/tables/logsgame/page';
import { useGetAllLogsQuery } from 'game/app/store/services/logsgame/logsgame.api';

export default function AdminLogsPage() {
    const router = useRouter();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const [currentPage, setCurrentPage] = useState(1);
    const entriesPerPage = 10;

    const {
        data: logsData,
        isLoading: loading,
        error,
        refetch: refetchLogs,
    } = useGetAllLogsQuery(
        { page: currentPage, limit: entriesPerPage },
        { skip: !isAuthenticated },
    );

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/page/auth/login');
        }
    }, [isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated) {
            refetchLogs();
        }
    }, [isAuthenticated, refetchLogs]);

    if (!isAuthenticated) return null;

    const logs = logsData?.data || [];
    const totalPages = logsData?.totalPages || 1;
    const totalEntries = logsData?.totalEntries;
    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="signinwrapper">
            {error ? (
                <div className="container mt-4">
                    <p className="text-white mt-4">
                        Error de autenticación. Inicia sesión nuevamente.
                    </p>
                </div>
            ) : (
                <div className="container">
                    {loading && <p className="text-white p-4">Loading...</p>}
                    {!loading && !error && (
                        <div className="table-wrapper">
                            <LogTable logs={logsData.data} />
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
                    )}
                </div>
            )}
        </div>
    );
}
