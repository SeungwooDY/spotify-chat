"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const THEME_STORAGE_KEY = "spotify-chat-theme";

export const HorizontalThemeWipeToggle = ({
  className,
  direction = "left",
  showLabel = false,
  labelClassName,
}) => {
  const buttonRef = useRef(null);
  const [darkMode, setDarkMode] = useState(() =>
    typeof window !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false,
  );

  useEffect(() => {
    const syncTheme = () =>
      setDarkMode(document.documentElement.classList.contains("dark"));

    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const updateTheme = useCallback(
    (toggled) => {
      setDarkMode(toggled);
      document.documentElement.classList.toggle("dark", toggled);
      document.documentElement.style.colorScheme = toggled ? "dark" : "light";
      localStorage.setItem(THEME_STORAGE_KEY, toggled ? "dark" : "light");
    },
    [],
  );

  const animateWipe = useCallback(() => {
    if (direction === "left") {
      document.documentElement.animate(
        {
          clipPath: ["inset(0 100% 0 0)", "inset(0 0 0 0)"],
        },
        {
          duration: 700,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    } else {
      document.documentElement.animate(
        {
          clipPath: ["inset(0 0 0 100%)", "inset(0 0 0 0)"],
        },
        {
          duration: 700,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    }
  }, [direction]);

  const onToggle = useCallback(async () => {
    if (!buttonRef.current) return;

    const toggled = !darkMode;

    if (!document.startViewTransition) {
      flushSync(() => updateTheme(toggled));
      return;
    }

    await document.startViewTransition(() => {
      flushSync(() => updateTheme(toggled));
    }).ready;

    animateWipe();
  }, [animateWipe, darkMode, updateTheme]);

  const label = darkMode ? "Dark" : "Light";

  return (
    <button
      ref={buttonRef}
      onClick={onToggle}
      aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
      aria-pressed={darkMode}
      className={cn(
        "flex items-center justify-center rounded-full p-2 outline-none focus:outline-none active:outline-none focus:ring-0 cursor-pointer",
        className,
      )}
      type="button"
    >
      <AnimatePresence mode="wait" initial={false}>
        {darkMode ? (
          <motion.span
            key="sun-icon"
            initial={{ opacity: 0, scale: 0.55, rotate: 25 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.33 }}
            className="flex items-center"
          >
            <Sun className="navbar-link-icon" />
          </motion.span>
        ) : (
          <motion.span
            key="moon-icon"
            initial={{ opacity: 0, scale: 0.55, rotate: -25 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.33 }}
            className="flex items-center"
          >
            <Moon className="navbar-link-icon" />
          </motion.span>
        )}
      </AnimatePresence>
      {showLabel && (
        <span className={cn("navbar-link-label", labelClassName)}>{label}</span>
      )}
    </button>
  );
};
