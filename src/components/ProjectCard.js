import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from '../styles/ProjectCard.module.css';

export default function ProjectCard({ project, index }) {
  return (
    <motion.div 
      className={styles.card}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className={styles.imageContainer}>
        {project.image && (
          <Image 
            src={project.image} 
            alt={project.title} 
            width={500} 
            height={300} 
            className={styles.image}
          />
        )}
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.tech}>{project.tech}</p>
        <p className={styles.description}>{project.description}</p>
        {project.link && (
          <a 
            href={project.link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.link}
          >
            View Project
          </a>
        )}
      </div>
    </motion.div>
  );
}
