'use client';
import React from 'react';
import Image from 'next/image';
export default function LogoImage() {
    return (
        <div
            style={{
                position: 'relative',
                height: '30px',
                width: '30px',
                marginRight: '10px',
            }}
        >
            <Image
                alt="logo"
                src="/images/logowhite.png"
                fill
                sizes="30px"
                style={{ objectFit: 'cover' }}
            />
        </div>
    );
}
