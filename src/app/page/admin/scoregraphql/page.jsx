'use client';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Pagination from 'game/app/components/layout/pagination/page';
import ScoreTable from 'game/app/components/layout/tables/score/page';
import { useGetvalidTokenQuery } from 'game/app/store/services/users/user.api';
import { useGetAllScoresNameGraphqlQuery } from 'game/app/store/services/scores/scoregraphql';

export default function AdminScoresPageGraphql() {
    const router = useRouter();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const [currentPage, setCurrentPage] = useState(1);
    const entriesPerPage = 10;

    const {
        error: tokenError,
        isLoading: tokenLoading,
        refetch: refetchToken,
    } = useGetvalidTokenQuery(undefined, {
        skip: !isAuthenticated,
    });

    const xSkip = !isAuthenticated || tokenLoading;

    const {
        data: scoresData,
        isLoading: loading,
        error,
        totalEntries: totales,
        refetch: refetchScores,
    } = useGetAllScoresNameGraphqlQuery(
        { page: currentPage, limit: entriesPerPage },
        { skip: xSkip },
    );

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/page/auth/login');
        }
    }, [isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated && !tokenLoading) {
            refetchToken();
            refetchScores();
        }
    }, [isAuthenticated, tokenLoading, refetchToken, refetchScores]);

    if (!isAuthenticated) return null;

    const scores = scoresData?.data || [];
    const totalPages = scoresData?.totalPages || 1;
    const totalEntries = scoresData?.totalEntries;
    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
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
                <div className="container">
                    {loading && <p className="text-white p-4">Loading...</p>}
                    {error && (
                        <p className="text-danger">Error: {error.message}</p>
                    )}
                    {!loading && !error && (
                        <div className="table-wrapper">
                            <div className="table-title">
                                <div className="row">
                                    <div className="col-sm-6 m-0">
                                        <h2>Puntuaciones con Graphql</h2>
                                    </div>
                                </div>
                            </div>
                            <ScoreTable scores={scores} />
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
