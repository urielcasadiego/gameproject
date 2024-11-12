'use client';
import '../css/userTable.css';
import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {
    FaUser,
    FaUserShield,
    FaCheckCircle,
    FaBan,
    FaTrash,
    FaAdjust,
    FaSearch,
} from 'react-icons/fa';

const UserTable = ({ users, action, onEdit }) => {
    const [filter, setFilter] = useState('');

    const filteredUsers = Array.isArray(users)
        ? users.filter(
              (user) =>
                  user.name.toLowerCase().includes(filter.toLowerCase()) ||
                  user.email.toLowerCase().includes(filter.toLowerCase()),
          )
        : [];

    return (
        <div>
            <Row>
                <Col className="col-6">
                    <div className="input-group mb-2">
                        <span className="input-group-text">
                            <FaSearch />
                        </span>
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="form-control input-white-placeholder"
                        />
                    </div>
                </Col>
            </Row>

            <table className="table table-hover">
                <thead>
                    <tr>
                        <th className="thtitulo">Avatar</th>
                        <th className="thtitulo">Nombre</th>
                        <th className="thtitulo">Correo Electrónico</th>
                        <th className="thtitulo">Rol</th>
                        <th className="thtitulo">Estado</th>
                        {action && <th className="thtitulo">Acciones</th>}
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <tr key={user.userId}>
                                <td>
                                    <img
                                        src={
                                            user.avatar
                                                ? `${process.env.NEXT_PUBLIC_BASE_PHOTO}${user.avatar}`
                                                : `${
                                                      process.env
                                                          .NEXT_PUBLIC_BASE_PHOTO
                                                  }${'/uploads/1731357479954-266208079.png'}`
                                        }
                                        alt="Avatar"
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            backgroundColor: user.avatar
                                                ? 'transparent'
                                                : 'white',
                                        }}
                                    />
                                </td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    {user.role === 'ADMIN' ? (
                                        <div>
                                            <FaUserShield
                                                title="Administrador"
                                                style={{
                                                    color: '#30ff1e',
                                                    fontSize: '12px',
                                                }}
                                            />
                                            <span style={{ marginLeft: '5px' }}>
                                                Administrador
                                            </span>
                                        </div>
                                    ) : (
                                        <div>
                                            <FaUser
                                                title="Jugador"
                                                style={{
                                                    color: 'dodgerblue',
                                                    fontSize: '12px',
                                                }}
                                            />
                                            <span style={{ marginLeft: '5px' }}>
                                                Jugador
                                            </span>
                                        </div>
                                    )}
                                </td>
                                <td>
                                    {user.status === 'ACTIVE' ? (
                                        <div>
                                            <FaCheckCircle
                                                title="Activo"
                                                style={{
                                                    color: '#30ff1e',
                                                    fontSize: '12px',
                                                }}
                                            />
                                            <span style={{ marginLeft: '5px' }}>
                                                Activo
                                            </span>
                                        </div>
                                    ) : (
                                        <div>
                                            <FaBan
                                                title="Bloqueado"
                                                style={{
                                                    color: '#ffc008',
                                                    fontSize: '12px',
                                                }}
                                            />
                                            <span style={{ marginLeft: '5px' }}>
                                                Bloqueado
                                            </span>
                                        </div>
                                    )}
                                </td>
                                {action && (
                                    <td>
                                        <FaAdjust
                                            data-tooltip
                                            title="Bloquear Usuario"
                                            style={{
                                                color: '#fff3cd',
                                                cursor: 'pointer',
                                                marginRight: '15px',
                                                fontSize: '12px',
                                            }}
                                            onClick={() =>
                                                onEdit(user, 'Block')
                                            }
                                        />
                                        <FaTrash
                                            data-tooltip
                                            title="Eliminar Usuario"
                                            style={{
                                                color: '#fff3cd',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                            }}
                                            onClick={() =>
                                                onEdit(user, 'Delete')
                                            }
                                        />
                                    </td>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={action ? 6 : 5}>
                                No scores available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;
