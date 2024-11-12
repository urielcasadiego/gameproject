'use client';
import { useRouter } from 'next/navigation';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button } from 'react-bootstrap';

export default function HomePage() {
    const router = useRouter();
    return (
        <div className="bgprin">
            <div className="h-100 d-flex align-items-center justify-content-center">
                <Row className="w-100">
                    <Col className="col-12 col-md-6 mt-3">
                        {' '}
                        <Row>
                            <h2 className="titulo1">
                                Bienvenidos a SNAKE GAME, Controla la Serpiente
                                y veamos hasta dónde puedes llegar.
                            </h2>
                            <h2 className="titulo2">
                                Juego Retro Snake Game en su Máxima Expresión
                                con la serpiente sin fin.
                            </h2>
                        </Row>
                        <Row className="botones mt-3">
                            <Col>
                                <Button
                                    variant="warning"
                                    className="bot1"
                                    type="button"
                                    onClick={() => router.push('/page/game')}
                                >
                                    INICIAR JUEGO
                                </Button>
                                <Button
                                    variant="secondary"
                                    className="bot1"
                                    onClick={() => router.push('/page/top20')}
                                >
                                    TOP 20 PUNTUACIONES
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        </div>
    );
}
