import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import styles from '../styles/Layout.module.css';

export default function Layout({ children, title = 'Ayaan Sulman | Portfolio' }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Ayaan Sulman's Portfolio Website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Header />
      
      <main className={styles.main}>
        {children}
      </main>
      
      <Footer />
    </>
  );
}
