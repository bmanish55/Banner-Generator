import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { bannersAPI } from '../services/api';
import BackgroundImageSelector from '../components/BackgroundImageSelector';
import AdvancedTextEditor from '../components/AdvancedTextEditor';
import DesignElementsLibrary from '../components/DesignElementsLibrary';
import AdvancedLayoutTools from '../components/AdvancedLayoutTools';

// Helper Components
const ToolPanel = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const panelRef = useRef(null);

  // When a panel opens, ensure it is scrolled into view inside the sidebar
  useEffect(() => {
    if (isOpen && panelRef.current) {
      // scrollIntoView will scroll the nearest scrollable ancestor (the leftSidebar/tool-panels)
      panelRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [isOpen]);

  return (
    <div style={styles.toolPanel} ref={panelRef} aria-expanded={isOpen}>
      <button
        type="button"
        style={styles.panelToggle}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span style={styles.panelIcon}>{isOpen ? '▼' : '▶'}</span>
        <span style={styles.panelTitle}>{title}</span>
      </button>

      {/* render content always and animate via maxHeight/padding for smooth transitions */}
      <div style={{
        ...styles.panelContent,
        ...(isOpen ? styles.panelContentOpen : {})
      }}>
        {children}
      </div>
    </div>
  );
};

const ElementProperties = ({ element, onUpdate }) => {
  if (!element) return null;

  return (
    <div style={styles.properties}>
      <div style={styles.propertySection}>
        <h4 style={styles.propertySectionTitle}>Position</h4>
        <div style={styles.propertyRow}>
          <div style={styles.propertyField}>
            <label style={styles.propertyLabel}>X</label>
            <input
              type="number"
              value={element.x || 0}
              onChange={(e) => onUpdate({ x: parseInt(e.target.value) })}
              style={styles.numberInput}
            />
          </div>
          <div style={styles.propertyField}>
            <label style={styles.propertyLabel}>Y</label>
            <input
              type="number"
              value={element.y || 0}
              onChange={(e) => onUpdate({ y: parseInt(e.target.value) })}
              style={styles.numberInput}
            />
          </div>
        </div>
      </div>

      <div style={styles.propertySection}>
        <h4 style={styles.propertySectionTitle}>Size</h4>
        <div style={styles.propertyRow}>
          <div style={styles.propertyField}>
            <label style={styles.propertyLabel}>Width</label>
            <input
              type="number"
              value={element.width || 100}
              onChange={(e) => onUpdate({ width: parseInt(e.target.value) })}
              style={styles.numberInput}
            />
          </div>
          <div style={styles.propertyField}>
            <label style={styles.propertyLabel}>Height</label>
            <input
              type="number"
              value={element.height || 100}
              onChange={(e) => onUpdate({ height: parseInt(e.target.value) })}
              style={styles.numberInput}
            />
          </div>
        </div>
      </div>

      {element.type === 'shape' && (
        <div style={styles.propertySection}>
          <h4 style={styles.propertySectionTitle}>Appearance</h4>
          <div style={styles.propertyField}>
            <label style={styles.propertyLabel}>Fill Color</label>
            <input
              type="color"
              value={element.fill || '#667eea'}
              onChange={(e) => onUpdate({ fill: e.target.value })}
              style={styles.colorInput}
            />
          </div>
          <div style={styles.propertyField}>
            <label style={styles.propertyLabel}>Border Color</label>
            <input
              type="color"
              value={element.stroke || '#4f46e5'}
              onChange={(e) => onUpdate({ stroke: e.target.value })}
              style={styles.colorInput}
            />
          </div>
          <div style={styles.propertyField}>
            <label style={styles.propertyLabel}>Border Width</label>
            <input
              type="number"
              min="0"
              max="10"
              value={element.strokeWidth || 1}
              onChange={(e) => onUpdate({ strokeWidth: parseInt(e.target.value) })}
              style={styles.numberInput}
            />
          </div>
        </div>
      )}

      <div style={styles.propertySection}>
        <h4 style={styles.propertySectionTitle}>Transform</h4>
        <div style={styles.propertyField}>
          <label style={styles.propertyLabel}>Opacity</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={element.opacity || 1}
            onChange={(e) => onUpdate({ opacity: parseFloat(e.target.value) })}
            style={styles.rangeInput}
          />
          <span style={styles.rangeValue}>{Math.round((element.opacity || 1) * 100)}%</span>
        </div>
      </div>
    </div>
  );
};

const TextBoxProperties = ({ textBox, onUpdate }) => {
  if (!textBox) return null;

  return (
    <div style={styles.properties}>
      <div style={styles.propertySection}>
        <h4 style={styles.propertySectionTitle}>Text Content</h4>
        <div style={styles.propertyField}>
          <label style={styles.propertyLabel}>Content</label>
          <textarea
            value={textBox.content || ''}
            onChange={(e) => onUpdate({ content: e.target.value })}
            style={styles.textArea}
            rows="3"
            placeholder="Enter your text..."
          />
        </div>
      </div>

      <div style={styles.propertySection}>
        <h4 style={styles.propertySectionTitle}>Position</h4>
        <div style={styles.propertyRow}>
          <div style={styles.propertyField}>
            <label style={styles.propertyLabel}>X Position</label>
            <input
              type="number"
              min="2"
              max="98"
              value={Math.round(textBox.x || 50)}
              onChange={(e) => onUpdate({ x: parseInt(e.target.value) })}
              style={styles.numberInput}
            />
            <span style={styles.propertyUnit}>%</span>
          </div>
          <div style={styles.propertyField}>
            <label style={styles.propertyLabel}>Y Position</label>
            <input
              type="number"
              min="2"
              max="98"
              value={Math.round(textBox.y || 50)}
              onChange={(e) => onUpdate({ y: parseInt(e.target.value) })}
              style={styles.numberInput}
            />
            <span style={styles.propertyUnit}>%</span>
          </div>
        </div>
      </div>

      <div style={styles.propertySection}>
        <h4 style={styles.propertySectionTitle}>Typography</h4>
        <div style={styles.propertyRow}>
          <div style={styles.propertyField}>
            <label style={styles.propertyLabel}>Font Size</label>
            <input
              type="number"
              min="8"
              max="100"
              value={textBox.fontSize || 24}
              onChange={(e) => onUpdate({ fontSize: parseInt(e.target.value) })}
              style={styles.numberInput}
            />
            <span style={styles.propertyUnit}>px</span>
          </div>
          <div style={styles.propertyField}>
            <label style={styles.propertyLabel}>Font Weight</label>
            <select
              value={textBox.fontWeight || 'normal'}
              onChange={(e) => onUpdate({ fontWeight: e.target.value })}
              style={styles.selectInput}
            >
              <option value="300">Light</option>
              <option value="normal">Normal</option>
              <option value="500">Medium</option>
              <option value="600">Semi Bold</option>
              <option value="bold">Bold</option>
              <option value="800">Extra Bold</option>
            </select>
          </div>
        </div>

        <div style={styles.propertyRow}>
          <div style={styles.propertyField}>
            <label style={styles.propertyLabel}>Font Family</label>
            <select
              value={textBox.fontFamily || 'Inter'}
              onChange={(e) => onUpdate({ fontFamily: e.target.value })}
              style={styles.selectInput}
            >
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Open Sans">Open Sans</option>
              <option value="Lato">Lato</option>
              <option value="Montserrat">Montserrat</option>
              <option value="Poppins">Poppins</option>
              <option value="Oswald">Oswald</option>
              <option value="Raleway">Raleway</option>
              <option value="Playfair Display">Playfair Display</option>
            </select>
          </div>
          <div style={styles.propertyField}>
            <label style={styles.propertyLabel}>Text Align</label>
            <select
              value={textBox.textAlign || 'center'}
              onChange={(e) => onUpdate({ textAlign: e.target.value })}
              style={styles.selectInput}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
              <option value="justify">Justify</option>
            </select>
          </div>
        </div>

        <div style={styles.propertyField}>
          <label style={styles.propertyLabel}>Color</label>
          <input
            type="color"
            value={textBox.color || '#ffffff'}
            onChange={(e) => onUpdate({ color: e.target.value })}
            style={styles.colorInput}
          />
        </div>
      </div>

      <div style={styles.propertySection}>
        <h4 style={styles.propertySectionTitle}>Effects</h4>
        <div style={styles.propertyRow}>
          <div style={styles.propertyField}>
            <label style={styles.propertyLabel}>
              <input
                type="checkbox"
                checked={textBox.shadow || false}
                onChange={(e) => onUpdate({ shadow: e.target.checked })}
                style={styles.checkbox}
              />
              Text Shadow
            </label>
          </div>
          <div style={styles.propertyField}>
            <label style={styles.propertyLabel}>
              <input
                type="checkbox"
                checked={textBox.outline || false}
                onChange={(e) => onUpdate({ outline: e.target.checked })}
                style={styles.checkbox}
              />
              Text Outline
            </label>
          </div>
        </div>
        <div style={styles.propertyField}>
          <label style={styles.propertyLabel}>
            <input
              type="checkbox"
              checked={textBox.gradient || false}
              onChange={(e) => onUpdate({ gradient: e.target.checked })}
              style={styles.checkbox}
            />
            Gradient Fill
          </label>
        </div>
      </div>

      <div style={styles.propertySection}>
        <h4 style={styles.propertySectionTitle}>Transform</h4>
        <div style={styles.propertyField}>
          <label style={styles.propertyLabel}>Opacity</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={textBox.opacity || 1}
            onChange={(e) => onUpdate({ opacity: parseFloat(e.target.value) })}
            style={styles.rangeInput}
          />
          <span style={styles.rangeValue}>{Math.round((textBox.opacity || 1) * 100)}%</span>
        </div>
      </div>
    </div>
  );
};

const EditBanner = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [editData, setEditData] = useState({
    title: '',
    designData: null,
  });
  const [designElements, setDesignElements] = useState([]);
  const [textElements, setTextElements] = useState([]); // New state for text boxes
  const [selectedElement, setSelectedElement] = useState(null);

  useEffect(() => {
    fetchBanner();
  }, [id]);

  const fetchBanner = async () => {
    try {
      const response = await bannersAPI.getById(id);
      const bannerData = response.data.banner;
      setBanner(bannerData);
      setEditData({
        title: bannerData.title,
        designData: {
          ...bannerData.design_data,
          backgroundImage: bannerData.design_data?.backgroundImage || null,
        },
      });
      
      // Load existing design elements
      if (bannerData.design_data?.designElements) {
        setDesignElements(bannerData.design_data.designElements);
      }
      
      // Load existing text elements
      if (bannerData.design_data?.textElements) {
        setTextElements(bannerData.design_data.textElements);
      }
    } catch (error) {
      toast.error('Failed to load banner');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const updateTitle = (newTitle) => {
    setEditData(prev => ({
      ...prev,
      title: newTitle,
    }));
  };

  const updateColors = (colorIndex, newColor) => {
    setEditData(prev => ({
      ...prev,
      designData: {
        ...prev.designData,
        colors: prev.designData.colors.map((color, index) => 
          index === colorIndex ? newColor : color
        ),
      },
    }));
  };

  const updateText = (textData) => {
    setEditData(prev => ({
      ...prev,
      designData: {
        ...prev.designData,
        mainText: textData.content,
        textStyle: {
          fontSize: textData.fontSize,
          fontFamily: textData.fontFamily,
          fontWeight: textData.fontWeight,
          color: textData.color,
          shadow: textData.shadow,
          outline: textData.outline,
          gradient: textData.gradient,
          x: prev.designData?.textStyle?.x || 50, // Default to center
          y: prev.designData?.textStyle?.y || 50, // Default to center
        },
      },
    }));
  };

  const updateMainText = (newText) => {
    setEditData(prev => ({
      ...prev,
      designData: {
        ...prev.designData,
        mainText: newText,
      },
    }));
  };

  const updateTextPosition = (x, y) => {
    setEditData(prev => ({
      ...prev,
      designData: {
        ...prev.designData,
        textStyle: {
          ...prev.designData?.textStyle,
          x: x,
          y: y,
        },
      },
    }));
  };

  const updateBackgroundImage = (image) => {
    setEditData(prev => ({
      ...prev,
      designData: {
        ...prev.designData,
        backgroundImage: image,
      },
    }));
    setShowImageSelector(false);
    if (image) {
      toast.success('Background image updated!');
    } else {
      toast.success('Background image removed!');
    }
  };

  const addDesignElement = (element) => {
    setDesignElements(prev => [...prev, element]);
    toast.success(`Added ${element.type === 'shape' ? element.shape : element.type}!`);
  };

  const removeDesignElement = (elementId) => {
    setDesignElements(prev => prev.filter(el => el.id !== elementId));
    toast.success('Element removed!');
  };

  const updateDesignElement = (elementId, updates) => {
    setDesignElements(prev => 
      prev.map(el => el.id === elementId ? { ...el, ...updates } : el)
    );
  };

  // Text Box Management Functions
  const addTextBox = () => {
    const newTextBox = {
      id: `text_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'textbox',
      content: 'New Text',
      x: 50, // percentage
      y: 30, // percentage
      fontSize: 24,
      fontFamily: 'Inter',
      fontWeight: 'normal',
      color: '#ffffff',
      shadow: true,
      outline: false,
      gradient: false,
      textAlign: 'center',
      maxWidth: 300,
      lineHeight: 1.2,
      letterSpacing: 0.5,
      opacity: 1,
      rotation: 0,
      zIndex: textElements.length + 10
    };
    
    setTextElements(prev => [...prev, newTextBox]);
    setSelectedElement(newTextBox.id);
    toast.success('New text box added!');
  };

  const removeTextBox = (textId) => {
    setTextElements(prev => prev.filter(el => el.id !== textId));
    if (selectedElement === textId) {
      setSelectedElement(null);
    }
    toast.success('Text box removed!');
  };

  const updateTextBox = (textId, updates) => {
    setTextElements(prev => 
      prev.map(el => el.id === textId ? { ...el, ...updates } : el)
    );
  };

  const duplicateTextBox = (textId) => {
    const textBox = textElements.find(el => el.id === textId);
    if (textBox) {
      const duplicatedTextBox = {
        ...textBox,
        id: `text_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        x: Math.min(90, textBox.x + 5),
        y: Math.min(90, textBox.y + 5),
        content: textBox.content + ' Copy',
        zIndex: textElements.length + 10
      };
      setTextElements(prev => [...prev, duplicatedTextBox]);
      setSelectedElement(duplicatedTextBox.id);
      toast.success('Text box duplicated!');
    }
  };

  // Advanced Layout Tools handlers
  const handleElementUpdate = (action, data) => {
    switch (action) {
      case 'position':
        // Check if it's a text element or design element
        if (data.type === 'textbox') {
          setTextElements(prev => 
            prev.map(el => el.id === data.id ? data : el)
          );
        } else {
          setDesignElements(prev => 
            prev.map(el => el.id === data.id ? data : el)
          );
        }
        break;
      case 'reorder':
        setDesignElements(data);
        break;
      case 'align':
        setDesignElements(data);
        break;
      default:
        break;
    }
  };

  // Text position update for textboxes
  const updateTextBoxPosition = (textId, x, y) => {
    setTextElements(prev => 
      prev.map(el => el.id === textId ? { ...el, x, y } : el)
    );
  };

  // Helper functions
  const getCanvasSize = (platform) => {
    const sizes = {
      instagram: { width: 1080, height: 1080 },
      linkedin: { width: 1200, height: 627 },
      twitter: { width: 1200, height: 675 },
      facebook: { width: 1200, height: 630 }
    };
    return sizes[platform] || sizes.linkedin;
  };

  const getElementIcon = (element) => {
    switch (element.type) {
      case 'shape': return '⬛';
      case 'icon': return '⭐';
      case 'text': return '📝';
      case 'decorative': return '✨';
      default: return '📦';
    }
  };

  const getElementName = (element) => {
    switch (element.type) {
      case 'shape': return element.shape || 'Shape';
      case 'icon': return element.icon || 'Icon';
      case 'text': return 'Text Element';
      case 'decorative': return element.element || 'Decoration';
      default: return element.type || 'Element';
    }
  };

  const saveBanner = async () => {
    if (!editData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    setSaving(true);
    try {
      const saveData = {
        ...editData,
        designData: {
          ...editData.designData,
          designElements: designElements,
          textElements: textElements,
        },
      };
      await bannersAPI.update(id, saveData);
      toast.success('Banner updated successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to update banner');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '40px 20px' }}>
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!banner) {
    return (
      <div className="container" style={{ padding: '40px 20px' }}>
        <div className="error">Banner not found</div>
      </div>
    );
  }

  return (
    <div style={styles.editorContainer}>


      {/* Main Editor Layout */}
      <div style={styles.editorLayout}>
        {/* Left Sidebar */}
        <div style={styles.leftSidebar}>
          <div style={styles.sidebarSection}>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionIcon}>🎨</span>
              <span style={styles.sectionTitle}>Design</span>
            </div>
            
            {/* Quick Properties */}
            <div style={styles.quickProperties}>
              <div style={styles.propertyGroup}>
                <label style={styles.propertyLabel}>Title</label>
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => updateTitle(e.target.value)}
                  style={styles.propertyInput}
                  placeholder="Banner title"
                />
              </div>

              <div style={styles.propertyGroup}>
                <label style={styles.propertyLabel}>Main Text</label>
                <textarea
                  value={editData.designData?.mainText || ''}
                  onChange={(e) => updateMainText(e.target.value)}
                  style={styles.propertyTextarea}
                  placeholder="Banner text"
                  rows="3"
                />
              </div>

              <div style={styles.propertyGroup}>
                <label style={styles.propertyLabel}>Colors</label>
                <div style={styles.colorPalette}>
                  {editData.designData?.colors?.map((color, index) => (
                    <input
                      key={index}
                      type="color"
                      value={color}
                      onChange={(e) => updateColors(index, e.target.value)}
                      style={styles.colorSwatch}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Collapsible Tool Panels */}
          <div style={styles.toolPanels}>
            <ToolPanel title="🖼️ Background" defaultOpen={true}>
              <div style={styles.backgroundControls}>
                {editData.designData?.backgroundImage ? (
                  <div style={styles.currentBg}>
                    <img 
                      src={editData.designData.backgroundImage.thumb} 
                      alt="Background"
                      style={styles.bgThumb}
                    />
                    <div style={styles.bgInfo}>
                      <div style={styles.bgTitle}>
                        {editData.designData.backgroundImage.description}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={styles.noBg}>
                    <span>🎨</span>
                    <span>Solid color</span>
                  </div>
                )}
                <div style={styles.bgActions}>
                  <button
                    onClick={() => setShowImageSelector(true)}
                    style={styles.toolButton}
                  >
                    Change Image
                  </button>
                  {editData.designData?.backgroundImage && (
                    <button
                      onClick={() => updateBackgroundImage(null)}
                      style={styles.toolButtonSecondary}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </ToolPanel>

            <ToolPanel title="🔤 Advanced Text" defaultOpen={false}>
              <AdvancedTextEditor 
                onTextChange={updateText}
                textData={{
                  content: editData.designData?.mainText || '',
                  fontSize: editData.designData?.textStyle?.fontSize || 24,
                  fontFamily: editData.designData?.textStyle?.fontFamily || 'Inter',
                  fontWeight: editData.designData?.textStyle?.fontWeight || 'normal',
                  color: editData.designData?.textStyle?.color || '#000000',
                  shadow: editData.designData?.textStyle?.shadow || false,
                  outline: editData.designData?.textStyle?.outline || false,
                  gradient: editData.designData?.textStyle?.gradient || false
                }}
              />
            </ToolPanel>

            <ToolPanel title="📝 Text Boxes" defaultOpen={false}>
              <div style={styles.textBoxControls}>
                <button
                  onClick={addTextBox}
                  style={styles.addButton}
                >
                  ➕ Add Text Box
                </button>
                
                {textElements.length > 0 && (
                  <div style={styles.textBoxList}>
                    <h5 style={styles.listTitle}>Text Boxes ({textElements.length})</h5>
                    {textElements.map((textEl, index) => (
                      <div
                        key={textEl.id}
                        style={{
                          ...styles.textBoxItem,
                          ...(selectedElement === textEl.id ? styles.selectedTextBoxItem : {})
                        }}
                        onClick={() => setSelectedElement(textEl.id)}
                      >
                        <div style={styles.textBoxInfo}>
                          <span style={styles.textBoxIcon}>📝</span>
                          <div style={styles.textBoxDetails}>
                            <span style={styles.textBoxName}>
                              {textEl.content.substring(0, 15)}{textEl.content.length > 15 ? '...' : ''}
                            </span>
                            <span style={styles.textBoxPosition}>
                              {Math.round(textEl.x)}%, {Math.round(textEl.y)}%
                            </span>
                          </div>
                        </div>
                        <div style={styles.textBoxActions}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              duplicateTextBox(textEl.id);
                            }}
                            style={styles.actionBtn}
                            title="Duplicate"
                          >
                            📋
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeTextBox(textEl.id);
                            }}
                            style={styles.deleteBtn}
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ToolPanel>

            <ToolPanel title="⭐ Design Elements" defaultOpen={false}>
              <DesignElementsLibrary onElementAdd={addDesignElement} />
            </ToolPanel>
          </div>
        </div>

        {/* Center Canvas Area */}
        <div style={styles.centerArea}>
          <AdvancedLayoutTools
            designElements={designElements}
            textElements={textElements}
            bannerData={editData.designData}
            onElementUpdate={handleElementUpdate}
            onTextPositionUpdate={updateTextPosition}
            onTextBoxPositionUpdate={updateTextBoxPosition}
            onElementSelect={setSelectedElement}
            selectedElement={selectedElement}
            canvasSize={getCanvasSize(banner.platform)}
          />
        </div>

        {/* Right Properties Panel */}
        <div style={styles.rightSidebar}>
          <div style={styles.panelHeader}>
            <h3 style={styles.panelTitle}>Properties</h3>
          </div>
          
          <div style={styles.rightPanelContent}>
          {selectedElement ? (
            selectedElement === 'text' ? (
              <div style={styles.properties}>
                <div style={styles.propertySection}>
                  <h4 style={styles.propertySectionTitle}>Text Position</h4>
                  
                  {/* Position Grid */}
                  <div style={styles.positionGrid}>
                    <button onClick={() => updateTextPosition(25, 25)} style={styles.positionButton} title="Top Left">↖️</button>
                    <button onClick={() => updateTextPosition(50, 25)} style={styles.positionButton} title="Top Center">⬆️</button>
                    <button onClick={() => updateTextPosition(75, 25)} style={styles.positionButton} title="Top Right">↗️</button>
                    <button onClick={() => updateTextPosition(25, 50)} style={styles.positionButton} title="Middle Left">⬅️</button>
                    <button onClick={() => updateTextPosition(50, 50)} style={styles.positionButton} title="Center">🎯</button>
                    <button onClick={() => updateTextPosition(75, 50)} style={styles.positionButton} title="Middle Right">➡️</button>
                    <button onClick={() => updateTextPosition(25, 75)} style={styles.positionButton} title="Bottom Left">↙️</button>
                    <button onClick={() => updateTextPosition(50, 75)} style={styles.positionButton} title="Bottom Center">⬇️</button>
                    <button onClick={() => updateTextPosition(75, 75)} style={styles.positionButton} title="Bottom Right">↘️</button>
                  </div>
                  
                  {/* Precise Controls */}
                  <div style={styles.propertyRow}>
                    <div style={styles.propertyField}>
                      <label style={styles.propertyLabel}>X Position</label>
                      <div style={styles.inputGroup}>
                        <button 
                          onClick={() => updateTextPosition(Math.max(2, (editData.designData?.textStyle?.x || 50) - 1), editData.designData?.textStyle?.y || 50)}
                          style={styles.incrementButton}
                        >-</button>
                        <input
                          type="number"
                          min="2"
                          max="98"
                          value={Math.round(editData.designData?.textStyle?.x || 50)}
                          onChange={(e) => updateTextPosition(parseInt(e.target.value), editData.designData?.textStyle?.y || 50)}
                          style={styles.numberInput}
                        />
                        <button 
                          onClick={() => updateTextPosition(Math.min(98, (editData.designData?.textStyle?.x || 50) + 1), editData.designData?.textStyle?.y || 50)}
                          style={styles.incrementButton}
                        >+</button>
                      </div>
                      <span style={styles.propertyUnit}>%</span>
                    </div>
                    <div style={styles.propertyField}>
                      <label style={styles.propertyLabel}>Y Position</label>
                      <div style={styles.inputGroup}>
                        <button 
                          onClick={() => updateTextPosition(editData.designData?.textStyle?.x || 50, Math.max(2, (editData.designData?.textStyle?.y || 50) - 1))}
                          style={styles.incrementButton}
                        >-</button>
                        <input
                          type="number"
                          min="2"
                          max="98"
                          value={Math.round(editData.designData?.textStyle?.y || 50)}
                          onChange={(e) => updateTextPosition(editData.designData?.textStyle?.x || 50, parseInt(e.target.value))}
                          style={styles.numberInput}
                        />
                        <button 
                          onClick={() => updateTextPosition(editData.designData?.textStyle?.x || 50, Math.min(98, (editData.designData?.textStyle?.y || 50) + 1))}
                          style={styles.incrementButton}
                        >+</button>
                      </div>
                      <span style={styles.propertyUnit}>%</span>
                    </div>
                  </div>
                  
                  {/* Keyboard Shortcuts Help */}
                  <div style={styles.helpText}>
                    💡 Use arrow keys to move text (Shift for larger steps)
                  </div>
                </div>
              </div>
            ) : selectedElement && textElements.find(el => el.id === selectedElement) ? (
              <TextBoxProperties 
                textBox={textElements.find(el => el.id === selectedElement)}
                onUpdate={(updates) => updateTextBox(selectedElement, updates)}
              />
            ) : (
              <ElementProperties 
                element={designElements.find(el => el.id === selectedElement)}
                onUpdate={(updates) => updateDesignElement(selectedElement, updates)}
              />
            )
          ) : (
            <div style={styles.noSelection}>
              <div style={styles.noSelectionIcon}>👆</div>
              <div style={styles.noSelectionText}>
                Select an element to edit its properties
              </div>
            </div>
          )}

          {/* Added Elements List */}
          {designElements.length > 0 && (
            <div style={styles.elementsList}>
              <div style={styles.elementsHeader}>
                Elements ({designElements.length})
              </div>
              {designElements.map((element) => (
                <div 
                  key={element.id} 
                  style={{
                    ...styles.elementItem,
                    ...(selectedElement === element.id ? styles.selectedElementItem : {})
                  }}
                  onClick={() => setSelectedElement(element.id)}
                >
                  <span style={styles.elementIcon}>
                    {getElementIcon(element)}
                  </span>
                  <span style={styles.elementName}>
                    {getElementName(element)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeDesignElement(element.id);
                    }}
                    style={styles.removeBtn}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>

      {/* Spacer to allow page-level scrolling */}
      <BottomSpacer />

      {/* Background Image Selector Modal */}
      {showImageSelector && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Choose Background Image</h3>
              <button
                onClick={() => setShowImageSelector(false)}
                style={styles.closeButton}
              >
                ×
              </button>
            </div>
            <div style={styles.modalBody}>
              <BackgroundImageSelector 
                onImageSelect={updateBackgroundImage}
                onClose={() => setShowImageSelector(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Spacer to allow additional bottom scrolling when editing long content
const BottomSpacer = () => (
  <div style={{ height: 220 }} />
);

const styles = {
  // Redesigned editor styles — modern, clean and visually appealing
  editorContainer: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #f6f9ff 0%, #fbfbff 100%)',
    color: '#0f172a',
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    overflow: 'auto',
  },
  topHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 20px',
    background: 'rgba(255,255,255,0.9)',
    borderBottom: '1px solid rgba(15,23,42,0.06)',
    backdropFilter: 'blur(6px)',
    zIndex: 20,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
  },
  backButton: {
    padding: '8px 14px',
    background: '#eef2ff',
    border: '1px solid #e0e7ff',
    borderRadius: '10px',
    color: '#3730a3',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
  },
  titleSection: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#0f172a',
    margin: 0,
  },
  subtitle: {
    fontSize: '12px',
    color: '#475569',
    margin: 0,
  },
  headerRight: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  actionButton: {
    padding: '8px 14px',
    background: '#0f172a',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
    boxShadow: '0 6px 18px rgba(15,23,42,0.08)',
  },
  editorLayout: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    overflow: 'hidden',
    gap: '16px',
    padding: '18px',
  },
  leftSidebar: {
    width: '380px',
    background: 'linear-gradient(180deg,#ffffff,#fbfdff)',
    borderRadius: '12px',
    boxShadow: '0 8px 30px rgba(2,6,23,0.04)',
    display: 'flex',
    flexDirection: 'column',
    /* allow the left column to shrink inside the flex container and
       have its own scroll when content overflows */
    minHeight: '1000px',
    maxHeight: 'calc(100vh - 120px)',
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: '12px',
    height:'800px',
    marginTop:'35px',
  },
  sidebarSection: {
    padding: '10px 8px',
    borderBottom: '1px solid rgba(15,23,42,0.04)',
  },
  sectionHeader: {
    display: 'flex',
    height: '50px',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '12px',
  },
  sectionIcon: {
    fontSize: '18px',
  },
  sectionTitle: {
    fontSize: '15px',
    fontWeight: 700,
    color: '#0f172a',
  },
  quickProperties: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  propertyGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  propertyLabel: {
    fontSize: '13px',
    color: '#334155',
    fontWeight: 600,
  },
  propertyInput: {
    padding: '8px 10px',
    borderRadius: '8px',
    border: '1px solid rgba(15,23,42,0.06)',
    background: '#fff',
    outline: 'none',
  },
  propertyTextarea: {
    padding: '8px 10px',
    borderRadius: '8px',
    border: '1px solid rgba(15,23,42,0.06)',
    resize: 'vertical',
    background: '#fff',
  },
  colorPalette: {
    display: 'flex',
    gap: '8px',
  },
  colorSwatch: {
    width: '34px',
    height: '34px',
    borderRadius: '6px',
    border: '1px solid rgba(15,23,42,0.06)',
  },
  toolPanels: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '8px',
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
  },
  toolPanel: {
    background: '#fff',
    borderRadius: '10px',
    border: '1px solid rgba(2,6,23,0.04)',
    overflow: 'hidden',
    boxShadow: '0 6px 18px rgba(2,6,23,0.03)',
  },
  panelToggle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 14px',
    cursor: 'pointer',
  },
  panelIcon: {
    fontSize: '12px',
  },
  panelTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#0f172a',
  },
  panelContent: {
    padding: '0 12px',
    maxHeight: 0,
    overflow: 'hidden',
    transition: 'max-height 0.25s ease, padding 0.25s ease',
  },
  panelContentOpen: {
    padding: '12px',
    maxHeight: '500px',
    overflow: 'auto',
    transition: 'max-height 0.25s ease, padding 0.25s ease',
  },
  backgroundControls: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  currentBg: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px',
    background: '#f8fafc',
    borderRadius: '8px',
  },
  bgThumb: {
    width: '40px',
    height: '30px',
    objectFit: 'cover',
    borderRadius: '6px',
  },
  bgInfo: {
    flex: 1,
  },
  bgTitle: {
    fontSize: '12px',
    color: '#334155',
    fontWeight: 500,
  },
  noBg: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px',
    background: '#f8fafc',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#475569',
  },
  bgActions: {
    display: 'flex',
    gap: '8px',
  },
  toolButton: {
    padding: '6px 12px',
    background: '#4338ca',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 500,
  },
  toolButtonSecondary: {
    padding: '6px 12px',
    background: '#eef2ff',
    color: '#4338ca',
    border: '1px solid #e0e7ff',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 500,
  },
  centerArea: {
    flex: 1,
    background: 'rgba(2,6,23,0.02)',
    borderRadius: '12px',
    boxShadow: 'inset 0 0 10px rgba(2,6,23,0.04)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0px',
    width: '60%',
    marginTop:'-460px',
  },
  rightSidebar: {
    width: '320px',
    background: 'linear-gradient(180deg,#ffffff,#fbfdff)',
    borderRadius: '12px',
    boxShadow: '0 8px 30px rgba(2,6,23,0.04)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    padding: '12px',
  },
  rightPanelContent: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'auto',
    padding: '8px',
  },
  panelHeader: {
    padding: '10px 8px',
    borderBottom: '1px solid rgba(15,23,42,0.04)',
  },
  panelTitleLarge: {
    fontSize: '15px',
    fontWeight: 700,
    color: '#0f172a',
    margin: 0,
  },
  noSelection: {
    padding: '40px 20px',
    textAlign: 'center',
    color: '#475569',
  },
  noSelectionIcon: {
    fontSize: '32px',
    marginBottom: '12px',
  },
  noSelectionText: {
    fontSize: '14px',
  },
  properties: {
    padding: '10px 8px',
    borderBottom: '1px solid rgba(15,23,42,0.04)',
  },
  propertySection: {
    marginBottom: '18px',
  },
  propertySectionTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#0f172a',
    marginBottom: '8px',
  },
  propertyRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
  },
  propertyField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  numberInput: {
    padding: '6px 8px',
    borderRadius: '6px',
    border: '1px solid rgba(15,23,42,0.06)',
    background: '#fff',
  },
  colorInput: {
    width: '100%',
    height: '32px',
    borderRadius: '6px',
    border: '1px solid rgba(15,23,42,0.06)',
  },
  rangeInput: {
    width: '100%',
  },
  rangeValue: {
    fontSize: '12px',
    color: '#475569',
    marginLeft: '8px',
  },
  elementsList: {
    flex: 1,
    padding: '10px 8px',
    overflowY: 'auto',
  },
  elementsHeader: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#0f172a',
    marginBottom: '12px',
  },
  elementItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '4px',
  },
  selectedElementItem: {
    background: '#eef2ff',
    border: '1px solid #4338ca',
  },
  elementIcon: {
    fontSize: '14px',
  },
  elementName: {
    flex: 1,
    fontSize: '12px',
    color: '#334155',
    fontWeight: 500,
  },
  removeBtn: {
    width: '20px',
    height: '20px',
    borderRadius: '4px',
    background: '#fee2e2',
    color: '#ef4444',
    border: 'none',
    cursor: 'pointer',
  },
  propertyUnit: {
    fontSize: '12px',
    color: '#475569',
    marginLeft: '4px',
  },
  quickActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '12px',
  },
  positionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '4px',
    marginBottom: '16px',
    padding: '8px',
    background: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid rgba(15,23,42,0.06)',
  },
  positionButton: {
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    background: '#fff',
    border: '1px solid rgba(15,23,42,0.06)',
    cursor: 'pointer',
  },
  inputGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
  },
  incrementButton: {
    width: '24px',
    height: '24px',
    borderRadius: '4px',
    background: '#eef2ff',
    border: '1px solid #e0e7ff',
    cursor: 'pointer',
  },
  helpText: {
    fontSize: '11px',
    color: '#475569',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: '8px',
    padding: '6px',
    background: '#f0f9ff',
    borderRadius: '6px',
    border: '1px solid #bae6fd',
  },
  modal: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15, 23, 42, 0.6)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modalContent: {
    background: '#fff',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '900px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 50px rgba(2,6,23,0.2)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid rgba(15,23,42,0.06)',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#0f172a',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#475569',
  },
  modalBody: {
    padding: '24px',
  },
  textBoxControls: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  addButton: {
    padding: '12px 16px',
    borderRadius: '8px',
    background: '#4338ca',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
  },
  textBoxList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  listTitle: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#475569',
    marginBottom: '8px',
    margin: 0,
  },
  textBoxItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    border: '1px solid transparent',
    background: '#f8fafc',
  },
  selectedTextBoxItem: {
    background: '#eef2ff',
    border: '1px solid #4338ca',
  },
  textBoxInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flex: 1,
  },
  textBoxIcon: {
    fontSize: '14px',
  },
  textBoxDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  textBoxName: {
    fontSize: '12px',
    fontWeight: 500,
    color: '#334155',
  },
  textBoxPosition: {
    fontSize: '10px',
    color: '#475569',
  },
  textBoxActions: {
    display: 'flex',
    gap: '4px',
  },
  actionBtn: {
    width: '24px',
    height: '24px',
    borderRadius: '4px',
    background: '#eef2ff',
    border: '1px solid #e0e7ff',
    cursor: 'pointer',
  },
  deleteBtn: {
    width: '24px',
    height: '24px',
    borderRadius: '4px',
    background: '#fee2e2',
    color: '#ef4444',
    border: 'none',
    cursor: 'pointer',
  },
  textArea: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid rgba(15,23,42,0.06)',
    background: '#fff',
    resize: 'vertical',
    minHeight: '60px',
  },
  selectInput: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid rgba(15,23,42,0.06)',
    background: '#fff',
    cursor: 'pointer',
  },
  checkbox: {
    marginRight: '8px',
    transform: 'scale(1.2)',
  },
};export default EditBanner;