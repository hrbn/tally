import { useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';

export function useTheme() {
  const [theme, setTheme] = useLocalStorage('theme', 'atomone');

  useEffect(() => {
    document.addEventListener('colorschemechange', (e) => {
      const { colorScheme } = (e as CustomEvent<{ colorScheme: string }>).detail;
      console.log('colorschemechange: ', colorScheme);
      setTheme(colorScheme);
    });
  }, []);
  return { theme, setTheme };
}
