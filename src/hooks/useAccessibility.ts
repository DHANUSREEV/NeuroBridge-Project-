import { useState, useEffect } from "react";

export interface AccessibilitySettings {
  highContrast: boolean;
  reduceMotion: boolean;
  fontSize: number;
  colorTheme: "default" | "monochrome" | "high-contrast";
  soundFeedback: boolean;
  keyboardNavigation: boolean;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  highContrast: false,
  reduceMotion: false,
  fontSize: 16,
  colorTheme: "default",
  soundFeedback: false,
  keyboardNavigation: true,
};

export const useAccessibility = () => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("accessibility-settings");
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    }
    return DEFAULT_SETTINGS;
  });

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings((prev) => {
      const newSettings = { ...prev, [key]: value };
      return newSettings;
    });
  };

  useEffect(() => {
    localStorage.setItem("accessibility-settings", JSON.stringify(settings));

    const root = document.documentElement;

    // Font size
    root.style.fontSize = `${settings.fontSize}px`;

    // High contrast toggle
    if (settings.highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }

    // Reduced motion toggle
    if (settings.reduceMotion) {
      root.classList.add("reduce-motion");
    } else {
      root.classList.remove("reduce-motion");
    }

    // Color theme classes
    root.classList.remove("theme-default", "theme-monochrome", "theme-high-contrast");
    root.classList.add(`theme-${settings.colorTheme}`);

    // Keyboard navigation enhancement
    if (settings.keyboardNavigation) {
      root.classList.add("enhanced-keyboard");
    } else {
      root.classList.remove("enhanced-keyboard");
    }
  }, [settings]);

  const playFeedbackSound = () => {
    if (settings.soundFeedback && typeof window !== "undefined") {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    }
  };

  return {
    settings,
    updateSetting,
    playFeedbackSound,
  };
};
