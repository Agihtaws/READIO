'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import styles from './Header.module.css';

export default function Header({ themeToggle }: { themeToggle: React.ReactNode }) {
  const { user, logout } = useAuth();
  
  const getUserInitial = () => {
    if (user?.displayName) {
      return user.displayName.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.logoContainer}>
          <Link href="/" className={styles.logo}>Readio</Link>
        </div>
        
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link href="/">Home</Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/about">About</Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/guide">Guide</Link>
            </li>
            
            {user ? (
              <div className={styles.userProfile}>
                <div className={styles.userInfo}>
                  <p className={styles.userName}>{user.displayName || 'User'}</p>
                  <p className={styles.userEmail}>{user.email}</p>
                </div>
                <div className={styles.avatarCircle}>
                  {getUserInitial()}
                </div>
                {themeToggle}
                <button 
                  className={styles.logoutButton} 
                  onClick={handleLogout}
                  aria-label="Log out"
                  title="Log out"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                </button>
              </div>
            ) : (
              <>
                <li className={styles.navItem}>
                  <Link href="/login" className={styles.loginButton}>Login</Link>
                </li>
                {themeToggle}
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
