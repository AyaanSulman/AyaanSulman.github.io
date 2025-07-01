import { motion } from 'framer-motion';
import { FaDownload } from 'react-icons/fa';
import Layout from '../components/Layout';
import styles from '../styles/Resume.module.css';

export default function Resume() {
  return (
    <Layout title="Resume | Ayaan Sulman">
      <div className={styles.container}>
        <motion.h1 
          className={styles.title}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          My <span className={styles.highlight}>Resume</span>
        </motion.h1>
        
        <div className={styles.resumeWrapper}>
          <div className={styles.resumeActions}>
            <motion.a 
              href="/Resume.pdf" 
              download
              className={styles.downloadBtn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaDownload /> Download PDF
            </motion.a>
          </div>
          
          <div className={styles.resumeViewer}>
            <iframe 
              src="/Resume.pdf" 
              className={styles.pdfViewer} 
              title="Ayaan Sulman's Resume"
            />
          </div>
        </div>
        
        <div className={styles.resumeSections}>
          <motion.div 
            className={styles.resumeSection}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2>Education</h2>
            <div className={styles.resumeItem}>
              <h3>Bachelor of Computer Science</h3>
              <p className={styles.organization}>Forman Christian College (A chartered University)</p>
              <p className={styles.period}>2021 - 2025</p>
              <p className={styles.description}>
                Studying computer science with a focus on software development, artificial intelligence, and game development.
              </p>
            </div>
            {/* Add more education items as needed */}
          </motion.div>
          
          <motion.div 
            className={styles.resumeSection}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2>Skills</h2>
            <div className={styles.skillsGrid}>
              <div className={styles.skillCategory}>
                <h3>Programming Languages</h3>
                <ul className={styles.skillsList}>
                  <li>JavaScript</li>
                  <li>Python</li>
                  <li>C#</li>
                  <li>Java</li>
                  {/* Add more skills as needed */}
                </ul>
              </div>
              
              <div className={styles.skillCategory}>
                <h3>Technologies & Frameworks</h3>
                <ul className={styles.skillsList}>
                  <li>React</li>
                  <li>Unity</li>
                  <li>Node.js</li>
                  <li>Git</li>
                  {/* Add more skills as needed */}
                </ul>
              </div>
              
              <div className={styles.skillCategory}>
                <h3>Other Skills</h3>
                <ul className={styles.skillsList}>
                  <li>UI/UX Design</li>
                  <li>Game Development</li>
                  <li>Problem Solving</li>
                  <li>Teamwork</li>
                  {/* Add more skills as needed */}
                </ul>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className={styles.resumeSection}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2>Experience</h2>
            <div className={styles.resumeItem}>
              <h3>Software Development Intern</h3>
              <p className={styles.organization}>Company Name</p>
              <p className={styles.period}>Summer 2023</p>
              <p className={styles.description}>
                Worked on developing web applications using React and Node.js. Collaborated with a team to implement new features and fix bugs.
              </p>
            </div>
            {/* Add more experience items as needed */}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
