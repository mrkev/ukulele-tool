import { useCallback, useEffect } from "react";
import useLocalStorageState from "use-local-storage-state";

export type ThemeSetting = "light" | "dark" | "system";

/**
 * Where the setting is saved. The inline script in index.html reads the same
 * key to set the theme before first paint, so keep the two in step.
 */
const STORAGE_KEY = "ukulele-tool.theme";

/** Browser toolbar colour per theme; matches --background. */
const THEME_COLORS = { light: "#ffffff", dark: "#222222" };

const darkQuery = () => window.matchMedia("(prefers-color-scheme: dark)");

/** Puts a setting into effect: data-theme on <html> drives the CSS. */
function applyTheme(setting: ThemeSetting) {
  const theme =
    setting === "dark" || (setting === "system" && darkQuery().matches)
      ? "dark"
      : "light";
  document.documentElement.dataset.theme = theme;
  document
    .querySelectorAll('meta[name="theme-color"]')
    .forEach((meta) => meta.setAttribute("content", THEME_COLORS[theme]));
}

function storedSetting(): ThemeSetting {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    return value === "light" || value === "dark" ? value : "system";
  } catch {
    return "system";
  }
}

/**
 * The light/dark/system setting. Use it once, near the root: it also keeps the
 * page in step with the OS while the setting is "system".
 *
 * The page is already themed by the time React runs (see index.html), so this
 * only acts on changes; applying on mount would briefly apply the server-side
 * default during hydration and flash the wrong theme.
 */
export function useThemeSetting() {
  const [setting, setStored] = useLocalStorageState<ThemeSetting>(STORAGE_KEY, {
    defaultValue: "system",
  });

  const setSetting = useCallback(
    (next: ThemeSetting) => {
      setStored(next);
      applyTheme(next);
    },
    [setStored]
  );

  useEffect(() => {
    const query = darkQuery();
    const onChange = () => {
      if (storedSetting() === "system") applyTheme("system");
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return [setting, setSetting] as const;
}
