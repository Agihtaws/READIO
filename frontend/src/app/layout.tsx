'use client';

import { Inter } from 'next/font/google';
import { useEffect, useState } from 'react';
import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from './page.module.css';
import { AuthContextProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

// Theme toggle component
const ThemeToggle = () => {
  const [theme, setTheme] = useState('light');
  
  useEffect(() => {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (prefersDark) {
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };
  
  return (
    <button 
      onClick={toggleTheme} 
      className={styles.themeToggle}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContextProvider>
          <Header themeToggle={<ThemeToggle />} />
          <main className={styles.container}>
            {children}
          </main>
          <Footer />
        </AuthContextProvider>
      </body>
    </html>
  );
}
