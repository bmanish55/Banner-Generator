import React, { useState, useEffect } from 'react';

const AdvancedTextEditor = ({ 
  textData = { 
    content: '', 
    fontSize: 24, 
    fontFamily: 'Arial', 
    fontWeight: 'normal',
    color: '#000000',
    shadow: false,
    outline: false,
    gradient: false,
    animation: 'none'
  }, 
  onTextChange 
}) => {
  const [text, setText] = useState(textData);
  const [showEffects, setShowEffects] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  // Google Fonts - Popular web-safe fonts for banners
  const googleFonts = [
    'Inter',
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
    'Poppins',
    'Source Sans Pro',
    'Oswald',
    'Raleway',
    'Nunito',
    'Playfair Display',
    'Merriweather',
    'PT Sans',
    'Ubuntu',
    'Crimson Text',
    'Lora',
    'Archivo',
    'Work Sans',
    'Fira Sans',
    'DM Sans'
  ];

  const fontWeights = [
    { value: '300', label: 'Light' },
    { value: 'normal', label: 'Regular' },
    { value: '500', label: 'Medium' },
    { value: '600', label: 'Semi Bold' },
    { value: 'bold', label: 'Bold' },
    { value: '800', label: 'Extra Bold' }
  ];

  const textAnimations = [
    { value: 'none', label: 'None' },
    { value: 'fadeIn', label: 'Fade In' },
    { value: 'slideInUp', label: 'Slide Up' },
    { value: 'slideInLeft', label: 'Slide Left' },
    { value: 'slideInRight', label: 'Slide Right' },
    { value: 'bounceIn', label: 'Bounce In' },
    { value: 'zoomIn', label: 'Zoom In' },
    { value: 'pulse', label: 'Pulse' },
    { value: 'typewriter', label: 'Typewriter' }
  ];

  useEffect(() => {
    onTextChange(text);
  }, [text, onTextChange]);

  const updateText = (property, value) => {
    setText(prev => ({
      ...prev,
      [property]: value
    }));
  };

  const getTextStyle = () => {
    const style = {
      fontFamily: text.fontFamily,
      fontSize: `${text.fontSize}px`,
      fontWeight: text.fontWeight,
      color: text.color,
      display: 'inline-block',
      padding: '8px 12px',
      borderRadius: '4px',
      background: 'rgba(255, 255, 255, 0.1)',
      minHeight: '40px',
      minWidth: '100px',
      wordBreak: 'break-word'
    };

    // Text Shadow Effect
    if (text.shadow) {
      style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';
    }

    // Text Outline Effect
    if (text.outline) {
      style.webkitTextStroke = '1px rgba(0, 0, 0, 0.5)';
      style.textStroke = '1px rgba(0, 0, 0, 0.5)';
    }

    // Gradient Text Effect
    if (text.gradient) {
      style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
      style.webkitBackgroundClip = 'text';
      style.webkitTextFillColor = 'transparent';
      style.backgroundClip = 'text';
    }

    // Animation
    if (text.animation !== 'none') {
      style.animation = `${text.animation} 1s ease-in-out`;
    }

    return style;
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Advanced Text Editor</h3>
        <div style={styles.toggleButtons}>
          <button
            onClick={() => setShowEffects(!showEffects)}
            style={{
              ...styles.toggleButton,
              ...(showEffects ? styles.activeToggle : {})
            }}
          >
            ✨ Effects
          </button>
          <button
            onClick={() => setShowAnimation(!showAnimation)}
            style={{
              ...styles.toggleButton,
              ...(showAnimation ? styles.activeToggle : {})
            }}
          >
            🎬 Animation
          </button>
        </div>
      </div>

      {/* Text Input */}
      <div style={styles.section}>
        <label style={styles.label}>Text Content</label>
        <textarea
          value={text.content}
          onChange={(e) => updateText('content', e.target.value)}
          placeholder="Enter your banner text..."
          style={styles.textArea}
          rows="3"
        />
      </div>

      {/* Basic Text Controls */}
      <div style={styles.row}>
        <div style={styles.column}>
          <label style={styles.label}>Font Family</label>
          <select
            value={text.fontFamily}
            onChange={(e) => updateText('fontFamily', e.target.value)}
            style={styles.select}
          >
            {googleFonts.map(font => (
              <option key={font} value={font} style={{ fontFamily: font }}>
                {font}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.column}>
          <label style={styles.label}>Font Weight</label>
          <select
            value={text.fontWeight}
            onChange={(e) => updateText('fontWeight', e.target.value)}
            style={styles.select}
          >
            {fontWeights.map(weight => (
              <option key={weight.value} value={weight.value}>
                {weight.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={styles.row}>
        <div style={styles.column}>
          <label style={styles.label}>Font Size: {text.fontSize}px</label>
          <input
            type="range"
            min="12"
            max="72"
            value={text.fontSize}
            onChange={(e) => updateText('fontSize', parseInt(e.target.value))}
            style={styles.slider}
          />
        </div>

        <div style={styles.column}>
          <label style={styles.label}>Text Color</label>
          <input
            type="color"
            value={text.color}
            onChange={(e) => updateText('color', e.target.value)}
            style={styles.colorPicker}
          />
        </div>
      </div>

      {/* Text Effects */}
      {showEffects && (
        <div style={styles.effectsSection}>
          <h4 style={styles.subTitle}>Text Effects</h4>
          <div style={styles.effectsGrid}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={text.shadow}
                onChange={(e) => updateText('shadow', e.target.checked)}
                style={styles.checkbox}
              />
              <span style={styles.checkboxText}>Drop Shadow</span>
            </label>

            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={text.outline}
                onChange={(e) => updateText('outline', e.target.checked)}
                style={styles.checkbox}
              />
              <span style={styles.checkboxText}>Text Outline</span>
            </label>

            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={text.gradient}
                onChange={(e) => updateText('gradient', e.target.checked)}
                style={styles.checkbox}
              />
              <span style={styles.checkboxText}>Gradient Fill</span>
            </label>
          </div>
        </div>
      )}

      {/* Animation Controls */}
      {showAnimation && (
        <div style={styles.animationSection}>
          <h4 style={styles.subTitle}>Animation</h4>
          <select
            value={text.animation}
            onChange={(e) => updateText('animation', e.target.value)}
            style={styles.select}
          >
            {textAnimations.map(anim => (
              <option key={anim.value} value={anim.value}>
                {anim.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '20px',
    backgroundColor: '#f9fafb',
    marginBottom: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    margin: 0,
  },
  toggleButtons: {
    display: 'flex',
    gap: '8px',
  },
  toggleButton: {
    padding: '6px 12px',
    fontSize: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    background: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  activeToggle: {
    backgroundColor: '#667eea',
    color: 'white',
    borderColor: '#667eea',
  },
  section: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '6px',
  },
  textArea: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '16px',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
  select: {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: 'white',
  },
  slider: {
    width: '100%',
    height: '6px',
    borderRadius: '3px',
    backgroundColor: '#d1d5db',
    outline: 'none',
    cursor: 'pointer',
  },
  colorPicker: {
    width: '60px',
    height: '40px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  effectsSection: {
    marginBottom: '16px',
    padding: '16px',
    backgroundColor: 'white',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
  },
  subTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '12px',
  },
  effectsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '12px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
  },
  checkbox: {
    width: '16px',
    height: '16px',
  },
  checkboxText: {
    fontSize: '14px',
    color: '#374151',
  },
  animationSection: {
    marginBottom: '16px',
    padding: '16px',
    backgroundColor: 'white',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
  },
};

export default AdvancedTextEditor;