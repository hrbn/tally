import React, { forwardRef, cloneElement, useMemo, useEffect, useState, useRef, Ref, ChangeEvent, KeyboardEvent } from 'react';
import { CssVarsProvider, useColorScheme } from '@mui/joy/styles';
import Box, { BoxProps } from '@mui/joy/Box';

import SvgIcon, { SvgIconProps } from '@mui/joy/SvgIcon';
import Typography from '@mui/joy/Typography';
import IconButton from '@mui/joy/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import toast from 'react-hot-toast';
import Menu from './Menu';
import { useCalc } from '../context';
import useFormatter from '../hooks/format';
import demoContent from '../data/demo';

type CalcContextType = {
  doc: string;
  lines: string[];
  results: Map<number, any>;
  setDoc: React.Dispatch<React.SetStateAction<string>>;
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
          bgcolor: 'background.level1',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gridColumn: '1 / -1',
          // borderBottom: '1px solid',
          // borderColor: 'divider',
          position: 'sticky',
          top: 0,
          zIndex: 1100
        },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx])
      ]}
    />
  );
};

export default function MenuToolbar() {
  const inputEl = useRef<HTMLInputElement | null>(null);
  const { doc, lines, results, setDoc } = useCalc() as CalcContextType;
  const { format } = useFormatter();
  const [file, setFile] = useState<File | null>(null);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    setFile(files[0]);
  };

  return (
    <Header>
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

      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1.5 }}>
        <Menu
          id="action-menu"
          control={
            <IconButton size="sm" variant="plain" color="neutral" aria-label="Actions" title="Actions">
              <MoreVertIcon />
            </IconButton>
          }
          menus={[
            {
              label: 'Export File',
              action: DownloadFile
            },
            {
              label: 'Export File with Solutions',
              action: DownloadFileResults
            },
            {
              label: 'Import File',
              action: UploadFile
            },
            {
              divider: true
            },
            {
              label: 'Copy All',
              action: CopyFileResults
            },
            {
              divider: true
            },
            {
              label: 'View Demo',
              action: OpenDemoText
            }
          ]}
        />
      </Box>
    </Header>
  );
}
