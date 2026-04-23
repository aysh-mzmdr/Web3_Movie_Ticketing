import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import useWeb3 from "../context/Web3Context.jsx";
import { movies } from "../../movies.js";
import styles from "./MoviePage.module.css";

const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const COLS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Deterministic fake taken seats seeded by movieId
function generateTakenSeats(movieId) {
  const taken = new Set();
  ROWS.forEach((row, ri) => {
    COLS.forEach((col, ci) => {
      if ((movieId * 17 + ri * 10 + ci * 3) % 4 === 0) taken.add(`${row}${col}`);
    });
  });
  return taken;
}

export default function MoviePage() {
  const { movieId } = useParams();
  const { account, connect, web3 } = useWeb3();

  const movie = movies.find((m) => m.id === Number(movieId));

  const takenSeats = useMemo(() => generateTakenSeats(Number(movieId)), [movieId]);

  const [selectedSeats, setSelectedSeats] = useState(new Set());
  const [txStatus, setTxStatus] = useState("idle"); // idle | pending | success | failed
  const [txHash, setTxHash] = useState(null);

  if (!movie) {
    return (
      <>
        <Navbar />
        <div className={styles.notFound}>
          <p>Movie not found.</p>
          <Link to="/" className={styles.backLink}>← Back to Home</Link>
        </div>
      </>
    );
  }

  const toggleSeat = (seatId) => {
    if (takenSeats.has(seatId)) return;
    setSelectedSeats((prev) => {
      const next = new Set(prev);
      if (next.has(seatId)) next.delete(seatId);
      else next.add(seatId);
      return next;
    });
  };

  const totalPrice = (selectedSeats.size * movie.ticketPrice).toFixed(4);

  const handleBuy = async () => {
    if (!account) {
      connect();
      return;
    }
    if (selectedSeats.size === 0) return;

    setTxStatus("pending");
    setTxHash(null);
    
    try {
      const tx = await web3.eth.sendTransaction({
        from: account,
        // Replace with deployed contract address
        to: "0x0000000000000000000000000000000000000000",
        value: web3.utils.toWei(totalPrice, "ether"),
        data: web3.utils.utf8ToHex(JSON.stringify({ movieId, seats: [...selectedSeats] })),
      });
      setTxHash(tx.transactionHash);
      setTxStatus("success");
      // Mark seats as taken after successful purchase
      setSelectedSeats(new Set());
    } catch {
      setTxStatus("failed");
    }
  };

  const getSeatState = (seatId) => {
    if (takenSeats.has(seatId)) return "taken";
    if (selectedSeats.has(seatId)) return "selected";
    return "available";
  };

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <Link to="/" className={styles.backLink}>← Back</Link>

        {/* Movie Hero */}
        <section className={styles.hero}>
          <div className={styles.posterWrapper}>
            <img
              src={movie.imageURI}
              alt={movie.title}
              className={styles.poster}
              referrerPolicy="no-referrer"
            />
          </div>
          <div className={styles.heroInfo}>
            <span className={styles.genreBadge}>{movie.genre}</span>
            <h1 className={styles.title}>{movie.title}</h1>
            <p className={styles.description}>{movie.description}</p>
            <div className={styles.priceTag}>
              <span className={styles.priceValue}>{movie.ticketPrice} ETH</span>
              <span className={styles.priceLabel}>per seat</span>
            </div>
          </div>
        </section>

        {/* Seat Booking */}
        <section className={styles.bookingSection}>
          <h2 className={styles.sectionTitle}>Select Your Seats</h2>

          <div className={styles.screenWrapper}>
            <div className={styles.screen}>SCREEN</div>
          </div>

          <div className={styles.seatGrid}>
            {ROWS.map((row) => (
              <div key={row} className={styles.seatRow}>
                <span className={styles.rowLabel}>{row}</span>
                <div className={styles.seats}>
                  {COLS.map((col) => {
                    const seatId = `${row}${col}`;
                    const state = getSeatState(seatId);
                    return (
                      <button
                        key={seatId}
                        className={`${styles.seat} ${styles[state]}`}
                        onClick={() => toggleSeat(seatId)}
                        disabled={state === "taken"}
                        title={seatId}
                        aria-label={`Seat ${seatId} - ${state}`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className={styles.legend}>
            <span className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles.available}`} /> Available
            </span>
            <span className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles.selected}`} /> Selected
            </span>
            <span className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles.taken}`} /> Taken
            </span>
          </div>

          {/* Summary & Buy */}
          <div className={styles.summary}>
            <div className={styles.summaryInfo}>
              {selectedSeats.size === 0 ? (
                <p className={styles.summaryHint}>No seats selected</p>
              ) : (
                <>
                  <p className={styles.summarySeats}>
                    {[...selectedSeats].sort().join(", ")}
                  </p>
                  <p className={styles.summaryTotal}>
                    {selectedSeats.size} seat{selectedSeats.size > 1 ? "s" : ""} ·{" "}
                    <span className={styles.totalPrice}>{totalPrice} ETH</span>
                  </p>
                </>
              )}
            </div>

            <button
              className={styles.buyBtn}
              onClick={handleBuy}
              disabled={selectedSeats.size === 0 || txStatus === "pending"}
            >
              {!account
                ? "Connect Wallet"
                : txStatus === "pending"
                ? <><span className={styles.spinner} /> Confirming…</>
                : "Buy Tickets"}
            </button>
          </div>

          {/* Tx feedback */}
          {txStatus === "success" && (
            <div className={styles.txSuccess}>
              Transaction confirmed!{" "}
              {txHash && (
                <span className={styles.txHash}>
                  {txHash.slice(0, 10)}…{txHash.slice(-6)}
                </span>
              )}
            </div>
          )}
          {txStatus === "failed" && (
            <div className={styles.txFailed}>
              Transaction failed or was rejected.
            </div>
          )}
        </section>
      </main>
    </>
  );
}
