'use client';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import DeleteScoreModal from './modal-delete/page';
import Pagination from 'game/app/components/layout/pagination/page';
import ScoreTable from 'game/app/components/layout/tables/score/page';
import { useGetAllScoresNameQuery } from 'game/app/store/services/scores/score.api';
import { useGetvalidTokenQuery } from 'game/app/store/services/users/user.api';

export default function AdminScoresdeletePage() {
    const router = useRouter();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const [selectedScore, setSelectedScore] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
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
        refetch,
        totalEntries: totales,
    } = useGetAllScoresNameQuery(
        {
            page: currentPage,
            limit: entriesPerPage,
        },
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
            refetch();
        }
    }, [isAuthenticated, tokenLoading, refetchToken, refetch]);

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

    const handleEdit = (score) => {
        setSelectedScore(score);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteRequestClose = () => {
        setIsDeleteModalOpen(false);
        setSelectedScore(null);
    };

    const handleDelete = async (scoreId) => {
        try {
            refetch();
            handleDeleteRequestClose();
        } catch (error) {
            console.error('Error eliminando el puntaje:', error);
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
                                        <h2>Eliminar Puntuaciones</h2>
                                    </div>
                                </div>
                            </div>
                            <ScoreTable
                                scores={scores}
                                action={true}
                                onEdit={handleEdit}
                            />
                            {isDeleteModalOpen && (
                                <DeleteScoreModal
                                    isOpen={isDeleteModalOpen}
                                    onRequestClose={handleDeleteRequestClose}
                                    score={selectedScore}
                                    onDelete={() =>
                                        handleDelete(selectedScore.scoreId)
                                    }
                                />
                            )}
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
            ;
        </div>
    );
}
