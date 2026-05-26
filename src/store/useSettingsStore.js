import { useEffect, useState } from "react";

const STORAGE_KEY = "nivo-settings";
const SETTINGS_EVENT = "nivo-settings-change";

const defaultSettings = {
  theme: "dark",
  accentColor: "emerald",
  currency: "BRL",
  dateFormat: "dd/MM/yyyy",
  weekStartsOn: "monday",
  notifications: {
    dueDates: true,
    goals: false,
    reminders: true,
  },
  security: {
    pinEnabled: false,
    biometricEnabled: false,
  },
};

function loadSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved
      ? {
          ...defaultSettings,
          ...JSON.parse(saved),
          notifications: {
            ...defaultSettings.notifications,
            ...JSON.parse(saved).notifications,
          },
          security: {
            ...defaultSettings.security,
            ...JSON.parse(saved).security,
          },
        }
      : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

function saveSettings(nextSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSettings));
  window.dispatchEvent(new Event(SETTINGS_EVENT));
}

export function useSettingsStore() {
  const [settings, setSettings] = useState(loadSettings);

  useEffect(() => {
    function syncSettings() {
      setSettings(loadSettings());
    }

    window.addEventListener(SETTINGS_EVENT, syncSettings);
    window.addEventListener("storage", syncSettings);

    return () => {
      window.removeEventListener(SETTINGS_EVENT, syncSettings);
      window.removeEventListener("storage", syncSettings);
    };
  }, []);

  function updateSetting(key, value) {
    setSettings((prev) => {
      const next = {
        ...prev,
        [key]: value,
      };

      saveSettings(next);
      return next;
    });
  }

  function updateNestedSetting(group, key, value) {
    setSettings((prev) => {
      const next = {
        ...prev,
        [group]: {
          ...prev[group],
          [key]: value,
        },
      };

      saveSettings(next);
      return next;
    });
  }

  function resetSettings() {
    saveSettings(defaultSettings);
    setSettings(defaultSettings);
  }

  return {
    settings,
    updateSetting,
    updateNestedSetting,
    resetSettings,
  };
}