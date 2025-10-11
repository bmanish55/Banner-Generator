import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bannerAPI } from '../services/api';

const MyBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      const response = await bannerAPI.getBanners();
      setBanners(response.data.banners);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) {
      return;
    }

    try {
      await bannerAPI.deleteBanner(id);
      setBanners(banners.filter(b => b.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete banner');
    }
  };

  const handleDownload = (banner) => {
    const link = document.createElement('a');
    link.href = banner.image_path;
    link.download = `${banner.title}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div style={styles.loading}>Loading banners...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Banners</h1>
        <Link to="/create" style={styles.createButton}>
          + Create New Banner
        </Link>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {banners.length === 0 ? (
        <div style={styles.empty}>
          <p>You haven't created any banners yet.</p>
          <Link to="/create" style={styles.button}>
            Create Your First Banner
          </Link>
        </div>
      ) : (
        <div style={styles.grid}>
          {banners.map((banner) => (
            <div key={banner.id} style={styles.card}>
              <div style={styles.imageContainer}>
                <img
                  src={banner.image_path}
                  alt={banner.title}
                  style={styles.image}
                />
              </div>
              <div style={styles.cardContent}>
                <h3 style={styles.bannerTitle}>{banner.title}</h3>
                <p style={styles.requirements}>{banner.requirements.substring(0, 100)}...</p>
                <p style={styles.date}>
                  Created: {new Date(banner.created_at).toLocaleDateString()}
                </p>
                <div style={styles.actions}>
                  <button
                    onClick={() => handleDownload(banner)}
                    style={styles.downloadButton}
                  >
                    📥 Download
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    style={styles.deleteButton}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: 'calc(100vh - 60px)',
    backgroundColor: '#ECF0F1',
    padding: '2rem'
  },
  header: {
    maxWidth: '1200px',
    margin: '0 auto 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: '2rem',
    color: '#2C3E50'
  },
  createButton: {
    backgroundColor: '#27AE60',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    textDecoration: 'none',
    fontWeight: '500'
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.2rem',
    color: '#7F8C8D'
  },
  error: {
    backgroundColor: '#E74C3C',
    color: 'white',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    maxWidth: '1200px',
    margin: '0 auto 1rem'
  },
  empty: {
    textAlign: 'center',
    padding: '3rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    maxWidth: '600px',
    margin: '0 auto'
  },
  button: {
    display: 'inline-block',
    backgroundColor: '#3498DB',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    textDecoration: 'none',
    marginTop: '1rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s'
  },
  imageContainer: {
    width: '100%',
    height: '200px',
    overflow: 'hidden',
    backgroundColor: '#ECF0F1'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  cardContent: {
    padding: '1.5rem'
  },
  bannerTitle: {
    fontSize: '1.3rem',
    marginBottom: '0.5rem',
    color: '#2C3E50'
  },
  requirements: {
    fontSize: '0.9rem',
    color: '#7F8C8D',
    marginBottom: '0.5rem'
  },
  date: {
    fontSize: '0.85rem',
    color: '#95A5A6',
    marginBottom: '1rem'
  },
  actions: {
    display: 'flex',
    gap: '0.5rem'
  },
  downloadButton: {
    flex: 1,
    backgroundColor: '#3498DB',
    color: 'white',
    border: 'none',
    padding: '0.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem'
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#E74C3C',
    color: 'white',
    border: 'none',
    padding: '0.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem'
  }
};

export default MyBanners;
