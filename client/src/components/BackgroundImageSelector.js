import React, { useState, useEffect } from 'react';
import { unsplashAPI } from '../services/api';
import { toast } from 'react-toastify';

const BackgroundImageSelector = ({ onImageSelect, selectedImage, purpose, targetAudience }) => {
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('suggested');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    loadCategories();
    loadSuggestions();
    loadSuggestedImages();
  }, [purpose, targetAudience]);

  const loadCategories = async () => {
    try {
      const response = await unsplashAPI.getCategories();
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadSuggestions = async () => {
    if (!purpose) return;
    
    try {
      const response = await unsplashAPI.getSuggestions(purpose, targetAudience);
      setSuggestions(response.data.suggestions);
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    }
  };

  const loadSuggestedImages = async () => {
    if (!purpose) return;
    
    setLoading(true);
    try {
      const response = await unsplashAPI.getRandomImage(purpose);
      if (response.data.success) {
        setImages([response.data.image]);
      }
    } catch (error) {
      toast.error('Failed to load suggested images');
    } finally {
      setLoading(false);
    }
  };

  const searchImages = async (query) => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await unsplashAPI.searchImages(query);
      setImages(response.data.data.images);
      if (response.data.fallback) {
        toast.info('Using fallback images - add Unsplash API key for more options');
      }
    } catch (error) {
      toast.error('Failed to search images');
    } finally {
      setLoading(false);
    }
  };

  const loadCategoryImages = async (category) => {
    setLoading(true);
    try {
      const response = await unsplashAPI.getCuratedImages(category);
      setImages(response.data.data.images);
      if (response.data.fallback) {
        toast.info('Using fallback images - add Unsplash API key for more options');
      }
    } catch (error) {
      toast.error('Failed to load category images');
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (image) => {
    onImageSelect(image);
    toast.success('Background image selected!');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchImages(searchQuery);
    setActiveTab('search');
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    searchImages(suggestion);
    setActiveTab('search');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Background Images</h3>
        <p style={styles.subtitle}>Choose a background image for your banner</p>
      </div>

      {/* Tab Navigation */}
      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab('suggested')}
          style={{
            ...styles.tab,
            ...(activeTab === 'suggested' ? styles.activeTab : {})
          }}
        >
          Suggested
        </button>
        <button
          onClick={() => setActiveTab('search')}
          style={{
            ...styles.tab,
            ...(activeTab === 'search' ? styles.activeTab : {})
          }}
        >
          Search
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          style={{
            ...styles.tab,
            ...(activeTab === 'categories' ? styles.activeTab : {})
          }}
        >
          Categories
        </button>
      </div>

      {/* Search Tab */}
      {activeTab === 'search' && (
        <div style={styles.searchSection}>
          <form onSubmit={handleSearchSubmit} style={styles.searchForm}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for background images..."
              style={styles.searchInput}
            />
            <button type="submit" style={styles.searchButton}>
              Search
            </button>
          </form>
          
          {/* Search Suggestions */}
          {suggestions.length > 0 && (
            <div style={styles.suggestions}>
              <span style={styles.suggestionsLabel}>Suggested: </span>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  style={styles.suggestionTag}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div style={styles.categoriesGrid}>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                loadCategoryImages(category.id);
                setActiveTab('search');
              }}
              style={styles.categoryCard}
            >
              <div style={styles.categoryName}>{category.name}</div>
              <div style={styles.categoryDescription}>{category.description}</div>
            </button>
          ))}
        </div>
      )}

      {/* Selected Image Display */}
      {selectedImage && (
        <div style={styles.selectedImageContainer}>
          <div style={styles.selectedImageLabel}>Selected Background:</div>
          <div style={styles.selectedImageCard}>
            <img 
              src={selectedImage.thumb} 
              alt={selectedImage.description}
              style={styles.selectedImageThumb}
            />
            <div style={styles.selectedImageInfo}>
              <div style={styles.selectedImageTitle}>{selectedImage.description}</div>
              <div style={styles.selectedImageCredit}>
                Photo by {selectedImage.photographer}
              </div>
            </div>
            <button
              onClick={() => onImageSelect(null)}
              style={styles.removeButton}
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Images Grid */}
      {loading ? (
        <div style={styles.loading}>
          <div className="spinner"></div>
          <div>Loading images...</div>
        </div>
      ) : (
        <div style={styles.imagesGrid}>
          {images.map((image) => (
            <div
              key={image.id}
              onClick={() => handleImageSelect(image)}
              style={{
                ...styles.imageCard,
                ...(selectedImage?.id === image.id ? styles.selectedImageCard : {})
              }}
            >
              <img 
                src={image.thumb} 
                alt={image.description}
                style={styles.imageThumb}
              />
              <div style={styles.imageOverlay}>
                <div style={styles.imageTitle}>{image.description}</div>
                <div style={styles.imageCredit}>
                  📷 {image.photographer}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Clear Selection */}
      {selectedImage && (
        <div style={styles.clearSection}>
          <button
            onClick={() => onImageSelect(null)}
            style={styles.clearButton}
          >
            Use Solid Color Background Instead
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    marginBottom: '24px',
  },
  header: {
    marginBottom: '20px',
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
  },
  tabs: {
    display: 'flex',
    borderBottom: '1px solid #e5e7eb',
    marginBottom: '20px',
  },
  tab: {
    padding: '8px 16px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#6b7280',
    borderBottom: '2px solid transparent',
  },
  activeTab: {
    color: '#667eea',
    borderBottomColor: '#667eea',
  },
  searchSection: {
    marginBottom: '20px',
  },
  searchForm: {
    display: 'flex',
    gap: '8px',
    marginBottom: '12px',
  },
  searchInput: {
    flex: 1,
    padding: '8px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '14px',
  },
  searchButton: {
    padding: '8px 16px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  suggestions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    alignItems: 'center',
  },
  suggestionsLabel: {
    fontSize: '12px',
    color: '#6b7280',
  },
  suggestionTag: {
    padding: '4px 8px',
    backgroundColor: '#f3f4f6',
    border: '1px solid #e5e7eb',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: 'pointer',
    color: '#374151',
  },
  categoriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '12px',
    marginBottom: '20px',
  },
  categoryCard: {
    padding: '12px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    background: 'white',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s ease',
  },
  categoryName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '4px',
  },
  categoryDescription: {
    fontSize: '12px',
    color: '#6b7280',
  },
  selectedImageContainer: {
    marginBottom: '20px',
    padding: '16px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
  },
  selectedImageLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '12px',
  },
  selectedImageCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  selectedImageThumb: {
    width: '60px',
    height: '40px',
    objectFit: 'cover',
    borderRadius: '4px',
  },
  selectedImageInfo: {
    flex: 1,
  },
  selectedImageTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#111827',
  },
  selectedImageCredit: {
    fontSize: '12px',
    color: '#6b7280',
  },
  removeButton: {
    padding: '4px 8px',
    fontSize: '12px',
    color: '#ef4444',
    border: '1px solid #ef4444',
    borderRadius: '4px',
    background: 'white',
    cursor: 'pointer',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    color: '#6b7280',
  },
  imagesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '8px',
    marginBottom: '20px',
  },
  imageCard: {
    position: 'relative',
    aspectRatio: '16/9',
    borderRadius: '8px',
    overflow: 'hidden',
    cursor: 'pointer',
    border: '2px solid transparent',
    transition: 'all 0.2s ease',
  },
  imageThumb: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
    padding: '8px',
    color: 'white',
  },
  imageTitle: {
    fontSize: '11px',
    fontWeight: '500',
    marginBottom: '2px',
  },
  imageCredit: {
    fontSize: '10px',
    opacity: 0.8,
  },
  clearSection: {
    textAlign: 'center',
    paddingTop: '16px',
    borderTop: '1px solid #e5e7eb',
  },
  clearButton: {
    padding: '8px 16px',
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default BackgroundImageSelector;