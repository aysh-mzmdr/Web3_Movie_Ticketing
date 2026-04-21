import { Link, useLocation } from "react-router-dom";
import useWeb3 from "../context/Web3Context";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { account, connect, disconnect, connecting, correctNetwork } = useWeb3();
  const { pathname } = useLocation();

  const shortAddr = (addr) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.navInner}>

        {/* Logo */}
        <div className={styles.logo}>
          <span style={{fontSize:"1.2rem"}}>🎬</span>
          <span className={styles.logoText}>
            Web3 Movie Ticketing System
          </span>
        </div>

        <div className={styles.walletArea}>
          {!correctNetwork ? (
            <button onClick={connect} className={styles.wrongNetworkBtn}>
              {connecting ? (
                <span className={styles.spinnerSm} />
              ) : (
                <span className={styles.wrongNetworkDot} />
              )}
              {connecting ? "Connecting…" : "Wrong Network"}
            </button>
          ) : account ? (
            <>
              <Link
                to="/profile"
                className={pathname === "/profile" ? styles.profileLinkActive : styles.profileLink}
              >
                <span className={styles.onlineDot} />
                {shortAddr(account)}
              </Link>
              <button
                onClick={disconnect}
                className={styles.disconnectBtn}
              >
                Disconnect
              </button>
            </>
          ) : (
            <button onClick={connect} className={styles.connectBtn}>
                {connecting ? (
                <span className={styles.spinnerSm} />
              ) : (
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" className={styles.metamaskIcon} alt="" />
              )}
              {connecting ? "Connecting…" : "Connect Wallet"}
            </button>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      <div className={styles.mobileNav}>
          <Link
            to="/profile"
            className={pathname === "/profile" ? styles.mobileNavLinkActive : styles.mobileNavLink}
          >
            Profile
          </Link>
      </div>
    </nav>
  );
}
