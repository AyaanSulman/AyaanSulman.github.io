import Link from 'next/link';
import { FaGithub, FaLinkedin, FaXTwitter, FaEnvelope } from 'react-icons/fa6';
import styles from '../styles/Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.logo}>
            <Link href="/">
              <span className={styles.logoText}>Ayaan Sulman</span>
            </Link>
            <p className={styles.tagline}>Computer Science Student & Technology Enthusiast</p>
          </div>
          
          <div className={styles.links}>
            <div className={styles.linkGroup}>
              <h3 className={styles.linkTitle}>Navigation</h3>
              <ul className={styles.linkList}>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/projects">Projects</Link></li>
                <li><Link href="/resume">Resume</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>
          </div>
          
          <div className={styles.social}>
            <h3 className={styles.socialTitle}>Connect With Me</h3>
            <div className={styles.socialIcons}>
              <a href="https://github.com/AyaanSulman" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <FaGithub />
              </a>
              <a href="https://linkedin.com/in/ayaansulman" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
              <a href="https://x.com/4yaan_1?t=iVx_60NI1jL2QvGjGhF--g&s=09" target="_blank" rel="noopener noreferrer" aria-label="X">
                <FaXTwitter />
              </a>
              <a href="mailto:ayaan309sulman@gmail.com" aria-label="Email">
                <FaEnvelope />
              </a>
            </div>
          </div>
        </div>
        
        <div className={styles.copyright}>
          <p>&copy; {new Date().getFullYear()} Ayaan Sulman. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
