import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  return (
    <div style={styles.container}>
      <video autoPlay loop muted style={styles.videoBackground}>
        <source src="/videos/landing-background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div style={styles.overlay}></div>
      
      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.title}>
          Unleash Your Creativity with AI-Powered Banner Generation
        </h1>
        <p style={styles.subtitle}>
          Instantly create stunning, professional-grade marketing banners for all your social media platforms. Let our AI be your creative partner.
        </p>
        <div style={styles.heroButtons}>
          <Link to="/register" style={styles.primaryBtn}>
            Get Started for Free
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.features}>
        <h2 style={styles.sectionTitle}>Why You'll Love Our Banner Generator</h2>
        <div style={styles.featuresGrid}>
          <div className="feature-card" style={styles.featureCard}>
            <div style={styles.featureIcon}>🤖</div>
            <h3 style={styles.featureTitle}>Intelligent Design AI</h3>
            <p style={styles.featureDescription}>
              Our AI provides smart design suggestions tailored to your brand, audience, and goals.
            </p>
          </div>
          <div className="feature-card" style={styles.featureCard}>
            <div style={styles.featureIcon}>🎨</div>
            <h3 style={styles.featureTitle}>Intuitive Editor</h3>
            <p style={styles.featureDescription}>
              A simple, powerful editor makes it easy to customize every detail without any design skills.
            </p>
          </div>
          <div className="feature-card" style={styles.featureCard}>
            <div style={styles.featureIcon}>📱</div>
            <h3 style={styles.featureTitle}>Cross-Platform Ready</h3>
            <p style={styles.featureDescription}>
              Generate perfectly sized banners for Instagram, LinkedIn, Twitter, Facebook, and more.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={styles.howItWorks}>
        <h2 style={styles.sectionTitle}>Create in Three Simple Steps</h2>
        <div style={styles.howItWorksGrid}>
          <div style={styles.step}>
            <div style={styles.stepNumber}>1</div>
            <h3 style={styles.stepTitle}>Describe Your Vision</h3>
            <p style={styles.stepDescription}>
              Provide your banner's purpose, platform, and target audience to guide the AI.
            </p>
          </div>
          <div style={styles.step}>
            <div style={styles.stepNumber}>2</div>
            <h3 style={styles.stepTitle}>Review AI Designs</h3>
            <p style={styles.stepDescription}>
              Our AI generates multiple unique and professional design options in seconds.
            </p>
          </div>
          <div style={styles.step}>
            <div style={styles.stepNumber}>3</div>
            <h3 style={styles.stepTitle}>Customize & Export</h3>
            <p style={styles.stepDescription}>
              Fine-tune your chosen design, then download your high-quality banner instantly.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.cta}>
        <h2 style={styles.ctaTitle}>Ready to Elevate Your Marketing?</h2>
        <p style={styles.ctaDescription}>
          Start creating beautiful, effective banners today and see the difference AI can make.
        </p>
        <Link to="/register" style={styles.ctaButton}>
          Sign Up and Create Your First Banner
        </Link>
      </section>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
    backgroundSize: '400% 400%',
    animation: 'gradient 15s ease infinite',
    color: 'white',
    fontFamily: "'Inter', sans-serif",
    position: 'relative',
    overflow: 'hidden',
  },
  videoBackground: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transform: 'translate(-50%, -50%)',
    zIndex: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  hero: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '0 20px',
    textAlign: 'center',
    position: 'relative',
    zIndex: 2,
  },
  title: {
    fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
    fontWeight: '800',
    marginBottom: '24px',
    lineHeight: '1.1',
    textShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
  },
  subtitle: {
    fontSize: 'clamp(1rem, 2vw, 1.25rem)',
    marginBottom: '40px',
    opacity: 0.9,
    maxWidth: '700px',
    lineHeight: '1.6',
  },
  heroButtons: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
  },
  primaryBtn: {
    fontSize: '18px',
    padding: '16px 32px',
    background: 'rgba(255, 255, 255, 0.9)',
    color: '#e73c7e',
    borderRadius: '50px',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
  },
  features: {
    padding: '100px 20px',
    position: 'relative',
    zIndex: 2,
  },
  sectionTitle: {
    fontSize: 'clamp(2rem, 4vw, 3rem)',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: '60px',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  featureCard: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '20px',
    padding: '40px',
    textAlign: 'center',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  featureIcon: {
    fontSize: '48px',
    marginBottom: '20px',
    lineHeight: 1,
  },
  featureTitle: {
    fontSize: '22px',
    fontWeight: '600',
    marginBottom: '16px',
  },
  featureDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: '1.6',
  },
  howItWorks: {
    padding: '100px 20px',
    position: 'relative',
    zIndex: 2,
  },
  howItWorksGrid: {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    flexWrap: 'wrap',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  step: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '20px',
    padding: '40px',
    textAlign: 'center',
    flex: '1',
    minWidth: '280px',
    maxWidth: '350px',
  },
  stepNumber: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.9)',
    color: '#e73c7e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: '700',
    margin: '0 auto 20px',
  },
  stepTitle: {
    fontSize: '22px',
    fontWeight: '600',
    marginBottom: '16px',
  },
  stepDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: '1.6',
  },
  cta: {
    padding: '100px 20px',
    textAlign: 'center',
    position: 'relative',
    zIndex: 2,
  },
  ctaTitle: {
    fontSize: 'clamp(2rem, 4vw, 3rem)',
    fontWeight: '700',
    marginBottom: '16px',
  },
  ctaDescription: {
    fontSize: '1.1rem',
    marginBottom: '32px',
    opacity: 0.9,
    maxWidth: '600px',
    margin: '0 auto 32px',
  },
  ctaButton: {
    fontSize: '18px',
    padding: '16px 32px',
    background: 'rgba(255, 255, 255, 0.9)',
    color: '#e73c7e',
    borderRadius: '50px',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
  },
};

export default Landing;