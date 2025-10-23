import React, { createContext, useContext, useEffect } from "react";
import { useAccessibility } from "@/hooks/useAccessibility";

// Context definition
const AccessibilityContext = createContext(null);

export const AccessibilityProvider = ({ children }) => {
  const value = useAccessibility();

  // EFFECT: Enable global word spell feature
  useEffect(() => {
    function speakLetters(word) {
      const utterance = new window.SpeechSynthesisUtterance(word.split('').join(' '));
      window.speechSynthesis.speak(utterance);
    }

    function handleEvent(e) {
      const target = e.target;
      // Only do for text nodes or words (avoid UI controls, icons, etc)
      if (
        target &&
        target.nodeType === Node.ELEMENT_NODE &&
        target.closest('[data-accessibility-spell]') == null &&
        !['BUTTON','INPUT','TEXTAREA','SELECT','svg','path'].includes(target.tagName)
      ) {
        // For leaf text nodes inside elements: wrap each word in a span
        function wrapWords(node) {
          if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            const words = node.textContent.split(/\s+/);
            const fragment = document.createDocumentFragment();
            words.forEach((word, i) => {
              if (!word) return;
              const span = document.createElement('span');
              span.textContent = word;
              span.setAttribute('tabIndex', '0');
              span.setAttribute('role', 'button');
              span.setAttribute('data-accessibility-spell','true');
              span.style.cursor = 'pointer';
              span.style.outline = 'none';
              span.addEventListener('click', () => speakLetters(word));
              span.addEventListener('touchstart', () => speakLetters(word));
              fragment.appendChild(span);
              if (i < words.length - 1) fragment.appendChild(document.createTextNode(' '));
            });
            node.replaceWith(fragment);
          } else if (node.nodeType === Node.ELEMENT_NODE && node.childNodes && !node.hasAttribute('data-accessibility-spell')) {
            Array.from(node.childNodes).forEach(wrapWords);
          }
        }
        // Avoid double-wrapping
        if (!target.hasAttribute('data-accessibility-spell')) {
          wrapWords(target);
        }
      }
    }

    // Set up on document body for delegation
    document.body.addEventListener('click', handleEvent, true);
    document.body.addEventListener('touchstart', handleEvent, true);

    // Clean up on unmount
    return () => {
      document.body.removeEventListener('click', handleEvent, true);
      document.body.removeEventListener('touchstart', handleEvent, true);
    };
  }, []);

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

// Custom hook for context remains unchanged
export const useAccessibilityContext = () => useContext(AccessibilityContext);

