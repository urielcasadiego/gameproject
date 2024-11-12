'use client';
import './footer.css';
import Row from 'react-bootstrap/Row';

export default function Footer() {
    return (
        <div>
            <footer className="footer">
                <Row>
                    <div className="footerleft">
                        <span className="about">
                            Software desarrollado como projecto Educativo -
                            Bogotá, Colombia, Mintic &copy; 2024
                        </span>
                    </div>
                </Row>
            </footer>
        </div>
    );
}
