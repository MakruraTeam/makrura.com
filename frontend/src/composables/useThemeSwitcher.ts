import { ref, Ref } from 'vue';
import { useTheme } from 'vuetify';

export function useThemeSwitcher() {
  const theme = useTheme();
  const isDark: Ref<boolean> = ref(theme.global.current.value.dark);

  function toggleTheme(): void {
    isDark.value = !isDark.value;
    theme.global.name.value = isDark.value ? 'dark' : 'light';
  }

  return {
    isDark,
    toggleTheme,
  };
}
