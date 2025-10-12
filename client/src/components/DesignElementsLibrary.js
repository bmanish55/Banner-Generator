import React, { useState } from 'react';

const DesignElementsLibrary = ({ onElementAdd }) => {
  const [activeTab, setActiveTab] = useState('shapes');

  // Basic Shapes
  const shapes = [
    {
      id: 'rectangle',
      name: 'Rectangle',
      svg: (
        <rect
          x="2"
          y="2"
          width="36"
          height="24"
          fill="#667eea"
          stroke="#4f46e5"
          strokeWidth="1"
        />
      ),
      data: {
        type: 'shape',
        shape: 'rectangle',
        width: 150,
        height: 100,
        fill: '#667eea',
        stroke: '#4f46e5',
        strokeWidth: 2,
      }
    },
    {
      id: 'circle',
      name: 'Circle',
      svg: (
        <circle
          cx="20"
          cy="15"
          r="12"
          fill="#10b981"
          stroke="#059669"
          strokeWidth="1"
        />
      ),
      data: {
        type: 'shape',
        shape: 'circle',
        width: 100,
        height: 100,
        fill: '#10b981',
        stroke: '#059669',
        strokeWidth: 2,
      }
    },
    {
      id: 'triangle',
      name: 'Triangle',
      svg: (
        <polygon
          points="20,3 35,25 5,25"
          fill="#f59e0b"
          stroke="#d97706"
          strokeWidth="1"
        />
      ),
      data: {
        type: 'shape',
        shape: 'triangle',
        width: 100,
        height: 100,
        fill: '#f59e0b',
        stroke: '#d97706',
        strokeWidth: 2,
      }
    },
    {
      id: 'diamond',
      name: 'Diamond',
      svg: (
        <polygon
          points="20,3 35,15 20,27 5,15"
          fill="#ef4444"
          stroke="#dc2626"
          strokeWidth="1"
        />
      ),
      data: {
        type: 'shape',
        shape: 'diamond',
        width: 100,
        height: 100,
        fill: '#ef4444',
        stroke: '#dc2626',
        strokeWidth: 2,
      }
    },
    {
      id: 'star',
      name: 'Star',
      svg: (
        <polygon
          points="20,2 25,12 36,12 28,19 31,29 20,24 9,29 12,19 4,12 15,12"
          fill="#8b5cf6"
          stroke="#7c3aed"
          strokeWidth="1"
        />
      ),
      data: {
        type: 'shape',
        shape: 'star',
        width: 100,
        height: 100,
        fill: '#8b5cf6',
        stroke: '#7c3aed',
        strokeWidth: 2,
      }
    },
    {
      id: 'arrow-right',
      name: 'Arrow Right',
      svg: (
        <polygon
          points="5,10 25,10 25,5 35,15 25,25 25,20 5,20"
          fill="#06b6d4"
          stroke="#0891b2"
          strokeWidth="1"
        />
      ),
      data: {
        type: 'shape',
        shape: 'arrow-right',
        width: 120,
        height: 60,
        fill: '#06b6d4',
        stroke: '#0891b2',
        strokeWidth: 2,
      }
    }
  ];

  // Business Icons
  const businessIcons = [
    {
      id: 'chart-bar',
      name: 'Bar Chart',
      svg: (
        <g fill="#374151">
          <rect x="3" y="18" width="4" height="6" />
          <rect x="9" y="12" width="4" height="12" />
          <rect x="15" y="8" width="4" height="16" />
          <rect x="21" y="14" width="4" height="10" />
        </g>
      ),
      data: {
        type: 'icon',
        icon: 'chart-bar',
        width: 60,
        height: 60,
        color: '#374151'
      }
    },
    {
      id: 'trending-up',
      name: 'Trending Up',
      svg: (
        <g fill="none" stroke="#10b981" strokeWidth="2">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </g>
      ),
      data: {
        type: 'icon',
        icon: 'trending-up',
        width: 60,
        height: 60,
        color: '#10b981'
      }
    },
    {
      id: 'users',
      name: 'Users',
      svg: (
        <g fill="none" stroke="#6366f1" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </g>
      ),
      data: {
        type: 'icon',
        icon: 'users',
        width: 60,
        height: 60,
        color: '#6366f1'
      }
    },
    {
      id: 'shopping-cart',
      name: 'Shopping Cart',
      svg: (
        <g fill="none" stroke="#f59e0b" strokeWidth="2">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </g>
      ),
      data: {
        type: 'icon',
        icon: 'shopping-cart',
        width: 60,
        height: 60,
        color: '#f59e0b'
      }
    },
    {
      id: 'target',
      name: 'Target',
      svg: (
        <g fill="none" stroke="#ef4444" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </g>
      ),
      data: {
        type: 'icon',
        icon: 'target',
        width: 60,
        height: 60,
        color: '#ef4444'
      }
    },
    {
      id: 'shield-check',
      name: 'Shield Check',
      svg: (
        <g fill="none" stroke="#10b981" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </g>
      ),
      data: {
        type: 'icon',
        icon: 'shield-check',
        width: 60,
        height: 60,
        color: '#10b981'
      }
    },
    {
      id: 'star-icon',
      name: 'Star',
      svg: (
        <g fill="#fbbf24" stroke="#f59e0b" strokeWidth="1">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </g>
      ),
      data: {
        type: 'icon',
        icon: 'star-icon',
        width: 60,
        height: 60,
        color: '#fbbf24'
      }
    },
    {
      id: 'heart',
      name: 'Heart',
      svg: (
        <g fill="#ef4444" stroke="#dc2626" strokeWidth="1">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </g>
      ),
      data: {
        type: 'icon',
        icon: 'heart',
        width: 60,
        height: 60,
        color: '#ef4444'
      }
    }
  ];

  // Social Media Icons
  const socialIcons = [
    {
      id: 'facebook',
      name: 'Facebook',
      svg: (
        <g fill="#1877f2">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </g>
      ),
      data: {
        type: 'icon',
        icon: 'facebook',
        width: 50,
        height: 50,
        color: '#1877f2'
      }
    },
    {
      id: 'instagram',
      name: 'Instagram',
      svg: (
        <g fill="#E4405F">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </g>
      ),
      data: {
        type: 'icon',
        icon: 'instagram',
        width: 50,
        height: 50,
        color: '#E4405F'
      }
    },
    {
      id: 'twitter',
      name: 'Twitter/X',
      svg: (
        <g fill="#1da1f2">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </g>
      ),
      data: {
        type: 'icon',
        icon: 'twitter',
        width: 50,
        height: 50,
        color: '#1da1f2'
      }
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      svg: (
        <g fill="#0077b5">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </g>
      ),
      data: {
        type: 'icon',
        icon: 'linkedin',
        width: 50,
        height: 50,
        color: '#0077b5'
      }
    }
  ];

  // Decorative Elements
  const decorativeElements = [
    {
      id: 'sparkle',
      name: 'Sparkle',
      svg: (
        <g fill="#fbbf24">
          <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" />
          <path d="M20 10l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" />
          <path d="M6 18l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" />
        </g>
      ),
      data: {
        type: 'decorative',
        element: 'sparkle',
        width: 80,
        height: 80,
        color: '#fbbf24'
      }
    },
    {
      id: 'burst',
      name: 'Burst',
      svg: (
        <g fill="#ef4444">
          <polygon points="12,2 14,8 20,6 16,12 22,14 16,16 20,22 14,16 12,22 10,16 4,18 8,12 2,10 8,8 4,2 10,8" />
        </g>
      ),
      data: {
        type: 'decorative',
        element: 'burst',
        width: 100,
        height: 100,
        color: '#ef4444'
      }
    },
    {
      id: 'ribbon',
      name: 'Ribbon',
      svg: (
        <g fill="#8b5cf6">
          <path d="M2 8c0-2.2 1.8-4 4-4h12c2.2 0 4 1.8 4 4v8c0 2.2-1.8 4-4 4H6c-2.2 0-4-1.8-4-4V8z" />
          <path d="M6 4L2 8v8l4-4V4z" fill="#7c3aed" />
          <path d="M18 4l4 4v8l-4-4V4z" fill="#7c3aed" />
        </g>
      ),
      data: {
        type: 'decorative',
        element: 'ribbon',
        width: 120,
        height: 60,
        color: '#8b5cf6'
      }
    }
  ];

  const handleElementClick = (element) => {
    onElementAdd({
      ...element.data,
      id: `${element.id}-${Date.now()}`,
      x: 50,
      y: 50,
      rotation: 0,
      opacity: 1
    });
  };

  const renderElementGrid = (elements) => (
    <div style={styles.elementsGrid}>
      {elements.map((element) => (
        <div
          key={element.id}
          style={styles.elementCard}
          onClick={() => handleElementClick(element)}
          title={element.name}
        >
          <div style={styles.elementIcon}>
            <svg viewBox="0 0 40 30" width="40" height="30">
              {element.svg}
            </svg>
          </div>
          <span style={styles.elementName}>{element.name}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Design Elements</h3>
        <div style={styles.tabs}>
          <button
            onClick={() => setActiveTab('shapes')}
            style={{
              ...styles.tab,
              ...(activeTab === 'shapes' ? styles.activeTab : {})
            }}
          >
            Shapes
          </button>
          <button
            onClick={() => setActiveTab('business')}
            style={{
              ...styles.tab,
              ...(activeTab === 'business' ? styles.activeTab : {})
            }}
          >
            Business
          </button>
          <button
            onClick={() => setActiveTab('social')}
            style={{
              ...styles.tab,
              ...(activeTab === 'social' ? styles.activeTab : {})
            }}
          >
            Social
          </button>
          <button
            onClick={() => setActiveTab('decorative')}
            style={{
              ...styles.tab,
              ...(activeTab === 'decorative' ? styles.activeTab : {})
            }}
          >
            Decorative
          </button>
        </div>
      </div>

      <div style={styles.content}>
        {activeTab === 'shapes' && renderElementGrid(shapes)}
        {activeTab === 'business' && renderElementGrid(businessIcons)}
        {activeTab === 'social' && renderElementGrid(socialIcons)}
        {activeTab === 'decorative' && renderElementGrid(decorativeElements)}
      </div>

      <div style={styles.footer}>
        <p style={styles.footerText}>
          Click any element to add it to your banner design
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    backgroundColor: 'white',
    marginBottom: '20px',
  },
  header: {
    padding: '16px',
    borderBottom: '1px solid #e5e7eb',
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '12px',
  },
  tabs: {
    display: 'flex',
    gap: '4px',
  },
  tab: {
    padding: '6px 12px',
    fontSize: '14px',
    border: '1px solid #e5e7eb',
    borderRadius: '4px',
    background: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  activeTab: {
    backgroundColor: '#667eea',
    color: 'white',
    borderColor: '#667eea',
  },
  content: {
    padding: '16px',
    maxHeight: '300px',
    overflowY: 'auto',
  },
  elementsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
    gap: '12px',
  },
  elementCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '12px 8px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: '#f9fafb',
  },
  elementIcon: {
    marginBottom: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  elementName: {
    fontSize: '11px',
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: '1.2',
  },
  footer: {
    padding: '12px 16px',
    backgroundColor: '#f9fafb',
    borderTop: '1px solid #e5e7eb',
    borderBottomLeftRadius: '8px',
    borderBottomRightRadius: '8px',
  },
  footerText: {
    fontSize: '12px',
    color: '#6b7280',
    margin: 0,
    textAlign: 'center',
  },
};

export default DesignElementsLibrary;