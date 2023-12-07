// src/ZoomContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Context for managing zoom-related functionality.
 * @type {React.Context}
 */
const ZoomContext = createContext();

/**
 * Provider component for managing zoom-related state.
 * @param {Object} props - React component props.
 * @param {React.ReactNode} props.children - Child components to be wrapped by the provider.
 */
export const ZoomProvider = ({ children }) => {
  /**
   * Initial text size retrieved from local storage or defaulting to 1.
   * @type {number}
   */
  const initialTextSize = parseFloat(localStorage.getItem('textSize')) || 1;

  /**
   * State variable for managing text size.
   * @type {[number, Function]}
   */
  const [textSize, setTextSize] = useState(initialTextSize);

  /**
   * Scale factors for different HTML element types.
   * @type {Object.<string, number>}
   */
  const typeScaleFactors = {
    'A': 25,
    'BUTTON': 20,
    'P': 20,
    'H1': 36,
    'H2': 32,
    'H3': 30,
    'H4': 28,
    'H5': 26,
    'H6': 24,
    'SPAN': 20,
    'SELECT': 15
  };

  /**
   * Effect hook for updating styles based on the current text size.
   */
  useEffect(() => {
    // Remove existing style element if present
    const existingStyleElement = document.getElementById('zoom-styles');
    if (existingStyleElement) {
      existingStyleElement.parentNode.removeChild(existingStyleElement);
    }

    // Create a new style element and append it to the document head
    const styleElement = document.createElement('style');
    styleElement.id = 'zoom-styles';
    document.head.appendChild(styleElement);

    // Access the style sheet of the new style element
    const styleSheet = styleElement.sheet;

    // Apply scale factors to different HTML element types
    Object.keys(typeScaleFactors).forEach((type) => {
      const scaleFactor = typeScaleFactors[type];
      styleSheet.insertRule(`${type.toLowerCase()} { font-size: ${textSize * scaleFactor}px !important; }`, 0);
    });

    // Update the body font size
    document.body.style.fontSize = `${textSize}em`;
  }, [textSize]);

  /**
   * Render the provider with the ZoomContext.Provider.
   * @returns {React.ReactNode} - Rendered JSX.
   */
  return (
    <ZoomContext.Provider value={{ textSize, setTextSize }}>
      <div>{children}</div>
    </ZoomContext.Provider>
  );
};

/**
 * Custom hook for accessing zoom-related context.
 * @returns {Object} - Zoom context object.
 * @property {number} textSize - Current text size.
 * @property {Function} setTextSize - Function to set the text size.
 */
export const useZoom = () => {
  return useContext(ZoomContext);
};
