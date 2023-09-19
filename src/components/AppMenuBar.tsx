import React, { forwardRef, cloneElement, useMemo, useEffect, useState, useRef, Ref, ChangeEvent, KeyboardEvent } from 'react';
import CodeMirror, { ReactCodeMirrorProps, BasicSetupOptions } from '@uiw/react-codemirror';
import { useLocalStorage } from 'usehooks-ts';

import { CssVarsProvider, useColorScheme } from '@mui/joy/styles';
import Box, { BoxProps } from '@mui/joy/Box';
import Drawer from '@mui/joy/Drawer';
import SvgIcon, { SvgIconProps } from '@mui/joy/SvgIcon';
import Typography from '@mui/joy/Typography';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import IconButton from '@mui/joy/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import ListDivider from '@mui/joy/ListDivider';
import Dropdown from '@mui/joy/Dropdown';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import MoreVert from '@mui/icons-material/MoreVert';

import { useTheme } from '../hooks/theme';

import * as alls from '@uiw/codemirror-themes-all';

import toast from 'react-hot-toast';
import { useCalc } from '../context';
import useFormatter from '../hooks/format';
import demoContent from '../data/demo';

const themeOptions = ['dark', 'light']
  .concat(Object.keys(alls))
  .filter((item) => typeof alls[item as keyof typeof alls] !== 'function')
  .filter((item) => !/^(defaultSettings)/.test(item as keyof typeof alls));

type CalcContextType = {
  doc: string;
  lines: string[];
  results: Map<number, any>;
  settings: {
    theme: ReactCodeMirrorProps['theme'];
  };
  setDoc: React.Dispatch<React.SetStateAction<string>>;
  setSettings: React.Dispatch<React.SetStateAction<any>>;
};

const saveToFile = (content: string) => {
  const element = document.createElement('a');
  const file = new Blob([content], { type: 'text/plain' });
  element.href = URL.createObjectURL(file);
  element.download = 'calculations.txt';
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
  document.body.removeChild(element);
};

const copyTextToClipboard = async (text: string) => {
  if ('clipboard' in navigator) {
    return await navigator.clipboard.writeText(text);
  } else {
    return document.execCommand('copy', true, text);
  }
};

const TallyIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M6,3.53v9.32L8.37,12V3.53h2.42v7.62l2.42-.86V3.53h2.42V9.44l2.42-.86V3.53h2.42v4.2l1.41-.5L23,6.83l.81,2.28-1.15.4-2.21.79V20.47H18.05V11.15L15.63,12v8.47H13.21V12.85l-2.42.86v6.76H8.37V14.56L6,15.42v5H3.53v-4.2l-1.41.5L1,17.17.17,14.89l1.15-.4,2.21-.79V3.53Z" />
      </svg>
    </SvgIcon>
  );
};

const Header = (props: BoxProps) => {
  return (
    <Box
      component="header"
      className="Header"
      {...props}
      sx={[
        {
          p: 2,
          gap: 2,
          bgcolor: props.bg,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gridColumn: '1 / -1',

          position: 'sticky',
          top: 0,
          zIndex: 1100
        },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx])
      ]}
    />
  );
};

export default function MenuToolbar(props: BoxProps) {
  const inputEl = useRef<HTMLInputElement | null>(null);
  const { doc, lines, results, setDoc, settings, setSettings } = useCalc() as CalcContextType;
  const { format } = useFormatter();
  const [file, setFile] = useState<File | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    let fileReader,
      isCancel = false;
    if (file) {
      fileReader = new FileReader();
      fileReader.onload = (e) => {
        const { result } = e.target;
        if (result && !isCancel) {
          setDoc(result);
        }
      };
      fileReader.readAsText(file);
    }
    return () => {
      isCancel = true;
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
      }
    };
  }, [file]);

  const DownloadFile = () => {
    saveToFile(doc);
  };

  const DownloadFileResults = () => {
    const docWithResults = [...results.values()].map((v: string, i: string) => (v === null ? `${lines[i]}` : `${lines[i]} = ${format(v)}`)).join('\n');
    saveToFile(docWithResults);
  };

  const CopyFileResults = () => {
    const docWithResults = [...results.values()].map((v: string, i: string) => (v === null ? `${lines[i]}` : `${lines[i]} = ${format(v)}`)).join('\n');
    copyTextToClipboard(docWithResults);
    toast('Copied file with results');
  };

  const UploadFile = () => {
    inputEl.current.click();
  };

  const OpenDemoText = () => {
    setDoc(demoContent);
  };

  const handleColorschemeChange = (event: React.SyntheticEvent | null, newValue: string | null) => {
    setTheme(newValue as ReactCodeMirrorProps['theme']);
  };

  const toggleDrawer = (isOpen: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
      return;
    }

    setDrawerOpen(isOpen);
  };

  return (
    <Box>
      <Header bg={props.bg}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 1.5,
            color: '#6a9955'
          }}
        >
          <TallyIcon />
          <Typography
            component="h1"
            fontWeight="xl"
            sx={{
              marginLeft: '0.5em',
              marginRight: '1em',
              color: '#6a9955'
            }}
          >
            TALLY
          </Typography>
        </Box>
        <Dropdown>
          <MenuButton slots={{ root: IconButton }} slotProps={{ root: { variant: 'plain', color: 'neutral' } }}>
            <MoreVert />
          </MenuButton>
          <Menu sx={{ zIndex: 9999 }}>
            <MenuItem onClick={toggleDrawer(true)}>Settings</MenuItem>
            <MenuItem onClick={DownloadFile}>Export File</MenuItem>
            <MenuItem onClick={DownloadFileResults}>Export File with Solutions</MenuItem>
            <MenuItem onClick={UploadFile}>Import File</MenuItem>
            <ListDivider />
            <MenuItem onClick={CopyFileResults}>Copy All</MenuItem>
            <ListDivider />
            <MenuItem onClick={OpenDemoText}>View Demo</MenuItem>
          </Menu>
        </Dropdown>
      </Header>
      <Drawer open={drawerOpen} anchor="right" onClose={toggleDrawer(false)} size="sm">
        <Box
          role="presentation"
          sx={{
            padding: 2
          }}
        >
          <Typography component="h2" level="h4" textColor="inherit" fontWeight="lg" mb={1}>
            Settings
          </Typography>
          <FormControl sx={{ width: 240 }}>
            <FormLabel>Colorscheme</FormLabel>
            <Select value={theme} onChange={handleColorschemeChange}>
              {themeOptions.map((theme) => (
                <Option key={theme as string} value={theme as string}>
                  {theme}
                </Option>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Drawer>
    </Box>
  );
}
