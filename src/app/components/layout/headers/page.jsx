'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import NavDropdown from 'react-bootstrap/NavDropdown';
import styles from './headers.module.css';
import { useSelector } from 'react-redux';
import { FiAlignJustify } from 'react-icons/fi';
import LogoImage from 'game/app/components/ui/LogoImage';
import LogoutButton from 'game/app/components/ui/LogoutButton';

export default function Headers() {
    const router = useRouter();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const [showHeader, setShowHeader] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const datauser = useSelector((state) => state.auth.user);

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/page/auth/login');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return null;

    const toggleMenu = () => {
        setShowHeader((prev) => !prev);
    };

    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <LogoImage />
                    <Link className={styles.titu1} href="/">
                        Snake Game
                    </Link>
                </div>
                <div className={styles.menuicon} onClick={toggleMenu}>
                    <FiAlignJustify />
                </div>
                <div
                    className={`${styles.navelements} ${
                        showHeader ? styles.active : ''
                    }`}
                >
                    <ul>
                        <li>
                            <Link href="/">Inicio</Link>
                        </li>
                        <li>
                            <Link href="/page/auth/profile">Perfil</Link>
                        </li>
                        {datauser.role === 'ADMIN' && (
                            <li>
                                <NavDropdown
                                    title="Admin"
                                    id="basic-nav-dropdown"
                                    className={styles.itemt}
                                >
                                    <NavDropdown.Item
                                        as="div"
                                        className="subnav"
                                    >
                                        <Link
                                            href="/page/admin/users"
                                            legacyBehavior
                                        >
                                            <a className={styles.item}>
                                                Lista de Usuarios
                                            </a>
                                        </Link>
                                    </NavDropdown.Item>
                                    <NavDropdown.Item
                                        as="div"
                                        className="subnav"
                                    >
                                        <Link
                                            href="/page/admin/status"
                                            legacyBehavior
                                        >
                                            <a className={styles.item}>
                                                Estados de Usuarios
                                            </a>
                                        </Link>
                                    </NavDropdown.Item>
                                    <NavDropdown.Item as="div">
                                        <Link
                                            href="/page/admin/scores"
                                            legacyBehavior
                                        >
                                            <a className={styles.item}>
                                                Lista de Puntuaciones
                                            </a>
                                        </Link>
                                    </NavDropdown.Item>
                                    <NavDropdown.Item as="div">
                                        <Link
                                            href="/page/admin/score-delete"
                                            legacyBehavior
                                        >
                                            <a className={styles.item}>
                                                Eliminar Puntuaciones
                                            </a>
                                        </Link>
                                    </NavDropdown.Item>
                                    <NavDropdown.Item as="div">
                                        <Link
                                            href="/page/admin/loggame"
                                            legacyBehavior
                                        >
                                            <a className={styles.item}>
                                                Consulta de Logs
                                            </a>
                                        </Link>
                                    </NavDropdown.Item>
                                    <hr className="hr"></hr>
                                    <NavDropdown.Item as="div">
                                        <Link
                                            href="/page/admin/scoregraphql"
                                            legacyBehavior
                                        >
                                            <a className={styles.item}>
                                                Consulta scores Graphql
                                            </a>
                                        </Link>
                                    </NavDropdown.Item>
                                    <NavDropdown.Item as="div">
                                        <Link
                                            href="/page/admin/topgraphql"
                                            legacyBehavior
                                        >
                                            <a className={styles.item}>
                                                Consulta Graphql Top
                                            </a>
                                        </Link>
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </li>
                        )}
                        <li className="d-flex">
                            <img
                                src={
                                    datauser.avatar
                                        ? `${process.env.NEXT_PUBLIC_BASE_PHOTO}${datauser.avatar}`
                                        : `${
                                              process.env.NEXT_PUBLIC_BASE_PHOTO
                                          }${'/uploads/1731357479954-266208079.png'}`
                                }
                                alt="Avatar"
                                style={{
                                    width: '25px',
                                    height: '25px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    backgroundColor: datauser.avatar
                                        ? 'transparent'
                                        : 'white',
                                }}
                            />
                            &nbsp;
                            <p className="text-white m-0">{datauser.name}</p>
                            <NavDropdown
                                title=""
                                id="basic-nav-dropdown"
                                className={styles.itemt}
                            >
                                <NavDropdown.Item as="div" className="subnav">
                                    <Link
                                        href="/page/auth/changepassword"
                                        legacyBehavior
                                    >
                                        <a className={styles.item}>
                                            Cambiar Contraseña
                                        </a>
                                    </Link>
                                </NavDropdown.Item>
                            </NavDropdown>
                        </li>

                        <li>
                            <LogoutButton />
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
