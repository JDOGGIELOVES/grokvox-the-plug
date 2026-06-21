"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  detectShouldUsePerformanceMode,
  getPerformanceModePreference,
  resolvePerformanceMode,
  setPerformanceModeActive,
  setPerformanceModePreference,
  type PerformanceModePreference,
} from "@/lib/performance-mode";

type PerformanceModeContextValue = {
  performanceMode: boolean;
  preference: PerformanceModePreference;
  setPreference: (preference: PerformanceModePreference) => void;
};

const PerformanceModeContext = createContext<PerformanceModeContextValue>({
  performanceMode: false,
  preference: "auto",
  setPreference: () => {},
});

export function PerformanceModeProvider({ children }: { children: ReactNode }) {
  const [performanceMode, setPerformanceMode] = useState(false);
  const [preference, setPreferenceState] = useState<PerformanceModePreference>(
    "auto",
  );

  const applyMode = useCallback(() => {
    const active = resolvePerformanceMode();
    setPerformanceMode(active);
    setPreferenceState(getPerformanceModePreference());
    return active;
  }, []);

  useEffect(() => {
    applyMode();

    const mobileQuery = window.matchMedia("(max-width: 768px)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointerQuery = window.matchMedia("(pointer: coarse)");

    const handleChange = () => {
      applyMode();
    };

    mobileQuery.addEventListener("change", handleChange);
    motionQuery.addEventListener("change", handleChange);
    pointerQuery.addEventListener("change", handleChange);

    return () => {
      mobileQuery.removeEventListener("change", handleChange);
      motionQuery.removeEventListener("change", handleChange);
      pointerQuery.removeEventListener("change", handleChange);
      setPerformanceModeActive(false);
    };
  }, [applyMode]);

  const setPreference = useCallback(
    (next: PerformanceModePreference) => {
      setPerformanceModePreference(next);
      const active =
        next === "on"
          ? true
          : next === "off"
            ? false
            : detectShouldUsePerformanceMode();
      setPerformanceModeActive(active);
      setPerformanceMode(active);
      setPreferenceState(next);
    },
    [],
  );

  const value = useMemo(
    () => ({ performanceMode, preference, setPreference }),
    [performanceMode, preference, setPreference],
  );

  return (
    <PerformanceModeContext.Provider value={value}>
      {children}
    </PerformanceModeContext.Provider>
  );
}

export function usePerformanceMode(): PerformanceModeContextValue {
  return useContext(PerformanceModeContext);
}