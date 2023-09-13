import React, { forwardRef, cloneElement, useMemo, useEffect, useState, useRef, Ref, ChangeEvent, KeyboardEvent } from 'react';
import Menu from '@mui/joy/Menu';
import MenuItem, { menuItemClasses } from '@mui/joy/MenuItem';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListDivider from '@mui/joy/ListDivider';
import Typography, { typographyClasses } from '@mui/joy/Typography';
import Dropdown, { DropdownProps } from '@mui/joy/Dropdown';
import MenuButton from '@mui/joy/MenuButton';
import { Theme } from '@mui/joy';
import toast from 'react-hot-toast';
import { useCalc } from '../context';
import useFormatter from '../hooks/format';
import demoContent from '../data/demo';

type MenuBarButtonProps = Pick<DropdownProps, 'children' | 'open'> & {
  onOpen: DropdownProps['onOpenChange'];
  onKeyDown: React.KeyboardEventHandler;
  menu: JSX.Element;
  onMouseEnter: React.MouseEventHandler;
};

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

const TallyIcon = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="1em" height="1em" {...props}>
      <path fill="currentColor" d="M160 32V64 278.5l64-22.6V64 32h64V64 233.4l64-22.6V64 32h64V64 188.2l64-22.6V64 32h64V64v79l37.4-13.2 30.2-10.7 21.3 60.4-30.2 10.7L544 210.9V448v32H480V448 233.5l-64 22.6V448v32H352V448 278.6l-64 22.6V448v32H224V448 323.8l-64 22.6V448v32H96V448 369L58.6 382.2 28.5 392.8 7.2 332.5l30.2-10.6L96 301.1V64 32h64z" />
    </svg>
  );
};

const MenuBarButton = React.forwardRef(({ children, menu, open, onOpen, onKeyDown, ...props }: MenuBarButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
  return (
    <Dropdown open={open} onOpenChange={onOpen}>
      <MenuButton {...props} slots={{ root: ListItemButton }} ref={ref} role="menuitem" variant="plain">
        {children}
      </MenuButton>
      {React.cloneElement(menu, {
        slotProps: {
          listbox: {
            id: `toolbar-menu-${children}`,
            'aria-label': children
          }
        },
        placement: 'bottom-start',
        disablePortal: false,
        variant: 'soft',
        sx: (theme: Theme) => ({
          width: 288,
          boxShadow: '0 2px 8px 0px rgba(0 0 0 / 0.38)',
          '--List-padding': 'var(--ListDivider-gap)',
          '--ListItem-minHeight': '32px',
          [`&& .${menuItemClasses.root}`]: {
            transition: 'none',
            '&:hover': {
              ...theme.variants.soft.secondary,
              [`& .${typographyClasses.root}`]: {
                color: 'inherit'
              }
            }
          }
        })
      })}
    </Dropdown>
  );
});
MenuBarButton.displayName = 'MenuBarButton';

