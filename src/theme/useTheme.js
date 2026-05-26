import { useSettingsStore } from "../store/useSettingsStore";
import { themes } from "./themes";

export function useTheme() {
  const { settings } = useSettingsStore();

  const themeName = settings.theme || "dark";
  const theme = themes[themeName] || themes.dark;

  return {
    theme,
    themeName,
  };
}