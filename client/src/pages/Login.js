import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import './AuthForm.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(formData);
      if (result.success) {
        toast.success('Login successful!');
        navigate('/dashboard');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.videoBgWrapper}>
        <video autoPlay loop muted playsInline style={styles.video}>
          <source src="/videos/bg.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div style={styles.overlay}></div>
      </div>
      <div style={styles.container}>
        <div style={styles.formContainer}>
          <div className="card" style={styles.card}>
            <div className="card-header text-center" style={styles.cardHeader}>
              <h1 className="card-title" style={styles.title}>Welcome Back</h1>
              <p className="card-subtitle" style={styles.subtitle}>Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email" className="form-label" style={styles.label}>
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  style={styles.input}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label" style={styles.label}>
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-input"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  style={styles.input}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
                style={styles.button}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div style={styles.footer}>
              <p style={{color: '#333'}}>
                Don't have an account?{' '}
                <Link to="/register" style={styles.link}>
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    width: '100%',
    height: '100vh',
    position: 'relative',
  },
  videoBgWrapper: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    zIndex: 0,
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '100px 20px',
    position: 'relative',
    zIndex: 1,
  },
  formContainer: {
    width: '100%',
    maxWidth: '400px',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: '12px',
    padding: '40px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
    border: 'none',
  },
  cardHeader: {
    marginBottom: '30px',
  },
  title: {
    color: '#111827',
    fontSize: '28px',
    fontWeight: '700',
  },
  subtitle: {
    color: '#6b7280',
    marginTop: '8px',
  },
  label: {
    color: '#374151',
    fontWeight: '600',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    backgroundColor: '#f9fafb',
    color: '#111827',
    fontSize: '16px',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  },
  button: {
    marginTop: '10px',
    backgroundColor: '#e73c7e',
    borderColor: '#e73c7e',
  },
  footer: {
    textAlign: 'center',
    marginTop: '24px',
    paddingTop: '24px',
    borderTop: '1px solid #e5e7eb',
  },
  link: {
    color: '#e73c7e',
    textDecoration: 'none',
    fontWeight: '600',
  },
};

export default Login;