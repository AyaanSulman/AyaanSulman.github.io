import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import ProjectCard from '../components/ProjectCard';
import styles from '../styles/Projects.module.css';

export default function Projects() {
  // Sample project data - you'll replace these with your actual projects
  const projects = [
    {
      id: 1,
      title: 'Flappy Bird Game',
      description: 'The flappy bird is a very basic but famous game and a very important benchmark in every game developer\'s life. Flappy Bird is the first milestone for most of the game developers today.',
      tech: 'Made using Unity',
      image: '/images/flappy-bird.jpg', // You'll need to add this image
    },
    {
      id: 2,
      title: 'Rent A Car User Interface',
      description: 'This is rent a car user interface that I made for my software engineering course. I made the software using unity as I was learning it at that time and wanted to test my knowledge. The software is very easy to understand and it does has some functionality.',
      tech: 'Made using Unity',
      image: '/images/rent-a-car.jpg', // You'll need to add this image
    },
    // You can add more projects here
  ];

  return (
    <Layout title="Projects | Ayaan Sulman">
      <div className={styles.container}>
        <motion.h1 
          className={styles.title}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          My <span className={styles.highlight}>Projects</span>
        </motion.h1>
        
        <motion.p 
          className={styles.subtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Here are some of the projects I've worked on. Each project represents a step in my journey as a developer.
        </motion.p>
        
        <div className={styles.projectsGrid}>
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
        
        <motion.div 
          className={styles.contactCta}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>Interested in working together?</h2>
          <p>I'm always open to discussing new projects and opportunities.</p>
          <motion.a 
            href="/contact" 
            className={styles.ctaButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get In Touch
          </motion.a>
        </motion.div>
      </div>
    </Layout>
  );
}
