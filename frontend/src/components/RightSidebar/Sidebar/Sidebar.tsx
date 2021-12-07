import './sidebar.css';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useTheme } from '@mui/styles';
import { Drawer, IconButton, Theme } from '@mui/material';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import PlayerList from '../PlayerList/PlayerList';
import { useCallback, useState } from 'react';
import { selectIsGameMaster } from '../../../state/slices/userSlice';
import { RootState } from '../../../state/rootReducer';
import { useSelector, useDispatch } from 'react-redux';

const RightSidebar = (): JSX.Element => {
  const theme = useTheme<Theme>();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const isGameMaster = useSelector((state: RootState) => selectIsGameMaster(state));

  const toggleSidebarOpen = useCallback(() => {
    setSidebarOpen((prevSidebarOpen: boolean) => !prevSidebarOpen);
  }, []);

  const toggleSettingsOpen = useCallback(() => {
    setSettingsOpen((prevSettingsOpen: boolean) => !prevSettingsOpen);
  }, []);

  return (
    <div className="canvas-sidebar" style={{ backgroundColor: theme.palette.primary.light }}>
      <IconButton
        className="open-close-button"
        style={{
          right: sidebarOpen ? '20%' : '0%',
        }}
        aria-label={`${sidebarOpen ? 'Close' : 'Open'} the sidebar`}
        component="span"
        onClick={toggleSidebarOpen}
      >
        {sidebarOpen ? <ChevronRight /> : <ChevronLeft />}
      </IconButton>
      <Drawer anchor="right" className="container" open={sidebarOpen} variant="persistent">
        <Header
          exposeSettings={isGameMaster}
          settingsOpen={isGameMaster && settingsOpen}
          onSettingsToggleClicked={toggleSettingsOpen}
        />
        <PlayerList settingsOpen={isGameMaster && settingsOpen} />
        {settingsOpen && <Footer />}
      </Drawer>
    </div>
  );
};

export default RightSidebar;
