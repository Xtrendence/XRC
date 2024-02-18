import { ListItemDecorator, Stack, Tab, TabList, Tabs } from '@mui/joy';
import { FaCog, FaMicrochip, FaRedo, FaToggleOn } from 'react-icons/fa';
import { navigationHeight } from '../../globalVariables';
import { useNavigate } from 'react-router-dom';

export const tabs = [
  '/processes',
  '/control-center',
  '/backup-utility',
  '/settings',
];

export default function Navigation() {
  const navigate = useNavigate();

  return (
    <>
      <Stack
        spacing={2}
        maxHeight={navigationHeight}
        minHeight={navigationHeight}
        height={navigationHeight}
        sx={(theme) => ({
          backgroundColor: theme.palette.background.surface,
          display: 'flex',
          width: '100%',
          position: 'fixed',
          zIndex: 1,
          top: 0,
          left: 0,
        })}
      >
        <Tabs
          defaultValue={0}
          onChange={(_, tab) => {
            const route = tabs[Number(tab)];
            navigate(route);
          }}
        >
          <TabList tabFlex="auto">
            <Tab orientation="vertical">
              <ListItemDecorator>
                <FaMicrochip />
              </ListItemDecorator>
              Processes
            </Tab>
            <Tab orientation="vertical">
              <ListItemDecorator>
                <FaToggleOn />
              </ListItemDecorator>
              Control Center
            </Tab>
            <Tab orientation="vertical">
              <ListItemDecorator>
                <FaRedo />
              </ListItemDecorator>
              Backup Utility
            </Tab>
            <Tab orientation="vertical">
              <ListItemDecorator>
                <FaCog />
              </ListItemDecorator>
              Settings
            </Tab>
          </TabList>
        </Tabs>
      </Stack>
    </>
  );
}
