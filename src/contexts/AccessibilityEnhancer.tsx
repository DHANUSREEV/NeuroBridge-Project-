import React, { useEffect } from "react";
import { useAccessibilityContext } from "./AccessibilityContext";

export function AccessibilityEnhancer({ children }) {
  const ctx = useAccessibilityContext();
  const { settings, playFeedbackSound } = ctx;

  // AUDIO FEEDBACK FEATURE
  useEffect(() => {
    if (settings.soundFeedback) {
      const handleAudioFeedback = (event) => {
        if (
          ["BUTTON", "A", "INPUT", "SELECT", "TEXTAREA"].includes(event.target.tagName) ||
          event.target.hasAttribute("data-sound-feedback")
        ) {
          playFeedbackSound();
        }
      };
      document.body.addEventListener("click", handleAudioFeedback, true);
      document.body.addEventListener("keydown", (event) => {
        if (
          (event.key === "Tab" || event.key === "Enter") &&
          document.activeElement &&
          (["BUTTON", "A", "INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement.tagName) ||
            document.activeElement.hasAttribute("data-sound-feedback"))
        ) {
          playFeedbackSound();
        }
      });
      return () => {
        document.body.removeEventListener("click", handleAudioFeedback, true);
      };
    }
  }, [settings.soundFeedback, playFeedbackSound]);

  // ENHANCED KEYBOARD NAVIGATION FEATURE
  useEffect(() => {
    if (settings.keyboardNavigation) {
      const style = document.createElement("style");
      style.innerHTML = `
        .enhanced-keyboard *:focus {
          outline: 2px solid #6366F1 !important;
          outline-offset: 2px;
          box-shadow: 0 0 0 2px rgba(99,102,241,0.3);
        }
      `;
      document.head.appendChild(style);
      return () => {
        document.head.removeChild(style);
      };
    }
  }, [settings.keyboardNavigation]);

  return <>{children}</>;
}
