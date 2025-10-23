import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { useAccessibility } from "@/hooks/useAccessibility";

type AccessibilityContextType = ReturnType<typeof useAccessibility> | null;

export const AccessibilityContext = createContext<AccessibilityContextType>(null);

interface AccessibilityProviderProps {
  children: ReactNode;
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const value = useAccessibility();
  const location = useLocation();

  useEffect(() => {
    function speakPhrase(phrase: string) {
      if (!phrase) return;
      const utterance = new window.SpeechSynthesisUtterance(phrase);
      window.speechSynthesis.cancel(); // cancel previous utterances before speaking new one
      window.speechSynthesis.speak(utterance);
    }

    // Wrap normal text nodes with a span that speaks the entire sentence on click
    function wrapSentences(node: Node) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
        const parent = node.parentElement;
        if (
          parent &&
          !["BUTTON", "A", "INPUT", "TEXTAREA", "SELECT", "LABEL"].includes(parent.tagName)
        ) {
          const sentence = node.textContent.trim();
          const span = document.createElement("span");
          span.textContent = sentence;
          span.setAttribute("tabindex", "0");
          span.setAttribute("role", "button");
          span.setAttribute("data-accessibility-spell", "true");
          span.style.cursor = "pointer";
          span.style.outline = "none";
          span.addEventListener("click", () => speakPhrase(sentence));
          span.addEventListener("touchstart", () => speakPhrase(sentence));
          (node as Element).replaceWith(span);
        }
      } else if (
        node.nodeType === Node.ELEMENT_NODE &&
        node.childNodes &&
        !(node as Element).hasAttribute("data-accessibility-spell")
      ) {
        Array.from(node.childNodes).forEach(wrapSentences);
      }
    }

    function handleEvent(e: Event) {
      const target = e.target as HTMLElement;
      if (!target) return;

      // If clicking/touching button or link or interactive element, speak full label
      if (
        ["BUTTON", "A", "INPUT", "TEXTAREA", "SELECT", "LABEL"].includes(target.tagName)
      ) {
        speakPhrase(target.textContent?.trim() || "");
        return;
      }

      // For other elements, if not wrapped yet, wrap them
      if (
        target.nodeType === Node.ELEMENT_NODE &&
        target.closest("[data-accessibility-spell]") == null
      ) {
        if (!(target as Element).hasAttribute("data-accessibility-spell")) {
          wrapSentences(target);
        }
      }

      // If clicked on wrapped element, speak its text
      if (target.hasAttribute && target.hasAttribute("data-accessibility-spell")) {
        speakPhrase(target.textContent?.trim() || "");
      }
    }

    // Initial wrap of document body
    wrapSentences(document.body);

    // Attach event listeners with capture phase
    document.body.addEventListener("click", handleEvent, true);
    document.body.addEventListener("touchstart", handleEvent, true);

    return () => {
      document.body.removeEventListener("click", handleEvent, true);
      document.body.removeEventListener("touchstart", handleEvent, true);
    };
  }, [location]);

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
}

export function useAccessibilityContext() {
  const context = useContext(AccessibilityContext);
  if (context === null) {
    throw new Error("useAccessibilityContext must be used within AccessibilityProvider");
  }
  return context;
}
