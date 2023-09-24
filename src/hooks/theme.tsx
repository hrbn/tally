import { ReactCodeMirrorProps } from '@uiw/react-codemirror';
import { useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';

export function useTheme() {
  const [theme, setTheme] = useLocalStorage('theme', 'atomone');

  useEffect(() => {
    document.addEventListener('colorschemechange', (e) => {
      console.log('colorschemechange: ', e.detail.colorScheme);
      setTheme(e.detail.colorScheme as ReactCodeMirrorProps['theme']);
    });
  }, []);
  return { theme, setTheme };
}
