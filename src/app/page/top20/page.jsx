'use client';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import ScoreTableTop20 from 'game/app/components/layout/tables/top20/page';
import { useGetvalidTokenQuery } from 'game/app/store/services/users/user.api';
import { useGetAllScoresTop20Query } from 'game/app/store/services/scores/score.api';

export default function AdminScoresTopPage() {
    const router = useRouter();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

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
    } = useGetAllScoresTop20Query(undefined, {
        skip: xSkip,
    });

    const scores = scoresData?.data || [];

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
    }, [isAuthenticated, tokenLoading, refetchToken]);

    if (!isAuthenticated) return null;

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
                                        <h2>Top 20 en Puntuaciones</h2>
                                    </div>
                                </div>
                            </div>
                            <ScoreTableTop20 scores={scores} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
