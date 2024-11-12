'use client';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logoutDispatch } from 'game/app/store/authSlice/authslice';

export default function LogoutButton() {
    const dispatch = useDispatch();
    const router = useRouter();

    const handleLogout = () => {
        dispatch(logoutDispatch());
    };

    return (
        <React.Fragment>
            <div
                style={{ color: 'rgb(75 248 200)', cursor: 'pointer' }}
                onClick={handleLogout}
            >
                Salir
            </div>
        </React.Fragment>
    );
}
