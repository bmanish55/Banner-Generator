import React, { useState, useRef, useCallback, useEffect } from 'react';

const AdvancedLayoutTools = ({ 
  designElements, 
  textElements = [],
  bannerData = {},
  onElementUpdate, 
  onTextPositionUpdate,
  onTextBoxPositionUpdate,
  onElementSelect, 
  selectedElement,
  canvasSize = { width: 1200, height: 627 }
}) => {
  const [showGrid, setShowGrid] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSize, setGridSize] = useState(20);
  const [draggedElement, setDraggedElement] = useState(null);
  const [textSelected, setTextSelected] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showPositionGuides, setShowPositionGuides] = useState(true);
  const canvasRef = useRef(null);

  // Keyboard shortcuts for text positioning
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedElement !== 'text') return;
      
      const currentX = bannerData.textStyle?.x || 50;
      const currentY = bannerData.textStyle?.y || 50;
      const step = e.shiftKey ? 10 : 1; // Larger steps with Shift
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          onTextPositionUpdate(Math.max(2, currentX - step), currentY);
          break;
        case 'ArrowRight':
          e.preventDefault();
          onTextPositionUpdate(Math.min(98, currentX + step), currentY);
          break;
        case 'ArrowUp':
          e.preventDefault();
          onTextPositionUpdate(currentX, Math.max(2, currentY - step));
          break;
        case 'ArrowDown':
          e.preventDefault();
          onTextPositionUpdate(currentX, Math.min(98, currentY + step));
          break;
        case 'Home':
          e.preventDefault();
          onTextPositionUpdate(50, 50); // Center
          break;
        case 'Escape':
          e.preventDefault();
          onElementSelect(null); // Deselect
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement, bannerData.textStyle, onTextPositionUpdate, onElementSelect]);

  // Layer management
  const moveLayer = (elementId, direction) => {
    const element = designElements.find(el => el.id === elementId);
    if (!element) return;

    const currentIndex = designElements.indexOf(element);
    let newIndex = currentIndex;

    if (direction === 'up' && currentIndex < designElements.length - 1) {
      newIndex = currentIndex + 1;
    } else if (direction === 'down' && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else if (direction === 'top') {
      newIndex = designElements.length - 1;
    } else if (direction === 'bottom') {
      newIndex = 0;
    }

    if (newIndex !== currentIndex) {
      const newElements = [...designElements];
      const [movedElement] = newElements.splice(currentIndex, 1);
      newElements.splice(newIndex, 0, movedElement);
      onElementUpdate('reorder', newElements);
    }
  };

  // Alignment functions
  const alignElements = (alignment) => {
    if (!selectedElement || designElements.length < 2) return;

    const selected = designElements.find(el => el.id === selectedElement);
    if (!selected) return;

    const otherElements = designElements.filter(el => el.id !== selectedElement);
    
    const updatedElements = otherElements.map(element => {
      let newPosition = { ...element };

      switch (alignment) {
        case 'left':
          newPosition.x = selected.x;
          break;
        case 'right':
          newPosition.x = selected.x + (selected.width || 100) - (element.width || 100);
          break;
        case 'top':
          newPosition.y = selected.y;
          break;
        case 'bottom':
          newPosition.y = selected.y + (selected.height || 100) - (element.height || 100);
          break;
        case 'center-horizontal':
          newPosition.x = selected.x + ((selected.width || 100) - (element.width || 100)) / 2;
          break;
        case 'center-vertical':
          newPosition.y = selected.y + ((selected.height || 100) - (element.height || 100)) / 2;
          break;
        case 'distribute-horizontal':
          // Simple distribution logic
          const spacing = (canvasSize.width - (element.width || 100)) / (otherElements.length + 1);
          newPosition.x = spacing * (otherElements.indexOf(element) + 1);
          break;
        case 'distribute-vertical':
          const vSpacing = (canvasSize.height - (element.height || 100)) / (otherElements.length + 1);
          newPosition.y = vSpacing * (otherElements.indexOf(element) + 1);
          break;
      }

      return newPosition;
    });

    onElementUpdate('align', [selected, ...updatedElements]);
  };

  // Snap to grid
  const snapToGridPosition = useCallback((x, y) => {
    if (!snapToGrid) return { x, y };
    return {
      x: Math.round(x / gridSize) * gridSize,
      y: Math.round(y / gridSize) * gridSize
    };
  }, [snapToGrid, gridSize]);

  // Drag handlers
  const handleMouseDown = useCallback((e, element) => {
    e.preventDefault();
    setDraggedElement(element);
    onElementSelect(element.id);
    
    const startX = e.clientX - element.x;
    const startY = e.clientY - element.y;

    const handleMouseMove = (e) => {
      const newPos = snapToGridPosition(
        e.clientX - startX,
        e.clientY - startY
      );
      
      onElementUpdate('position', {
        ...element,
        x: Math.max(0, Math.min(newPos.x, canvasSize.width - (element.width || 100))),
        y: Math.max(0, Math.min(newPos.y, canvasSize.height - (element.height || 100)))
      });
    };

    const handleMouseUp = () => {
      setDraggedElement(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [canvasSize, gridSize, snapToGrid, onElementUpdate, onElementSelect]);

  // Enhanced text drag handler with better precision and visual feedback
  const handleTextMouseDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setTextSelected(true);
    setIsDragging(true);
    onElementSelect('text'); // Use 'text' as a special ID
    
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;
    
    // Calculate initial positions relative to the scaled canvas
    const scale = 0.6; // Canvas scale factor
    
    // Calculate mouse offset from text center
    const textRect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - (textRect.left + textRect.width / 2);
    const offsetY = e.clientY - (textRect.top + textRect.height / 2);

    const handleMouseMove = (e) => {
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (!canvasRect) return;
      
      // Calculate mouse position relative to canvas
      const relativeX = (e.clientX - canvasRect.left - offsetX) / scale;
      const relativeY = (e.clientY - canvasRect.top - offsetY) / scale;
      
      // Convert to percentage with improved bounds checking
      const xPercent = Math.max(2, Math.min(98, (relativeX / canvasSize.width) * 100));
      const yPercent = Math.max(2, Math.min(98, (relativeY / canvasSize.height) * 100));
      
      // Apply snap to grid if enabled
      const snappedPos = snapToGridPosition(
        (xPercent / 100) * canvasSize.width,
        (yPercent / 100) * canvasSize.height
      );
      
      const finalXPercent = (snappedPos.x / canvasSize.width) * 100;
      const finalYPercent = (snappedPos.y / canvasSize.height) * 100;
      
      onTextPositionUpdate(finalXPercent, finalYPercent);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };

    // Set cursor and prevent text selection during drag
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [bannerData.textStyle, canvasSize, onTextPositionUpdate, onElementSelect, snapToGridPosition]);

  // Text Box drag handler
  const handleTextBoxMouseDown = useCallback((e, textBox) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    onElementSelect(textBox.id);
    
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;
    
    // Calculate initial positions relative to the scaled canvas
    const scale = 0.6; // Canvas scale factor
    
    // Calculate mouse offset from text center
    const textRect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - (textRect.left + textRect.width / 2);
    const offsetY = e.clientY - (textRect.top + textRect.height / 2);

    const handleMouseMove = (e) => {
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (!canvasRect) return;
      
      // Calculate mouse position relative to canvas
      const relativeX = (e.clientX - canvasRect.left - offsetX) / scale;
      const relativeY = (e.clientY - canvasRect.top - offsetY) / scale;
      
      // Convert to percentage with improved bounds checking
      const xPercent = Math.max(2, Math.min(98, (relativeX / canvasSize.width) * 100));
      const yPercent = Math.max(2, Math.min(98, (relativeY / canvasSize.height) * 100));
      
      // Apply snap to grid if enabled
      const snappedPos = snapToGridPosition(
        (xPercent / 100) * canvasSize.width,
        (yPercent / 100) * canvasSize.height
      );
      
      const finalXPercent = (snappedPos.x / canvasSize.width) * 100;
      const finalYPercent = (snappedPos.y / canvasSize.height) * 100;
      
      onTextBoxPositionUpdate(textBox.id, finalXPercent, finalYPercent);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };

    // Set cursor and prevent text selection during drag
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [canvasSize, onTextBoxPositionUpdate, onElementSelect, snapToGridPosition]);

  return (
    <div style={styles.container}>
      {/* Top Toolbar */}
      <div style={styles.toolbar}>
        <div style={styles.toolGroup}>
          <button
            onClick={() => setShowGrid(!showGrid)}
            style={{
              ...styles.toolButton,
              ...(showGrid ? styles.activeButton : {})
            }}
            title="Toggle Grid"
          >
            ⊞ Grid
          </button>
          <button
            onClick={() => setSnapToGrid(!snapToGrid)}
            style={{
              ...styles.toolButton,
              ...(snapToGrid ? styles.activeButton : {})
            }}
            title="Snap to Grid"
          >
            🧲 Snap
          </button>
        </div>

        <div style={styles.toolGroup}>
          <button
            onClick={() => setShowPositionGuides(!showPositionGuides)}
            style={{
              ...styles.toolButton,
              ...(showPositionGuides ? styles.activeButton : {})
            }}
            title="Show Position Guides"
          >
            📐 Guides
          </button>
        </div>

        <div style={styles.toolGroup}>
          <span style={styles.toolLabel}>Grid Size:</span>
          <input
            type="range"
            min="10"
            max="50"
            value={gridSize}
            onChange={(e) => setGridSize(parseInt(e.target.value))}
            style={styles.slider}
          />
          <span style={styles.toolValue}>{gridSize}px</span>
        </div>

        <div style={styles.toolGroup}>
          <button
            onClick={() => alignElements('left')}
            style={styles.toolButton}
            disabled={!selectedElement}
            title="Align Left"
          >
            ⫷
          </button>
          <button
            onClick={() => alignElements('center-horizontal')}
            style={styles.toolButton}
            disabled={!selectedElement}
            title="Center Horizontally"
          >
            ⫼
          </button>
          <button
            onClick={() => alignElements('right')}
            style={styles.toolButton}
            disabled={!selectedElement}
            title="Align Right"
          >
            ⫸
          </button>
          <button
            onClick={() => alignElements('top')}
            style={styles.toolButton}
            disabled={!selectedElement}
            title="Align Top"
          >
            ⫷
          </button>
          <button
            onClick={() => alignElements('center-vertical')}
            style={styles.toolButton}
            disabled={!selectedElement}
            title="Center Vertically"
          >
            ⫾
          </button>
          <button
            onClick={() => alignElements('bottom')}
            style={styles.toolButton}
            disabled={!selectedElement}
            title="Align Bottom"
          >
            ⫸
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div style={styles.canvasContainer}>
        <div
          ref={canvasRef}
          style={{
            ...styles.canvas,
            width: canvasSize.width,
            height: canvasSize.height,
            backgroundImage: showGrid ? 
              `radial-gradient(circle, #ccc 1px, transparent 1px)` : 'none',
            backgroundSize: showGrid ? `${gridSize}px ${gridSize}px` : 'auto'
          }}
        >
          {/* Position Guides */}
          {showPositionGuides && (selectedElement === 'text' || isDragging) && (
            <>
              {/* Center Guidelines */}
              <div style={{
                position: 'absolute',
                left: '50%',
                top: '0',
                width: '1px',
                height: '100%',
                backgroundColor: '#3b82f6',
                opacity: 0.6,
                transform: 'translateX(-50%)',
                zIndex: 1,
                pointerEvents: 'none'
              }} />
              <div style={{
                position: 'absolute',
                left: '0',
                top: '50%',
                width: '100%',
                height: '1px',
                backgroundColor: '#3b82f6',
                opacity: 0.6,
                transform: 'translateY(-50%)',
                zIndex: 1,
                pointerEvents: 'none'
              }} />
              
              {/* Third Guidelines */}
              <div style={{
                position: 'absolute',
                left: '33.33%',
                top: '0',
                width: '1px',
                height: '100%',
                backgroundColor: '#10b981',
                opacity: 0.4,
                transform: 'translateX(-50%)',
                zIndex: 1,
                pointerEvents: 'none'
              }} />
              <div style={{
                position: 'absolute',
                left: '66.66%',
                top: '0',
                width: '1px',
                height: '100%',
                backgroundColor: '#10b981',
                opacity: 0.4,
                transform: 'translateX(-50%)',
                zIndex: 1,
                pointerEvents: 'none'
              }} />
              <div style={{
                position: 'absolute',
                left: '0',
                top: '33.33%',
                width: '100%',
                height: '1px',
                backgroundColor: '#10b981',
                opacity: 0.4,
                transform: 'translateY(-50%)',
                zIndex: 1,
                pointerEvents: 'none'
              }} />
              <div style={{
                position: 'absolute',
                left: '0',
                top: '66.66%',
                width: '100%',
                height: '1px',
                backgroundColor: '#10b981',
                opacity: 0.4,
                transform: 'translateY(-50%)',
                zIndex: 1,
                pointerEvents: 'none'
              }} />
            </>
          )}

          {/* Banner Background */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: bannerData.backgroundImage ? 
              `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${bannerData.backgroundImage.url})` :
              `linear-gradient(135deg, ${bannerData.colors?.[0] || '#667eea'}, ${bannerData.colors?.[1] || '#764ba2'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            zIndex: 0
          }} />

          {/* Banner Text with Enhanced Drag Interaction */}
          {bannerData.mainText && (
            <div 
              style={{
                position: 'absolute',
                left: `${bannerData.textStyle?.x || 50}%`,
                top: `${bannerData.textStyle?.y || 50}%`,
                transform: 'translate(-50%, -50%)',
                color: bannerData.textStyle?.color || '#ffffff',
                fontSize: `${bannerData.textStyle?.fontSize || Math.min(canvasSize.width, canvasSize.height) * 0.06}px`,
                fontFamily: `'${bannerData.textStyle?.fontFamily || 'Inter'}', sans-serif`,
                fontWeight: bannerData.textStyle?.fontWeight || 'bold',
                textAlign: 'center',
                textShadow: bannerData.textStyle?.shadow ? '3px 3px 6px rgba(0,0,0,0.8)' : '2px 2px 4px rgba(0,0,0,0.5)',
                WebkitTextStroke: bannerData.textStyle?.outline ? '2px rgba(0,0,0,0.8)' : 'none',
                background: bannerData.textStyle?.gradient ? 'linear-gradient(45deg, #667eea, #764ba2)' : 'transparent',
                WebkitBackgroundClip: bannerData.textStyle?.gradient ? 'text' : 'initial',
                WebkitTextFillColor: bannerData.textStyle?.gradient ? 'transparent' : 'inherit',
                backgroundClip: bannerData.textStyle?.gradient ? 'text' : 'initial',
                maxWidth: '90%',
                wordWrap: 'break-word',
                lineHeight: '1.2',
                zIndex: 50,
                cursor: isDragging ? 'grabbing' : (selectedElement === 'text' ? 'grab' : 'pointer'),
                userSelect: 'none',
                letterSpacing: '0.5px',
                border: selectedElement === 'text' ? '2px solid #3b82f6' : '2px solid transparent',
                borderRadius: '8px',
                padding: '8px 12px',
                transition: selectedElement === 'text' ? 'none' : 'all 0.2s ease',
                boxShadow: selectedElement === 'text' ? 
                  '0 0 0 3px rgba(59, 130, 246, 0.1), 0 4px 12px rgba(0, 0, 0, 0.15)' : 
                  'none',
                backdropFilter: selectedElement === 'text' ? 'blur(2px)' : 'none',
                WebkitBackdropFilter: selectedElement === 'text' ? 'blur(2px)' : 'none'
              }}
              onMouseDown={handleTextMouseDown}
              onMouseEnter={(e) => {
                if (selectedElement !== 'text') {
                  e.target.style.transform = 'translate(-50%, -50%) scale(1.02)';
                  e.target.style.filter = 'brightness(1.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedElement !== 'text') {
                  e.target.style.transform = 'translate(-50%, -50%) scale(1)';
                  e.target.style.filter = 'brightness(1)';
                }
              }}
              onClick={(e) => {
                e.stopPropagation();
                setTextSelected(true);
                onElementSelect('text');
              }}
            >
              {bannerData.mainText}
              
              {/* Text Position Indicator */}
              {selectedElement === 'text' && (
                <div style={{
                  position: 'absolute',
                  top: '-25px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: 'normal',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  zIndex: 100
                }}>
                  {Math.round(bannerData.textStyle?.x || 50)}%, {Math.round(bannerData.textStyle?.y || 50)}%
                </div>
              )}
              
              {/* Corner Handles for Text Selection */}
              {selectedElement === 'text' && (
                <>
                  <div style={{
                    position: 'absolute',
                    top: '-6px',
                    left: '-6px',
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#3b82f6',
                    border: '2px solid white',
                    borderRadius: '50%',
                    cursor: 'move',
                    pointerEvents: 'none'
                  }} />
                  <div style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#3b82f6',
                    border: '2px solid white',
                    borderRadius: '50%',
                    cursor: 'move',
                    pointerEvents: 'none'
                  }} />
                  <div style={{
                    position: 'absolute',
                    bottom: '-6px',
                    left: '-6px',
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#3b82f6',
                    border: '2px solid white',
                    borderRadius: '50%',
                    cursor: 'move',
                    pointerEvents: 'none'
                  }} />
                  <div style={{
                    position: 'absolute',
                    bottom: '-6px',
                    right: '-6px',
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#3b82f6',
                    border: '2px solid white',
                    borderRadius: '50%',
                    cursor: 'move',
                    pointerEvents: 'none'
                  }} />
                </>
              )}
            </div>
          )}

          {/* Design Elements */}
          {designElements.map((element, index) => (
            <div
              key={element.id}
              style={{
                ...styles.canvasElement,
                left: element.x || 0,
                top: element.y || 0,
                width: element.width || 100,
                height: element.height || 100,
                zIndex: index + 10,
                border: selectedElement === element.id ? '2px solid #3b82f6' : '1px solid transparent',
                cursor: 'move'
              }}
              onMouseDown={(e) => handleMouseDown(e, element)}
            >
              {renderElement(element)}
              
              {/* Resize handles */}
              {selectedElement === element.id && (
                <>
                  <div style={{...styles.resizeHandle, top: -4, left: -4}} />
                  <div style={{...styles.resizeHandle, top: -4, right: -4}} />
                  <div style={{...styles.resizeHandle, bottom: -4, left: -4}} />
                  <div style={{...styles.resizeHandle, bottom: -4, right: -4}} />
                </>
              )}
            </div>
          ))}
          
          {/* Text Boxes */}
          {textElements.map((textBox, index) => (
            <div
              key={textBox.id}
              style={{
                position: 'absolute',
                left: `${textBox.x}%`,
                top: `${textBox.y}%`,
                transform: 'translate(-50%, -50%)',
                color: textBox.color || '#ffffff',
                fontSize: `${textBox.fontSize}px`,
                fontFamily: `'${textBox.fontFamily}', sans-serif`,
                fontWeight: textBox.fontWeight || 'normal',
                textAlign: textBox.textAlign || 'center',
                textShadow: textBox.shadow ? '3px 3px 6px rgba(0,0,0,0.8)' : 'none',
                WebkitTextStroke: textBox.outline ? '1px rgba(0,0,0,0.8)' : 'none',
                background: textBox.gradient ? 'linear-gradient(45deg, #667eea, #764ba2)' : 'transparent',
                WebkitBackgroundClip: textBox.gradient ? 'text' : 'initial',
                WebkitTextFillColor: textBox.gradient ? 'transparent' : 'inherit',
                backgroundClip: textBox.gradient ? 'text' : 'initial',
                maxWidth: '90%',
                wordWrap: 'break-word',
                lineHeight: textBox.lineHeight || 1.2,
                letterSpacing: `${textBox.letterSpacing || 0}px`,
                opacity: textBox.opacity || 1,
                zIndex: textBox.zIndex || (index + 60),
                cursor: isDragging ? 'grabbing' : (selectedElement === textBox.id ? 'grab' : 'pointer'),
                userSelect: 'none',
                border: selectedElement === textBox.id ? '2px solid #3b82f6' : '2px solid transparent',
                borderRadius: '8px',
                padding: '8px 12px',
                transition: selectedElement === textBox.id ? 'none' : 'all 0.2s ease',
                boxShadow: selectedElement === textBox.id ? 
                  '0 0 0 3px rgba(59, 130, 246, 0.1), 0 4px 12px rgba(0, 0, 0, 0.15)' : 
                  'none',
                backdropFilter: selectedElement === textBox.id ? 'blur(2px)' : 'none',
                WebkitBackdropFilter: selectedElement === textBox.id ? 'blur(2px)' : 'none'
              }}
              onMouseDown={(e) => handleTextBoxMouseDown(e, textBox)}
              onMouseEnter={(e) => {
                if (selectedElement !== textBox.id) {
                  e.target.style.transform = 'translate(-50%, -50%) scale(1.02)';
                  e.target.style.filter = 'brightness(1.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedElement !== textBox.id) {
                  e.target.style.transform = 'translate(-50%, -50%) scale(1)';
                  e.target.style.filter = 'brightness(1)';
                }
              }}
              onClick={(e) => {
                e.stopPropagation();
                onElementSelect(textBox.id);
              }}
            >
              {textBox.content}
              
              {/* Text Position Indicator */}
              {selectedElement === textBox.id && (
                <div style={{
                  position: 'absolute',
                  top: '-25px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: 'normal',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  zIndex: 100
                }}>
                  {Math.round(textBox.x)}%, {Math.round(textBox.y)}%
                </div>
              )}
              
              {/* Corner Handles for Text Selection */}
              {selectedElement === textBox.id && (
                <>
                  <div style={{
                    position: 'absolute',
                    top: '-6px',
                    left: '-6px',
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#3b82f6',
                    border: '2px solid white',
                    borderRadius: '50%',
                    cursor: 'move',
                    pointerEvents: 'none'
                  }} />
                  <div style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#3b82f6',
                    border: '2px solid white',
                    borderRadius: '50%',
                    cursor: 'move',
                    pointerEvents: 'none'
                  }} />
                  <div style={{
                    position: 'absolute',
                    bottom: '-6px',
                    left: '-6px',
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#3b82f6',
                    border: '2px solid white',
                    borderRadius: '50%',
                    cursor: 'move',
                    pointerEvents: 'none'
                  }} />
                  <div style={{
                    position: 'absolute',
                    bottom: '-6px',
                    right: '-6px',
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#3b82f6',
                    border: '2px solid white',
                    borderRadius: '50%',
                    cursor: 'move',
                    pointerEvents: 'none'
                  }} />
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Layers Panel */}
      <div style={styles.layersPanel}>
        <div style={styles.panelHeader}>
          <h4 style={styles.panelTitle}>Layers ({(bannerData.mainText ? 1 : 0) + textElements.length + designElements.length})</h4>
        </div>
        
        <div style={styles.layersList}>
          {/* Text Layer */}
          {bannerData.mainText && (
            <div
              style={{
                ...styles.layerItem,
                ...(selectedElement === 'text' ? styles.selectedLayer : {})
              }}
              onClick={() => {
                setTextSelected(true);
                onElementSelect('text');
              }}
            >
              <div style={styles.layerInfo}>
                <span style={styles.layerIcon}>📝</span>
                <span style={styles.layerName}>Main Text</span>
              </div>
              <div style={styles.layerControls}>
                <span style={styles.positionInfo}>
                  {Math.round(bannerData.textStyle?.x || 50)}%, {Math.round(bannerData.textStyle?.y || 50)}%
                </span>
              </div>
            </div>
          )}
          
          {/* Text Boxes Layers */}
          {textElements.slice().reverse().map((textBox, reverseIndex) => {
            return (
              <div
                key={textBox.id}
                style={{
                  ...styles.layerItem,
                  ...(selectedElement === textBox.id ? styles.selectedLayer : {})
                }}
                onClick={() => onElementSelect(textBox.id)}
              >
                <div style={styles.layerInfo}>
                  <span style={styles.layerIcon}>📝</span>
                  <span style={styles.layerName}>
                    {textBox.content.substring(0, 12)}{textBox.content.length > 12 ? '...' : ''}
                  </span>
                </div>
                
                <div style={styles.layerControls}>
                  <span style={styles.positionInfo}>
                    {Math.round(textBox.x)}%, {Math.round(textBox.y)}%
                  </span>
                </div>
              </div>
            );
          })}
          
          {/* Design Elements Layers */}
          {designElements.slice().reverse().map((element, reverseIndex) => {
            const actualIndex = designElements.length - 1 - reverseIndex;
            return (
              <div
                key={element.id}
                style={{
                  ...styles.layerItem,
                  ...(selectedElement === element.id ? styles.selectedLayer : {})
                }}
                onClick={() => onElementSelect(element.id)}
              >
                <div style={styles.layerInfo}>
                  <span style={styles.layerIcon}>
                    {getElementIcon(element)}
                  </span>
                  <span style={styles.layerName}>
                    {getElementName(element)}
                  </span>
                </div>
                
                <div style={styles.layerControls}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveLayer(element.id, 'up');
                    }}
                    style={styles.layerButton}
                    disabled={actualIndex === designElements.length - 1}
                    title="Move Up"
                  >
                    ↑
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveLayer(element.id, 'down');
                    }}
                    style={styles.layerButton}
                    disabled={actualIndex === 0}
                    title="Move Down"
                  >
                    ↓
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Helper functions
const renderElement = (element) => {
  const commonStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    color: element.color || '#333',
    backgroundColor: element.fill || 'transparent',
    border: element.stroke ? `${element.strokeWidth || 1}px solid ${element.stroke}` : 'none',
    borderRadius: element.shape === 'circle' ? '50%' : '4px'
  };

  switch (element.type) {
    case 'shape':
      return (
        <div style={commonStyle}>
          {element.shape}
        </div>
      );
    case 'icon':
      return (
        <div style={commonStyle}>
          {element.icon}
        </div>
      );
    case 'text':
      return (
        <div style={{
          ...commonStyle,
          fontFamily: element.fontFamily || 'Arial',
          fontSize: element.fontSize || '16px',
          fontWeight: element.fontWeight || 'normal'
        }}>
          {element.text || 'Text'}
        </div>
      );
    default:
      return (
        <div style={commonStyle}>
          {element.type}
        </div>
      );
  }
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

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '600px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    backgroundColor: '#fff',
    overflow: 'hidden'
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '8px 16px',
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e5e7eb',
    flexWrap: 'wrap'
  },
  toolGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  toolButton: {
    padding: '6px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    fontSize: '12px',
    transition: 'all 0.2s ease'
  },
  activeButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    borderColor: '#3b82f6'
  },
  toolLabel: {
    fontSize: '12px',
    color: '#6b7280',
    fontWeight: '500'
  },
  toolValue: {
    fontSize: '12px',
    color: '#374151',
    fontWeight: '500',
    minWidth: '35px'
  },
  slider: {
    width: '80px'
  },
  canvasContainer: {
    flex: 1,
    overflow: 'auto',
    padding: '20px',
    backgroundColor: '#f9fafb',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  canvas: {
    position: 'relative',
    backgroundColor: '#fff',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    maxWidth: '100%',
    maxHeight: '70vh',
    transform: 'scale(0.6)',
    transformOrigin: 'top center',
    margin: '0 auto'
  },
  canvasElement: {
    position: 'absolute',
    cursor: 'move',
    transition: 'border-color 0.2s ease'
  },
  resizeHandle: {
    position: 'absolute',
    width: '8px',
    height: '8px',
    backgroundColor: '#3b82f6',
    border: '1px solid #fff',
    borderRadius: '50%',
    cursor: 'nw-resize'
  },
  layersPanel: {
    height: '200px',
    borderTop: '1px solid #e5e7eb',
    backgroundColor: '#fff'
  },
  panelHeader: {
    padding: '12px 16px',
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e5e7eb'
  },
  panelTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#111827',
    margin: 0
  },
  layersList: {
    padding: '8px',
    maxHeight: '150px',
    overflowY: 'auto'
  },
  layerItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    marginBottom: '2px'
  },
  selectedLayer: {
    backgroundColor: '#eff6ff',
    border: '1px solid #3b82f6'
  },
  layerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  layerIcon: {
    fontSize: '12px'
  },
  layerName: {
    fontSize: '12px',
    color: '#374151',
    fontWeight: '500'
  },
  layerControls: {
    display: 'flex',
    gap: '4px'
  },
  layerButton: {
    width: '20px',
    height: '20px',
    border: '1px solid #d1d5db',
    borderRadius: '2px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    fontSize: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  positionInfo: {
    fontSize: '10px',
    color: '#6b7280',
    fontWeight: '500'
  }
};

export default AdvancedLayoutTools;