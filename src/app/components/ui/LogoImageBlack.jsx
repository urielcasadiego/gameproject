'use client';
import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'next/image';
export default function LogoImageBlack() {
    return (
        <React.Fragment>
            <Row>
                <Col>
                    <Image
                        alt="logo"
                        src="/images/logo.png"
                        width={50}
                        height={50}
                        priority
                    />
                </Col>
            </Row>
        </React.Fragment>
    );
}
