import { DAISYUI_THEMES } from "@/constants/theme";
import useThemeStore from "@/store/useThemeStore";

export function ThemeSwitcher() {
  const { theme, setTheme } = useThemeStore();
  return (
    <select
      value={theme}
      className="select select-bordered select-sm bg-base-200 text-base-content/90 border-base-300 hover:bg-base-300 focus:outline-primary transition-colors"
      onChange={(e) => setTheme(e.target.value)}
      aria-label="Select theme"
    >
      {DAISYUI_THEMES.map((t) => (
        <option key={t} value={t} className="bg-base-100 text-base-content">
          {t}
        </option>
      ))}
    </select>
  );
}

export default ThemeSwitcher;
