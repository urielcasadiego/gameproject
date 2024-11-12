'use client';
import '../css/userTable.css';
import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FaTrash, FaSearch } from 'react-icons/fa';

const ScoreTable = ({ scores, action, onEdit }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    if (!isLoaded) return null;

    const filteredScores = Array.isArray(scores)
        ? scores.filter(
              (score) =>
                  score.game.toLowerCase().includes(filter.toLowerCase()) ||
                  score.name.toLowerCase().includes(filter.toLowerCase()),
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
                        <th className="thtitulo">Juego</th>
                        <th className="thtitulo">Nombre</th>
                        <th className="thtitulo">Puntaje</th>
                        <th className="thtitulo">Fecha</th>
                        {action && <th className="thtitulo">Accion</th>}
                    </tr>
                </thead>
                <tbody>
                    {filteredScores.length &&
                        filteredScores.map((score) => (
                            <tr key={score._id}>
                                <td>{score.game}</td>
                                <td>{score.name}</td>
                                <td>{score.score}</td>
                                <td>
                                    {new Date(
                                        score.createdAt,
                                    ).toLocaleDateString()}
                                </td>
                                {action && (
                                    <td>
                                        <FaTrash
                                            data-tooltip
                                            title="Eliminar Score"
                                            style={{
                                                color: '#fff3cd',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                            }}
                                            onClick={() =>
                                                onEdit(score, 'Delete')
                                            }
                                        />
                                    </td>
                                )}
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
};

export default ScoreTable;
