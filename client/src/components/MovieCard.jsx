import { Link } from "react-router-dom";
import styles from "./MovieCard.module.css";

export default function MovieCard({ movieId, movie }) {
  return (
    <Link to={`/movie/${movieId}`} className={styles.card}>
      <div className={styles.posterWrapper}>
        <img src={movie.imageURI} alt={movie.title} className={styles.posterImg} referrerPolicy="no-referrer"/>
        <div className={styles.posterGradient} />

        <span className={styles.genreBadge}>
          {movie.genre}
        </span>
        <div className={styles.playOverlay}>
          <div className={styles.playButton}>
            <svg className={styles.playIcon} fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      </div>

      <div className={styles.info}>
        <h3 className={styles.title}>
          {movie.title}
        </h3>
        <p className={styles.description}>{movie.description}</p>
        <div className={styles.priceRow}>
          <span className={styles.price}>{movie.ticketPrice}</span>
          <span className={styles.perSeat}>per seat</span>
        </div>
      </div>
    </Link>
  );
}
