import { useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';

export function useTheme() {
  const [theme, setTheme] = useLocalStorage('theme', 'atomone');

  useEffect(() => {
    const onColorSchemeChange = (e: Event) => {
      const { colorScheme } = (e as CustomEvent<{ colorScheme: string }>).detail;
      console.log('colorschemechange: ', colorScheme);
      setTheme(colorScheme);
    };
    document.addEventListener('colorschemechange', onColorSchemeChange);
    return () => document.removeEventListener('colorschemechange', onColorSchemeChange);
  }, [setTheme]);
  return { theme, setTheme };
}
