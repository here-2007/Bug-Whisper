import { useState, useEffect, useCallback } from 'react';
import {
  type InferenceSettings,
  DEFAULT_INFERENCE_SETTINGS,
} from '../types/settings';

const STORAGE_KEY = 'bugwhisper_settings';

function loadStoredSettings(): InferenceSettings {
  if (typeof window === 'undefined') {
    return DEFAULT_INFERENCE_SETTINGS;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_INFERENCE_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_INFERENCE_SETTINGS,
      ...parsed,
    };
  } catch (err) {
    console.error('Failed to parse stored inference settings:', err);
    return DEFAULT_INFERENCE_SETTINGS;
  }
}

export function useSettings() {
  const [settings, setSettings] = useState<InferenceSettings>(loadStoredSettings);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (err) {
      console.error('Failed to persist inference settings to localStorage:', err);
    }
  }, [settings]);

  const updateSettings = useCallback((updates: Partial<InferenceSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...updates,
    }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_INFERENCE_SETTINGS);
  }, []);

  return {
    settings,
    updateSettings,
    resetSettings,
  };
}
