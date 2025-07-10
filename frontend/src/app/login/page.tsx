'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import styles from './auth.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, signInWithGoogle, user } = useAuth();
  const router = useRouter();
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      router.push('/');
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.code === 'auth/invalid-credential') {
        setError('Invalid email or password');
      } else {
        setError('Failed to login. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);

    try {
      await signInWithGoogle();
      router.push('/');
    } catch (error: any) {
      console.error('Google sign in error:', error);
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Show loading or nothing while checking auth state
  if (user) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h1 className={styles.authTitle}>Log In</h1>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <form onSubmit={handleSubmit} className={styles.authForm}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.authInput}
              placeholder="Enter your email"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.authInput}
              placeholder="Enter your password"
            />
          </div>
          <button 
            type="submit" 
            className={styles.authButton}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        
        <div className={styles.divider}>
          <span>OR</span>
        </div>
        
        <button 
          onClick={handleGoogleSignIn} 
          className={styles.googleButton}
          disabled={isLoading}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <g transform="matrix(1, 0, 0, 1, 0, 0)">
              <path d="M21.35,11.1H12v3.2h5.59c-0.25,1.6-1.78,4.7-5.59,4.7c-3.36,0-6.1-2.79-6.1-6.2c0-3.41,2.74-6.2,6.1-6.2 c1.92,0,3.2,0.82,3.94,1.5l2.69-2.63C16.94,3.79,14.68,3,12,3C7.31,3,3.5,6.81,3.5,11.5c0,4.69,3.81,8.5,8.5,8.5 c4.91,0,8.17-3.45,8.17-8.3C20.17,10.95,20.71,10.57,21.35,11.1z" fill="#4285F4"></path>
              <path d="M12,21a9.5,9.5,0,1,1,0-19,9.46,9.46,0,0,1,6.35,2.46l-2.77,2.67A5.57,5.57,0,0,0,12,5.54,5.96,5.96,0,0,0,6,11.5,5.96,5.96,0,0,0,12,17.46a5.73,5.73,0,0,0,5.9-4.36H12V10h9.77a8.63,8.63,0,0,1,.23,2C22,16.13,17.92,21,12,21Z" fill="#4285F4"></path>
            </g>
          </svg>
          Sign in with Google
        </button>
        
        <p className={styles.authSwitch}>
          Don't have an account? <Link href="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
