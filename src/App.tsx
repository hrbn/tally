import * as alls from '@uiw/codemirror-themes-all';
import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import React, { useEffect } from 'react';
import AppMenuBar from './components/AppMenuBar';
import Box from '@mui/joy/Box';
import { CalcProvider } from './context';
import CssBaseline from '@mui/joy/CssBaseline';
import Editor from './components/Editor';
import { Toaster } from 'react-hot-toast';
import { useTheme } from './hooks/theme';

const getThemeObjects = () => {
  let themeObjects = {};
  ['dark', 'light']
    .concat(Object.keys(alls))
    .filter((item) => typeof alls[item as keyof typeof alls] !== 'function')
    .filter((item) => /^(defaultSettings)/.test(item as keyof typeof alls))
    .forEach((item) => {
      let key = item as keyof typeof alls;
      key = key.replace(/^(defaultSettings)/, '');
      key = key.charAt(0).toLowerCase() + key.slice(1);
      themeObjects[key] = {
        palette: {
          background: {
            default: alls[item].background
          }
        }
      };
    });
  return themeObjects;
};

const muiTheme = extendTheme({
  colorSchemes: getThemeObjects()
});

const getBackground = (aTheme: string) => {
  const themeRegex = new RegExp(`${aTheme}$`, 'i');
  const defaults = ['dark', 'light']
    .concat(Object.keys(alls))
    .filter((item) => typeof alls[item as keyof typeof alls] !== 'function')
    .filter((item) => /^(defaultSettings)/.test(item as keyof typeof alls))
    .filter((item) => themeRegex.test(item as keyof typeof alls))
    .map((item) => {
      return alls[item].background;
    })[0];
  return defaults;
};

function Clipboard() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 11C7.44772 11 7 11.4477 7 12C7 12.5523 7.44772 13 8 13H15.9595C16.5118 13 16.9595 12.5523 16.9595 12C16.9595 11.4477 16.5118 11 15.9595 11H8Z" fill="currentColor" />
      <path d="M8.04053 15.0665C7.48824 15.0665 7.04053 15.5142 7.04053 16.0665C7.04053 16.6188 7.48824 17.0665 8.04053 17.0665H16C16.5523 17.0665 17 16.6188 17 16.0665C17 15.5142 16.5523 15.0665 16 15.0665H8.04053Z" fill="currentColor" />
      <path fillRule="evenodd" clipRule="evenodd" d="M5 3C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H5ZM7 5H5L5 19H19V5H17V6C17 7.65685 15.6569 9 14 9H10C8.34315 9 7 7.65685 7 6V5ZM9 5V6C9 6.55228 9.44772 7 10 7H14C14.5523 7 15 6.55228 15 6V5H9Z" fill="currentColor" />
    </svg>
  );
}

function App() {
  const { theme, setTheme } = useTheme();
  const [background, setBackground] = React.useState(getBackground(theme));

  useEffect(() => {
    setBackground(getBackground(theme));
  }, [theme]);

  return (
    <CssVarsProvider theme={muiTheme} defaultMode="system">
      <CalcProvider>
        <CssBaseline />
        <Box
          className="App"
          sx={{
            bgcolor: background,
            minHeight: '100vh',
            height: '100%'
          }}
        >
          <AppMenuBar bg={background} />
          <Editor />
        </Box>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            icon: <Clipboard />,
            style: {
              background: 'var(--joy-palette-neutral-600, #555E68)',
              color: '#fcfcfa',
              fontSize: '1rem'
            }
          }}
        />
      </CalcProvider>
    </CssVarsProvider>
  );
}

export default App;
