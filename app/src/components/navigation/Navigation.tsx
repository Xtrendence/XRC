import {
  Drawer,
  IconButton,
  ListItemDecorator,
  Stack,
  Tab,
  TabList,
  Tabs,
} from '@mui/joy';
import { FaBars, FaCog, FaMicrochip, FaRedo, FaToggleOn } from 'react-icons/fa';
import { navigationHeight } from '../../globalVariables';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export const tabs = [
  '/processes',
  '/control-center',
  '/backup-utility',
  '/settings',
];

export function NavigationTabs({
  onItemClick,
  mobile,
}: {
  onItemClick?: () => void;
  mobile?: boolean;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const currentTab = tabs.findIndex((tab) => tab === location.pathname);

  return (
    <Tabs
      orientation={mobile ? 'vertical' : 'horizontal'}
      value={currentTab || 0}
      sx={(theme) => ({
        background: 'transparent',
        overflow: 'hidden',
        '.Mui-selected': {
          background: theme.palette.background.level1,
        },
      })}
      onChange={(_, tab) => {
        const route = tabs[Number(tab)];
        navigate(route);

        onItemClick?.();
      }}
    >
      <TabList
        tabFlex="auto"
        sx={{
          flexGrow: 1,
        }}
        size={mobile ? 'lg' : 'md'}
      >
        <Tab orientation={mobile ? 'horizontal' : 'vertical'}>
          <ListItemDecorator>
            <FaMicrochip />
          </ListItemDecorator>
          Processes
        </Tab>
        <Tab orientation={mobile ? 'horizontal' : 'vertical'}>
          <ListItemDecorator>
            <FaToggleOn />
          </ListItemDecorator>
          Control Center
        </Tab>
        <Tab orientation={mobile ? 'horizontal' : 'vertical'}>
          <ListItemDecorator>
            <FaRedo />
          </ListItemDecorator>
          Backup Utility
        </Tab>
        <Tab orientation={mobile ? 'horizontal' : 'vertical'}>
          <ListItemDecorator>
            <FaCog />
          </ListItemDecorator>
          Settings
        </Tab>
      </TabList>
    </Tabs>
  );
}

export default function Navigation() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Stack
        spacing={2}
        maxHeight={navigationHeight}
        minHeight={navigationHeight}
        height={navigationHeight}
        sx={{
          background: 'transparent',
          display: 'flex',
          width: '100%',
          position: 'fixed',
          zIndex: 4,
          top: 0,
          left: 0,
        }}
      >
        <Stack
          sx={{
            display: {
              xs: 'none',
              sm: 'flex',
            },
          }}
        >
          <NavigationTabs />
        </Stack>
        <Stack
          sx={(theme) => ({
            display: {
              xs: 'flex',
              sm: 'none',
            },
            borderBottomWidth: '1.5px',
            borderBottomStyle: 'solid',
            borderColor: theme.palette.divider,
          })}
        >
          <Stack alignItems={'flex-start'}>
            <IconButton
              onClick={() => setOpen(true)}
              variant="solid"
              color="primary"
              sx={{
                ml: 2,
                mb: 1.5,
              }}
            >
              <FaBars />
            </IconButton>
          </Stack>
        </Stack>
      </Stack>
      <Drawer
        sx={{
          display: {
            xs: 'block',
            sm: 'none',
          },
        }}
        open={open}
        onClose={() => setOpen(false)}
      >
        <NavigationTabs onItemClick={() => setOpen(false)} mobile />
      </Drawer>
    </>
  );
}
