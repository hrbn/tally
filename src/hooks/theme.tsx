import { useEffect, useState } from 'react';
import { ReactCodeMirrorProps } from '@uiw/react-codemirror';
import { useLocalStorage } from 'usehooks-ts';

export function useTheme(name: ReactCodeMirrorProps['theme'] = 'atomone') {
  const [theme, setTheme] = useLocalStorage('theme', 'atomone');

  useEffect(() => {
    document.addEventListener('colorschemechange', (e) => {
      console.log('colorschemechange: ', e.detail.colorScheme);
      setTheme(e.detail.colorScheme as ReactCodeMirrorProps['theme']);
    });
  }, []);
  return { theme, setTheme };
}
