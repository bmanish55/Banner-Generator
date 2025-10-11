import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>🎨 AI-Powered Marketing Banner Generator</h1>
        <p style={styles.subtitle}>
          Transform your ideas into professional social media banners in minutes
        </p>
        <div style={styles.features}>
          <div style={styles.feature}>
            <span style={styles.icon}>🤖</span>
            <h3>AI Design Generation</h3>
            <p>OpenAI generates multiple design variations based on your requirements</p>
          </div>
          <div style={styles.feature}>
            <span style={styles.icon}>🎯</span>
            <h3>3-Step Wizard</h3>
            <p>Simple workflow: Requirements → Preview → Finalize</p>
          </div>
          <div style={styles.feature}>
            <span style={styles.icon}>💾</span>
            <h3>Save & Download</h3>
            <p>Store your banners or download them as PNG images</p>
          </div>
        </div>
        <div style={styles.cta}>
          {user ? (
            <Link to="/create" style={styles.button}>
              Create Your First Banner
            </Link>
          ) : (
            <>
              <Link to="/register" style={styles.button}>
                Get Started
              </Link>
              <Link to="/login" style={styles.buttonSecondary}>
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: 'calc(100vh - 60px)',
    backgroundColor: '#ECF0F1'
  },
  hero: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '4rem 2rem',
    textAlign: 'center'
  },
  title: {
    fontSize: '3rem',
    color: '#2C3E50',
    marginBottom: '1rem'
  },
  subtitle: {
    fontSize: '1.5rem',
    color: '#7F8C8D',
    marginBottom: '3rem'
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    marginBottom: '3rem'
  },
  feature: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  icon: {
    fontSize: '3rem',
    display: 'block',
    marginBottom: '1rem'
  },
  cta: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center'
  },
  button: {
    backgroundColor: '#3498DB',
    color: 'white',
    padding: '1rem 2rem',
    borderRadius: '4px',
    textDecoration: 'none',
    fontSize: '1.1rem',
    fontWeight: '500',
    display: 'inline-block'
  },
  buttonSecondary: {
    backgroundColor: '#2C3E50',
    color: 'white',
    padding: '1rem 2rem',
    borderRadius: '4px',
    textDecoration: 'none',
    fontSize: '1.1rem',
    fontWeight: '500',
    display: 'inline-block'
  }
};

export default Home;
