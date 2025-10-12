import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { aiAPI, bannersAPI } from '../services/api';
import BackgroundImageSelector from '../components/BackgroundImageSelector';
import './CreateBanner.css';

const CreateBanner = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [requirements, setRequirements] = useState({
    title: '',
    purpose: '',
    platform: '',
    mainText: '',
    colors: '',
    targetAudience: '',
  });
  const [suggestions, setSuggestions] = useState(null);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [selectedBackgroundImage, setSelectedBackgroundImage] = useState(null);
  const navigate = useNavigate();

  const purposes = [
    'Sale announcement',
    'Event promotion',
    'Product launch',
    'Brand awareness',
    'Job posting',
    'Newsletter signup',
    'Course promotion',
    'Service announcement',
    'Holiday greeting',
    'Testimonial showcase',
  ];

  const platforms = [
    { id: 'instagram', name: 'Instagram', sizes: ['1080x1080 (Post)', '1080x1920 (Story)'] },
    { id: 'linkedin', name: 'LinkedIn', sizes: ['1200x627 (Post)'] },
    { id: 'twitter', name: 'Twitter/X', sizes: ['1200x675 (Post)'] },
    { id: 'facebook', name: 'Facebook', sizes: ['1200x630 (Post)'] },
  ];

  const audiences = [
    'business',
    'influencer',
    'personal',
    'e-commerce',
    'education',
    'health',
    'technology',
    'creative',
  ];

  const handleInputChange = (field, value) => {
    setRequirements(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const generateSuggestions = async () => {
    if (!requirements.purpose || !requirements.platform || !requirements.mainText || !requirements.targetAudience) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await aiAPI.generateDesignSuggestions(requirements);
      setSuggestions(response.data.suggestions);
      setStep(2);
    } catch (error) {
      toast.error('Failed to generate design suggestions');
    } finally {
      setLoading(false);
    }
  };

  const selectDesign = (design) => {
    setSelectedDesign(design);
    setStep(3);
  };

  const handleBackgroundImageSelect = (image) => {
    setSelectedBackgroundImage(image);
  };

  const proceedToCreate = () => {
    setStep(4);
  };

  const createBanner = async () => {
    if (!selectedDesign) {
      toast.error('Please select a design');
      return;
    }

    setLoading(true);
    try {
      const bannerData = {
        title: requirements.title,
        platform: requirements.platform,
        purpose: requirements.purpose,
        mainText: requirements.mainText,
        colors: requirements.colors ? requirements.colors.split(',').map(c => c.trim()) : selectedDesign.colors,
        targetAudience: requirements.targetAudience,
        designData: {
          ...selectedDesign,
          mainText: requirements.mainText,
          supportingText: '', // Can be added later
          backgroundImage: selectedBackgroundImage,
        },
      };

      const response = await bannersAPI.create(bannerData);
      toast.success('Banner created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to create banner');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: '800px' }}>
      {/* Progress Bar */}
      <div style={styles.progressContainer}>
        <div style={styles.progressBar}>
          <div 
            style={{
              ...styles.progressFill,
              width: `${(step / 4) * 100}%`,
            }}
          />
        </div>
        <div style={styles.progressSteps}>
          <span style={step >= 1 ? styles.stepActive : styles.stepInactive}>1. Requirements</span>
          <span style={step >= 2 ? styles.stepActive : styles.stepInactive}>2. Design</span>
          <span style={step >= 3 ? styles.stepActive : styles.stepInactive}>3. Background</span>
          <span style={step >= 4 ? styles.stepActive : styles.stepInactive}>4. Create</span>
        </div>
      </div>

      {/* Step 1: Requirements */}
      {step === 1 && (
        <div className="card">
          <div className="card-header">
            <h1 className="card-title">Tell us what you need</h1>
            <p className="card-subtitle">
              Describe your banner requirements and we'll generate perfect designs for you
            </p>
          </div>

          <div style={styles.form}>
            <div className="form-group">
              <label className="form-label">Banner Title *</label>
              <input
                type="text"
                className="form-input"
                value={requirements.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Summer Sale 2024"
                required
              />
            </div>

            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Purpose *</label>
                <select
                  className="form-select"
                  value={requirements.purpose}
                  onChange={(e) => handleInputChange('purpose', e.target.value)}
                  required
                >
                  <option value="">Select purpose</option>
                  {purposes.map(purpose => (
                    <option key={purpose} value={purpose}>{purpose}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Platform *</label>
                <select
                  className="form-select"
                  value={requirements.platform}
                  onChange={(e) => handleInputChange('platform', e.target.value)}
                  required
                >
                  <option value="">Select platform</option>
                  {platforms.map(platform => (
                    <option key={platform.id} value={platform.id}>
                      {platform.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Main Text/Headline *</label>
              <textarea
                className="form-textarea"
                value={requirements.mainText}
                onChange={(e) => handleInputChange('mainText', e.target.value)}
                placeholder="e.g., Get 50% OFF on all summer items. Limited time offer!"
                required
              />
            </div>

            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Target Audience *</label>
                <select
                  className="form-select"
                  value={requirements.targetAudience}
                  onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                  required
                >
                  <option value="">Select audience</option>
                  {audiences.map(audience => (
                    <option key={audience} value={audience}>
                      {audience.charAt(0).toUpperCase() + audience.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Preferred Colors (optional)</label>
                <input
                  type="text"
                  className="form-input"
                  value={requirements.colors}
                  onChange={(e) => handleInputChange('colors', e.target.value)}
                  placeholder="e.g., blue, white, #FF5733"
                />
              </div>
            </div>

            <button
              onClick={generateSuggestions}
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? 'Generating Designs...' : '✨ Generate AI Designs'}
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Design Selection */}
      {step === 2 && suggestions && (
        <div className="card">
          <div className="card-header">
            <h1 className="card-title">Choose your design</h1>
            <p className="card-subtitle">
              Our AI generated these designs based on your requirements
            </p>
          </div>

          <div className="grid grid-2">
            {suggestions.designs.map((design) => (
              <div
                key={design.id}
                className="design-card"
                style={styles.designCard}
                onClick={() => selectDesign(design)}
              >
                <div style={styles.designPreview}>
                  <div style={{
                    ...styles.colorPalette,
                    background: `linear-gradient(45deg, ${design.colors.slice(0, 2).join(', ')})`
                  }}>
                    <h3 style={styles.previewText}>{requirements.mainText.slice(0, 30)}...</h3>
                  </div>
                </div>
                <div style={styles.designInfo}>
                  <h3 style={styles.designName}>{design.name}</h3>
                  <p style={styles.designLayout}>{design.layout}</p>
                  <div style={styles.colorDots}>
                    {design.colors.slice(0, 4).map((color, index) => (
                      <div
                        key={index}
                        style={{
                          ...styles.colorDot,
                          backgroundColor: color,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="step-actions" style={styles.stepActions}>
            <button
              onClick={() => setStep(1)}
              className="btn btn-secondary"
            >
              ← Back
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Background Image Selection */}
      {step === 3 && selectedDesign && (
        <div className="card">
          <div className="card-header">
            <h1 className="card-title"></h1>
            <p className="card-subtitle">
            </p>
          </div>

          <BackgroundImageSelector
            onImageSelect={handleBackgroundImageSelect}
            selectedImage={selectedBackgroundImage}
            purpose={requirements.purpose}
            targetAudience={requirements.targetAudience}
          />

          <div className="step-actions" style={styles.stepActions}>
            <button
              onClick={() => setStep(2)}
              className="btn btn-secondary"
            >
              ← Back to Design
            </button>
            <button
              onClick={proceedToCreate}
              className="btn btn-primary"
            >
              Continue to Preview →
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Final Creation */}
      {step === 4 && selectedDesign && (
        <div className="card">
          <div className="card-header">
            <h1 className="card-title">Ready to create!</h1>
            <p className="card-subtitle">
              Review your banner details and create your design
            </p>
          </div>

          <div style={styles.summary}>
            <h3 style={styles.summaryTitle}>Banner Summary</h3>
            <div style={styles.summaryGrid}>
              <div>
                <strong>Title:</strong> {requirements.title}
              </div>
              <div>
                <strong>Purpose:</strong> {requirements.purpose}
              </div>
              <div>
                <strong>Platform:</strong> {requirements.platform}
              </div>
              <div>
                <strong>Audience:</strong> {requirements.targetAudience}
              </div>
              <div>
                <strong>Design:</strong> {selectedDesign.name}
              </div>
              <div>
                <strong>Background:</strong> {selectedBackgroundImage ? `Image by ${selectedBackgroundImage.photographer}` : 'Solid color'}
              </div>
              <div>
                <strong>Main Text:</strong> {requirements.mainText}
              </div>
            </div>
          </div>

          <div className="step-actions" style={styles.stepActions}>
            <button
              onClick={() => setStep(3)}
              className="btn btn-secondary"
            >
              ← Change Background
            </button>
            <button
              onClick={createBanner}
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating Banner...' : '🎨 Create Banner'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  progressContainer: {
    marginBottom: '40px',
  },
  progressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#e5e7eb',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '16px',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    transition: 'width 0.3s ease',
  },
  progressSteps: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
  },
  stepActive: {
    color: '#667eea',
    fontWeight: '600',
  },
  stepInactive: {
    color: '#9ca3af',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  designCard: {
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  designPreview: {
    height: '150px',
    position: 'relative',
  },
  colorPalette: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    textAlign: 'center',
  },
  previewText: {
    fontSize: '16px',
    fontWeight: '600',
    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
  },
  designInfo: {
    padding: '16px',
  },
  designName: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#111827',
  },
  designLayout: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '12px',
  },
  colorDots: {
    display: 'flex',
    gap: '8px',
  },
  colorDot: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    border: '2px solid white',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
  },
  summary: {
    backgroundColor: '#f9fafb',
    padding: '24px',
    borderRadius: '8px',
    marginBottom: '24px',
  },
  summaryTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#111827',
  },
  summaryGrid: {
    display: 'grid',
    gap: '12px',
    fontSize: '14px',
    color: '#374151',
  },
  stepActions: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'space-between',
    marginTop: '24px',
  },
};

export default CreateBanner;