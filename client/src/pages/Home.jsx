import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard.jsx";
import Navbar from "../components/Navbar.jsx";
import styles from "./Home.module.css";
import useWeb3 from "../context/Web3Context.jsx";

import { movies } from "../../movies.js";

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const { account,connect } = useWeb3()

  return (
    <>
      <Navbar/>
      <main className={styles.main}>

        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>
            Book Tickets on the{" "}
            <span className={styles.heroGradientText}>
              Blockchain
            </span>
          </h1>
          <p className={styles.heroSub}>
            Your tickets are NFTs — own them, trade them, never lose them.
          </p>
        </section>

        <section>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Now Showing</h2>
            <span className={styles.filmCount}>{(loading && "0") || (!loading && movies.length)} films</span>
          </div>

          {loading && (
            <div className={styles.movieGrid}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className={styles.skeletonCard} />
              ))}
            </div>
          )}

          {!loading && movies.length === 0 && (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>🎬</span>
              <p>No movies available yet.</p>
            </div>
          )}

          {!loading && movies.length > 0 && (
            <div className={styles.movieGrid}>
              {movies.map((movie) => (
                <MovieCard key={movie.id} movieId={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}


