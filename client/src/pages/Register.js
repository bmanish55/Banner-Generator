import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import './AuthForm.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
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

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      
      if (result.success) {
        toast.success('Account created successfully!');
        navigate('/dashboard');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Registration failed. Please try again.');
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
              <h1 className="card-title" style={styles.title}>Create Account</h1>
              <p className="card-subtitle" style={styles.subtitle}>Start creating amazing banners today</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name" className="form-label" style={styles.label}>
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  style={styles.input}
                />
              </div>

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
                  minLength="6"
                  style={styles.input}
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label" style={styles.label}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="form-input"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm your password"
                  style={styles.input}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
                style={styles.button}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div style={styles.footer}>
              <p style={{color: '#333'}}>
                Already have an account?{' '}
                <Link to="/login" style={styles.link}>
                  Sign in here
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

export default Register;