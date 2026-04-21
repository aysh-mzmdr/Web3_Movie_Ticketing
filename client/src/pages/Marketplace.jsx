import Navbar from "../components/Navbar";
import styles from "./Marketplace.module.css";

export default function Marketplace() {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <h1 className={styles.title}>Marketplace</h1>
      </main>
    </>
  );
}
