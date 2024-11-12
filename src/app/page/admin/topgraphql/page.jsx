'use client';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import ScoreTableTop20 from 'game/app/components/layout/tables/top20/page';
import { useGetvalidTokenQuery } from 'game/app/store/services/users/user.api';
import { useGetAllScoresTopNameGraphqlQuery } from 'game/app/store/services/scores/scoregraphql';

export default function AdminScoresTopPageGraphql() {
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
        refetch: refetchScores,
    } = useGetAllScoresTopNameGraphqlQuery(undefined, { skip: xSkip });

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
                                        <h2>Top 20 en Puntuaciones Graphql</h2>
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
