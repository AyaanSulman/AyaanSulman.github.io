import { FaGithub, FaLinkedin, FaFacebook, FaInstagram, FaSnapchat, FaSpotify, FaDiscord, FaSteam, FaEnvelope } from 'react-icons/fa';
import styles from '../styles/SocialLinks.module.css';

export default function SocialLinks({ vertical = false }) {
  return (
    <div className={`${styles.socialLinks} ${vertical ? styles.vertical : ''}`}>
      <a 
        href="https://www.facebook.com/ayaan.sulman?mibextid=ZbWKwL" 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Facebook"
        className={styles.socialLink}
      >
        <FaFacebook />
      </a>
      <a 
        href="https://www.linkedin.com/in/ayaan-sulman-301073292?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="LinkedIn"
        className={styles.socialLink}
      >
        <FaLinkedin />
      </a>
      <a 
        href="https://instagram.com/ayaan._.x?igshid=MzRlODBiNWFlZA==" 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Instagram"
        className={styles.socialLink}
      >
        <FaInstagram />
      </a>
      <a 
        href="https://www.snapchat.com/add/ayaan_sulman?share_id=bvXfcE_s2-o&locale=en-GB" 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Snapchat"
        className={styles.socialLink}
      >
        <FaSnapchat />
      </a>
      <a 
        href="https://spotify.link/OpnrOfJ8WDb" 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Spotify"
        className={styles.socialLink}
      >
        <FaSpotify />
      </a>
      <a 
        href="http://discordapp.com/users/954836610262921280" 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Discord"
        className={styles.socialLink}
      >
        <FaDiscord />
      </a>
      <a 
        href="https://github.com/AyaanSulman" 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="GitHub"
        className={styles.socialLink}
      >
        <FaGithub />
      </a>
      <a 
        href="https://steamcommunity.com/profiles/76561199023844069/" 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Steam"
        className={styles.socialLink}
      >
        <FaSteam />
      </a>
      <a 
        href="mailto:ayaan309sulman@gmail.com"
        aria-label="Email"
        className={styles.socialLink}
      >
        <FaEnvelope />
      </a>
    </div>
  );
}
