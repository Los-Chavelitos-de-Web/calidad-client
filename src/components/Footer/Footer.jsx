import { useNavigate } from "react-router-dom";
import React from "react";
import "./Footer.css";
import { usePayload } from "../../utils/authHelpers";

const Footer = () => {
  const navigate = useNavigate();
  const { email } = usePayload();

  const handleLibroClick = () => {
    if (email) {
      navigate("/libro-reclamaciones");
    } else {
      alert("Debes iniciar sesión para acceder al Libro de Reclamaciones.");
    }
  };

  return (
    <footer className="footer">
      <div className="footer-columns">
        <div className="footer-column">
          <h4>Categorías</h4>
          <ul>
            <li>
              <a href="#"></a>Cortadoras de Céspedes
            </li>
            <li>
              <a href="#"></a>Generadores
            </li>
            <li>
              <a href="#"></a>Motobombas
            </li>
            <li>
              <a href="#"></a>Motofumigadoras
            </li>
            <li>
              <a href="#"></a>Motoguadañas
            </li>
            <li>
              <a href="#"></a>Motores Multipropósito
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Marcas</h4>
          <ul>
            <li>
              <a className="footer-link" onClick={() => navigate("/honda")}>
                Honda
              </a>
            </li>
            <li>
              <a className="footer-link" onClick={() => navigate("/honda")}>
                Still
              </a>
            </li>
            <li>
              <a className="footer-link" onClick={() => navigate("/rato")}>
                Rato
              </a>
            </li>
            <li>
              <a className="footer-link" onClick={() => navigate("/ducati")}>
                Ducati
              </a>
            </li>
            <li>
              <a
                className="footer-link"
                onClick={() => navigate("/bonhoeffer")}
              >
                Bonhoeffer
              </a>
            </li>
            <li>
              <a className="footer-link" onClick={() => navigate("/cifarelli")}>
                Cifarelli
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Políticas</h4>
          <ul>
            <li>
              <a href="#"></a>Políticas de Privacidad
            </li>
            <li>
              <a
                onClick={
                  email ? () => navigate("/libroReclamaciones") : undefined
                }
                className="footer-link libro-link"
              >
                <img
                  src="icons/Lreclamaciones.png"
                  alt="Libro"
                  className="libro-icon"
                />
                Libro de Reclamaciones
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} | Todos los derechos reservados</p>

        <div className="footer-social">
          <span className="social-label">Síguenos</span>
          <div className="social-icons">
            <a
              href="https://www.youtube.com/@ComercialRafaelNorte"
              target="_blank"
              rel="noreferrer"
            >
              <img src="icons/youtube.png" alt="YouTube" />
            </a>
            <a
              href="https://web.facebook.com/comercialrafaelnorte/?_rdc=1&_rdr"
              target="_blank"
              rel="noreferrer"
            >
              <img src="icons/facebook.png" alt="Facebook" />
            </a>
            <a
              href="https://www.instagram.com/comercialrafaelnorte/"
              target="_blank"
              rel="noreferrer"
            >
              <img src="icons/instagram.png" alt="Instagram" />
            </a>
            <a
              href="https://www.tiktok.com/@comercial.rafael"
              target="_blank"
              rel="noreferrer"
            >
              <img src="icons/icons8-tik-tok-100.png" alt="TikTok" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
