import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WizardSteps from '../components/WizardSteps';
import { bannerAPI } from '../services/api';

const CreateBanner = () => {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [requirements, setRequirements] = useState('');
  const [designs, setDesigns] = useState([]);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await bannerAPI.generateDesigns(requirements);
      setDesigns(response.data.designs);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate designs');
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Continue = () => {
    if (!selectedDesign) {
      setError('Please select a design');
      return;
    }
    setError('');
    setStep(3);
  };

  const handleFinalize = async () => {
    setError('');
    setLoading(true);

    try {
      await bannerAPI.createBanner({
        title,
        requirements,
        design: selectedDesign
      });
      navigate('/banners');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create banner');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <WizardSteps currentStep={step} />
      
      {error && <div style={styles.error}>{error}</div>}

      {step === 1 && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Step 1: Enter Your Requirements</h2>
          <form onSubmit={handleStep1Submit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Banner Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={styles.input}
                placeholder="e.g., Summer Sale Banner"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Design Requirements</label>
              <textarea
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                required
                style={styles.textarea}
                placeholder="Describe your banner needs: colors, theme, message, target audience..."
                rows="6"
              />
            </div>
            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? 'Generating Designs...' : 'Generate AI Designs'}
            </button>
          </form>
        </div>
      )}

      {step === 2 && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Step 2: Choose Your Design</h2>
          <div style={styles.designs}>
            {designs.map((design, index) => (
              <div
                key={index}
                style={{
                  ...styles.designCard,
                  ...(selectedDesign === design ? styles.designCardSelected : {})
                }}
                onClick={() => setSelectedDesign(design)}
              >
                <h3 style={styles.designName}>{design.name}</h3>
                <div style={styles.designPreview}>
                  <div
                    style={{
                      background: `linear-gradient(135deg, ${design.colors.primary} 0%, ${design.colors.secondary} 100%)`,
                      width: '100%',
                      height: '150px',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: design.colors.accent,
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      padding: '1rem',
                      textAlign: 'center'
                    }}
                  >
                    {design.textContent}
                  </div>
                </div>
                <p style={styles.designTheme}>Theme: {design.theme}</p>
                <p style={styles.designDescription}>{design.description}</p>
                <div style={styles.colorPalette}>
                  <span style={{ ...styles.colorSwatch, backgroundColor: design.colors.primary }}></span>
                  <span style={{ ...styles.colorSwatch, backgroundColor: design.colors.secondary }}></span>
                  <span style={{ ...styles.colorSwatch, backgroundColor: design.colors.accent }}></span>
                </div>
              </div>
            ))}
          </div>
          <div style={styles.buttonGroup}>
            <button onClick={() => setStep(1)} style={styles.buttonSecondary}>
              Back
            </button>
            <button onClick={handleStep2Continue} style={styles.button}>
              Continue
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Step 3: Finalize Your Banner</h2>
          <div style={styles.finalPreview}>
            <h3>Selected Design: {selectedDesign.name}</h3>
            <div
              style={{
                background: `linear-gradient(135deg, ${selectedDesign.colors.primary} 0%, ${selectedDesign.colors.secondary} 100%)`,
                width: '100%',
                maxWidth: '800px',
                height: '420px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: selectedDesign.colors.accent,
                fontSize: '2.5rem',
                fontWeight: 'bold',
                padding: '2rem',
                textAlign: 'center',
                margin: '2rem auto',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            >
              {selectedDesign.textContent}
            </div>
            <p style={styles.info}>
              Your banner will be rendered as a high-quality PNG image (1200x630px)
            </p>
          </div>
          <div style={styles.buttonGroup}>
            <button onClick={() => setStep(2)} style={styles.buttonSecondary}>
              Back
            </button>
            <button onClick={handleFinalize} disabled={loading} style={styles.button}>
              {loading ? 'Creating Banner...' : 'Finalize & Save Banner'}
            </button>
          </div>
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
  card: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  cardTitle: {
    fontSize: '1.8rem',
    marginBottom: '1.5rem',
    color: '#2C3E50',
    textAlign: 'center'
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
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    fontSize: '1rem',
    fontWeight: '500',
    color: '#2C3E50'
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #BDC3C7',
    borderRadius: '4px',
    fontSize: '1rem'
  },
  textarea: {
    padding: '0.75rem',
    border: '1px solid #BDC3C7',
    borderRadius: '4px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    resize: 'vertical'
  },
  button: {
    backgroundColor: '#3498DB',
    color: 'white',
    border: 'none',
    padding: '1rem',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: '500'
  },
  buttonSecondary: {
    backgroundColor: '#95A5A6',
    color: 'white',
    border: 'none',
    padding: '1rem',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: '500'
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    marginTop: '2rem'
  },
  designs: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  },
  designCard: {
    border: '2px solid #BDC3C7',
    borderRadius: '8px',
    padding: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },
  designCardSelected: {
    borderColor: '#3498DB',
    backgroundColor: '#EBF5FB',
    transform: 'scale(1.02)'
  },
  designName: {
    fontSize: '1.2rem',
    marginBottom: '1rem',
    color: '#2C3E50'
  },
  designPreview: {
    marginBottom: '1rem'
  },
  designTheme: {
    fontSize: '0.9rem',
    color: '#7F8C8D',
    marginBottom: '0.5rem'
  },
  designDescription: {
    fontSize: '0.9rem',
    color: '#34495E',
    marginBottom: '1rem'
  },
  colorPalette: {
    display: 'flex',
    gap: '0.5rem'
  },
  colorSwatch: {
    width: '30px',
    height: '30px',
    borderRadius: '4px',
    border: '1px solid #BDC3C7'
  },
  finalPreview: {
    textAlign: 'center'
  },
  info: {
    color: '#7F8C8D',
    fontSize: '0.9rem',
    marginTop: '1rem'
  }
};

export default CreateBanner;
