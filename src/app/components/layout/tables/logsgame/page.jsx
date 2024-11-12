'use client';
import '../css/userTable.css';
import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FaSearch } from 'react-icons/fa';

const LogTable = ({ logs, action, onEdit }) => {
    const [filter, setFilter] = useState('');

    const filteredLogs = Array.isArray(logs)
        ? logs.filter(
              (log) =>
                  log.userId.toLowerCase().includes(filter.toLowerCase()) ||
                  log.email.toLowerCase().includes(filter.toLowerCase()),
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
                        <th className="thtitulo">Correo Usuario</th>
                        <th className="thtitulo">Correo Admin</th>
                        <th className="thtitulo">Acción</th>
                        <th className="thtitulo">Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredLogs.length > 0 ? (
                        filteredLogs.map((log) => (
                            <tr key={log.logId}>
                                <td>{log.email}</td>
                                <td>{log.adminid}</td>
                                <td>{log.action}</td>
                                <td>{log.createdAt}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={action ? 6 : 5}>No logs available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default LogTable;
