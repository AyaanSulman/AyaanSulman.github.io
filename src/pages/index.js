import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import SocialLinks from '../components/SocialLinks';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <Layout title="Ayaan Sulman | Portfolio">
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <motion.div 
              className={styles.heroText}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className={styles.title}>
                Hi, I'm <span className={styles.highlight}>Ayaan Sulman</span>
              </h1>
              <h2 className={styles.subtitle}>Computer Science Student & Technology Enthusiast</h2>
              <p className={styles.description}>
                I'm on an exciting adventure through the digital realm, pursuing my passion for technology and gaming.
                When I'm not coding, you'll find me gazing at the stars, indulging in astrophotography.
              </p>
              <div className={styles.actions}>
                <Link href="/projects">
                  <motion.button 
                    className={styles.primaryBtn}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View Projects
                  </motion.button>
                </Link>
                <Link href="/contact">
                  <motion.button 
                    className={styles.secondaryBtn}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Contact Me
                  </motion.button>
                </Link>
              </div>
              <div className={styles.socialContainer}>
                <SocialLinks />
              </div>
            </motion.div>
            
            <motion.div 
              className={styles.heroImage}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className={styles.imageWrapper}>
                <Image 
                  src="/images/profile-picture.jpg" 
                  alt="Ayaan Sulman" 
                  width={400} 
                  height={400} 
                  priority
                  className={styles.profileImage}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      <section className={styles.about}>
        <div className={styles.container}>
          <motion.div 
            className={styles.aboutContent}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={styles.sectionTitle}>About Me</h2>
            <div className={styles.aboutText}>
              <p>
                I'm not your typical student; I'm pursuing a major in Computer Sciences, fueled by my passion for technology and gaming. 
                When I'm not buried in lines of code or leveling up in my favorite games, you'll often find me gazing at the stars, 
                indulging in my hobby of astrophotography. It's my way of seeking inspiration beyond the digital world.
              </p>
              <p>
                This website is more than just a collection of projects; it's a testament to my journey of growth and learning in the vast 
                world of technology. I'm here to share my experiences and knowledge. Join me as I strive to be something more than ordinary, 
                as I work hard to carve my unique path in the tech universe.
              </p>
              <p>
                So, whether you're here for insights on the latest tech trends, or just want to share in the magic of astrophotography, 
                I invite you to be a part of this journey. Let's navigate the digital cosmos together and, who knows, maybe we'll reach the stars.
              </p>
            </div>
            <div className={styles.aboutActions}>
              <Link href="/resume">
                <motion.button 
                  className={styles.primaryBtn}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Resume
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
