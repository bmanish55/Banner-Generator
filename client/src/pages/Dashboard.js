import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { bannersAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('dashboard-theme') || 'light'; } catch(e){ return 'light'; }
  });

  useEffect(() => {
    try { localStorage.setItem('dashboard-theme', theme); } catch(e){}
  }, [theme]);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await bannersAPI.getAll();
      setBanners(response.data.banners);
    } catch (error) {
      toast.error('Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  const deleteBanner = async (id) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) {
      return;
    }

    try {
      await bannersAPI.delete(id);
      setBanners(banners.filter(banner => banner.id !== id));
      toast.success('Banner deleted successfully');
    } catch (error) {
      toast.error('Failed to delete banner');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div style={styles.pageContainer}>
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`dashboard-page ${theme === 'dark' ? 'theme-dark' : 'theme-light'}`} style={styles.pageContainer}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Welcome back, {user?.name}!</h1>
          <p style={styles.subtitle}>
            {banners.length === 0 
              ? "You haven't created any banners yet. Let's get started!"
              : `You have ${banners.length} banner${banners.length === 1 ? '' : 's'} ready to go.`
            }
          </p>
        </div>
        <div style={{display:'flex', alignItems:'center', gap:12}}>
          <button
            onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
            className="theme-toggle-btn"
            aria-label="Toggle dark / light"
            title="Toggle dark / light"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <Link to="/create" className="dashboard-create-btn" style={styles.createButton}>
            ✨ Create New Banner
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <StatCard 
          label="Total Banners" 
          value={banners.length} 
          icon="📊" 
          color="#3b82f6"
        />
        <StatCard 
          label="Instagram" 
          value={banners.filter(b => b.platform === 'instagram').length} 
          icon="📸"
          color="#c13584"
        />
        <StatCard 
          label="LinkedIn" 
          value={banners.filter(b => b.platform === 'linkedin').length} 
          icon="💼"
          color="#0a66c2"
        />
      </div>

      {/* Banners Grid */}
      {banners.length === 0 ? (
        <div className="empty-state" style={styles.emptyState}>
          <div style={styles.emptyIcon}>🎨</div>
          <h3 style={styles.emptyTitle}>Your canvas is empty</h3>
          <p style={styles.emptyDescription}>
            Start creating beautiful, AI-powered banners to see them here.
          </p>
          <Link to="/create" className="dashboard-create-btn" style={{...styles.createButton, marginTop: '20px'}}>
            Create Your First Banner
          </Link>
        </div>
      ) : (
        <div>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Your Banners</h2>
          </div>
          <div style={styles.bannersGrid}>
            {banners.map((banner) => (
              <BannerCard key={banner.id} banner={banner} onDelete={deleteBanner} formatDate={formatDate} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, icon, color }) => (
  <div style={{...styles.statCard, borderLeft: `5px solid ${color}`}}>
    <div style={styles.statIcon}>{icon}</div>
    <div>
      <div style={{...styles.statValue, color}}>{value}</div>
      <div style={styles.statLabel}>{label}</div>
    </div>
  </div>
);

const BannerCard = ({ banner, onDelete, formatDate }) => (
  <div style={styles.bannerCard}>
    <div style={styles.bannerPreview}>
      {banner.image_url ? (
        <img 
          src={`http://localhost:5000${banner.image_url}`} 
          alt={banner.title}
          style={styles.bannerImage}
        />
      ) : (
        <div style={styles.bannerPlaceholder}>
          <div style={styles.placeholderIcon}>🖼️</div>
          <div>No Preview</div>
        </div>
      )}
    </div>
    
    <div style={styles.bannerInfo}>
      <div style={styles.bannerHeader}>
        <h3 style={styles.bannerTitle}>{banner.title}</h3>
        <span style={{...styles.bannerPlatform, ...platformStyles[banner.platform]}}>
          {banner.platform.charAt(0).toUpperCase() + banner.platform.slice(1)}
        </span>
      </div>
      <p style={styles.bannerPurpose}>{banner.purpose}</p>
      <div style={styles.bannerMeta}>
        <span style={styles.bannerDate}>
          Created: {formatDate(banner.created_at)}
        </span>
      </div>
      
      <div style={styles.bannerActions}>
        <Link to={`/edit/${banner.id}`} style={{...styles.actionBtn, ...styles.editBtn}}>
          Edit
        </Link>
        {banner.image_url && (
          <a 
            href={`http://localhost:5000${banner.image_url}`}
            download={`${banner.title}.png`}
            style={{...styles.actionBtn, ...styles.downloadBtn}}
          >
            Download
          </a>
        )}
        <button onClick={() => onDelete(banner.id)} style={{...styles.actionBtn, ...styles.deleteBtn}}>
          Delete
        </button>
      </div>
    </div>
  </div>
);

const platformStyles = {
  instagram: { backgroundColor: '#e1306c', color: 'white' },
  linkedin: { backgroundColor: '#0a66c2', color: 'white' },
  facebook: { backgroundColor: '#1877f2', color: 'white' },
  twitter: { backgroundColor: '#1da1f2', color: 'white' },
};

const styles = {
  pageContainer: {
    padding: '40px',
    backgroundColor: 'var(--surface)',
    minHeight: 'calc(100vh - 80px)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: 'var(--text)',
  },
  subtitle: {
    fontSize: '18px',
    color: 'var(--muted)',
    marginTop: '4px',
  },
  createButton: {
    backgroundColor: 'var(--accent)',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'background-color 0.2s',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px',
    marginBottom: '40px',
  },
  statCard: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  statIcon: {
    fontSize: '36px',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: '700',
  },
  statLabel: {
    fontSize: '14px',
    color: 'var(--muted)',
    fontWeight: '500',
  },
  emptyState: {
    backgroundColor: 'white',
    padding: '80px 40px',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '20px',
    color: 'var(--accent)',
  },
  emptyTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: 'var(--text)',
    marginBottom: '12px',
  },
  emptyDescription: {
    fontSize: '16px',
    color: 'var(--muted)',
    maxWidth: '400px',
    margin: '0 auto',
  },
  sectionHeader: {
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--text)',
  },
  bannersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '24px',
  },
  bannerCard: {
    backgroundColor: 'var(--surface)',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    overflow: 'hidden',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
  },
  bannerPreview: {
    height: '200px',
    backgroundColor: 'var(--surface-2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  bannerPlaceholder: {
    color: '#9ca3af',
    textAlign: 'center',
  },
  placeholderIcon: {
    fontSize: '32px',
    marginBottom: '8px',
  },
  bannerInfo: {
    padding: '20px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  bannerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '8px',
  },
  bannerTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: 'var(--text)',
    lineHeight: 1.3,
  },
  bannerPlatform: {
    padding: '4px 10px',
    borderRadius: '16px',
    fontSize: '12px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
  },
  bannerPurpose: {
    fontSize: '14px',
    color: 'var(--muted)',
    marginBottom: '16px',
    flex: 1,
  },
  bannerMeta: {
    marginBottom: '16px',
  },
  bannerDate: {
    fontSize: '12px',
    color: 'var(--muted)',
  },
  bannerActions: {
    display: 'flex',
    gap: '12px',
    marginTop: 'auto',
  },
  actionBtn: {
    fontSize: '14px',
    padding: '8px 16px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  editBtn: {
    backgroundColor: 'var(--surface-2)',
    color: 'var(--text)',
  },

  downloadBtn: {
    backgroundColor: '#3b82f6',
    color: 'white',
  },
  deleteBtn: {
    backgroundColor: '#ef4444',
    color: 'white',
  },
};

export default Dashboard;