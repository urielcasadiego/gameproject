'use client';
import '../css/userTable.css';
import { FaTrophy } from 'react-icons/fa';

const ScoreTableTop20 = ({ scores }) => {
    return (
        <div>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th className="thtitulo">Posición</th>
                        <th className="thtitulo">Puntaje</th>
                        <th className="thtitulo">Nombre</th>
                        <th className="thtitulo">Juego</th>
                    </tr>
                </thead>
                <tbody>
                    {scores.length > 0 ? (
                        scores.map((score, index) => (
                            <tr key={score._id}>
                                <td>
                                    {index + 1}
                                    {index < 3 && (
                                        <FaTrophy
                                            style={{
                                                marginLeft: '10px',
                                                color:
                                                    index === 0
                                                        ? 'gold'
                                                        : index === 1
                                                        ? 'silver'
                                                        : '#cd7f32',
                                            }}
                                        />
                                    )}
                                </td>
                                <td>{score.score}</td>
                                <td>{score.name}</td>
                                <td>{score.game}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No scores available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ScoreTableTop20;
