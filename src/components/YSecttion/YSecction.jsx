import { useEffect, useState } from 'react';
import './YSecction.css';

const API_KEY = 'AIzaSyC9r-NqeT4rtA2TuHRWgmL6hBWXi3z4sxI';
const ID_CANAL = 'UCQk5KVTZMzWMoVe6JyLy2Bw';
const URL_CANAL = 'https://www.youtube.com/@valeriaolivaresch4859';

export default function UltimoVideo() {
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${ID_CANAL}&order=date&part=snippet&type=video&maxResults=1`
        );

        // Verificamos si la respuesta fue exitosa
        if (!response.ok) {
          throw new Error('No se pudo cargar el video.');
        }

        const data = await response.json();

        // Logueamos la respuesta para verificar su estructura
        console.log('Respuesta de la API:', data);

        // Verificamos si data.items existe y tiene elementos
        if (!data.items || data.items.length === 0) {
          throw new Error('No se encontraron videos en el canal.');
        }

        // Si la respuesta es correcta, actualizamos el estado
        setVideo(data.items[0]);
        setLoading(false);
      } catch (err) {
        console.error('Error:', err);
        setError('No se pudo cargar el video');
        setLoading(false);
      }
    };

    fetchVideo();
  }, []);

  // Si está cargando, mostramos un mensaje de carga
  if (loading) return <p>Cargando video...</p>;

  // Si hay un error, mostramos el mensaje de error
  if (error) return <p>{error}</p>;

  const { title, description, publishedAt } = video.snippet;
  const videoId = video.id.videoId;

  // Formateamos la fecha de publicación
  const fecha = new Date(publishedAt).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <section className="video-yt">
      <div>
        <h2>Encuéntranos en nuestro canal de Youtube</h2>
      </div>
      <div>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          allowFullScreen
          title={title}  // Añadido título para accesibilidad
        />
      </div>
      <div>
        <h3>{title}</h3>
        <p>{fecha}</p>
        <p>{description}</p>
        <a href={URL_CANAL} target="_blank" rel="noopener noreferrer">
          <button>Ir al canal</button>
        </a>
      </div>
    </section>
  );
}