export default function MenuToolbar() {
  const menus = useRef<HTMLElement[]>([]);
  const [menuIndex, setMenuIndex] = useState<number | null>(null);
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

  const renderShortcut = (text: string) => (
    <Typography level="body2" textColor="text.tertiary" ml="auto">
      {text}
    </Typography>
  );

  const openNextMenu = () => {
    if (typeof menuIndex === 'number') {
      if (menuIndex === menus.current.length - 1) {
        setMenuIndex(0);
      } else {
        setMenuIndex(menuIndex + 1);
      }
    }
  };

  const openPreviousMenu = () => {
    if (typeof menuIndex === 'number') {
      if (menuIndex === 0) {
        setMenuIndex(menus.current.length - 1);
      } else {
        setMenuIndex(menuIndex - 1);
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowRight') {
      openNextMenu();
    }
    if (event.key === 'ArrowLeft') {
      openPreviousMenu();
    }
  };

  const createHandleButtonKeyDown = (index: number) => (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowRight') {
      if (index === menus.current.length - 1) {
        menus.current[0]?.focus();
      } else {
        menus.current[index + 1]?.focus();
      }
    }
    if (event.key === 'ArrowLeft') {
      if (index === 0) {
        menus.current[menus.current.length]?.focus();
      } else {
        menus.current[index - 1]?.focus();
      }
    }
  };

  const itemProps = {
    onClick: () => setMenuIndex(null),
    onKeyDown: handleKeyDown
  };

  return (
    <List
      orientation="horizontal"
      aria-label="application menu bar"
      role="menubar"
      sx={{
        bgcolor: 'background.level1',
        px: 2,
        borderRadius: '4px',
        width: '100%',
        '--ListItem-radius': '8px'
      }}
    >
      <ListItem
        sx={{
          color: '#6a9955'
        }}
      >
        <TallyIcon />
        <Typography
          sx={{
            marginLeft: '0.5em',
            marginRight: '1em',
            color: '#6a9955'
          }}
        >
          TALLY
        </Typography>
      </ListItem>
      <ListItem>
        <MenuBarButton
          open={menuIndex === 0}
          onOpen={() => {
            setMenuIndex((prevMenuIndex) => (prevMenuIndex === null ? 0 : null));
          }}
          onKeyDown={createHandleButtonKeyDown(0)}
          onMouseEnter={() => {
            if (typeof menuIndex === 'number') {
              setMenuIndex(0);
            }
          }}
          ref={(instance) => {
            menus.current[0] = instance;
          }}
          menu={
            <Menu
              onClose={() => {
                menus.current[0]?.focus();
              }}
            >
              <ListItem nested>
                <List aria-label="Save">
                  <MenuItem {...itemProps} onClick={DownloadFile}>
                    Save File
                  </MenuItem>
                  <MenuItem {...itemProps} onClick={DownloadFileResults}>
                    Save File with Results
                  </MenuItem>
                </List>
              </ListItem>
              <ListDivider />
              <ListItem nested>
                <List aria-label="Open">
                  <MenuItem {...itemProps} onClick={UploadFile}>
                    Open File
                  </MenuItem>
                </List>
                <input ref={inputEl} type="file" onChange={handleChange} hidden />
              </ListItem>
            </Menu>
          }
        >
          File
        </MenuBarButton>
      </ListItem>
      <ListItem>
        <MenuBarButton
          open={menuIndex === 1}
          onOpen={() => {
            setMenuIndex((prevMenuIndex) => (prevMenuIndex === null ? 1 : null));
          }}
          onKeyDown={createHandleButtonKeyDown(1)}
          onMouseEnter={() => {
            if (typeof menuIndex === 'number') {
              setMenuIndex(1);
            }
          }}
          ref={(instance) => {
            menus.current[1] = instance;
          }}
          menu={
            <Menu
              onClose={() => {
                menus.current[1]?.focus();
                setMenuIndex(null);
              }}
            >
              <MenuItem {...itemProps} onClick={CopyFileResults}>
                Copy All with Results
              </MenuItem>
            </Menu>
          }
        >
          Edit
        </MenuBarButton>
      </ListItem>

      <ListItem>
        <MenuBarButton
          open={menuIndex === 2}
          onOpen={() => {
            setMenuIndex((prevMenuIndex) => (prevMenuIndex === null ? 2 : null));
          }}
          onKeyDown={createHandleButtonKeyDown(2)}
          onMouseEnter={() => {
            if (typeof menuIndex === 'number') {
              setMenuIndex(2);
            }
          }}
          ref={(instance) => {
            menus.current[2] = instance;
          }}
          menu={
            <Menu
              onClose={() => {
                menus.current[2]?.focus();
                setMenuIndex(null);
              }}
            >
              <MenuItem {...itemProps} onClick={OpenDemoText}>
                View Demo
              </MenuItem>
            </Menu>
          }
        >
          Help
        </MenuBarButton>
      </ListItem>
    </List>
  );
}
