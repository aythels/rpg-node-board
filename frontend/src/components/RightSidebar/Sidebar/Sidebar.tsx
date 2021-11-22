import './sidebar.css';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useTheme } from '@mui/styles';
import { Drawer, IconButton, Theme } from '@mui/material';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import PlayerList from '../PlayerList/PlayerList';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../state/rootReducer';
import { selectIsGameMaster } from '../../../state/slices/userSlice';

const RightSidebar = (): JSX.Element => {
  const theme = useTheme<Theme>();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const isGameMaster = useSelector((state: RootState) => selectIsGameMaster(state));

  const toggleSidebarOpen = (): void => {
    setSidebarOpen((prevSidebarOpen: boolean) => !prevSidebarOpen);
  };

  const toggleSettingsOpen = (): void => {
    setSettingsOpen((prevSettingsOpen: boolean) => !prevSettingsOpen);
  };

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
        {/* TODO:isAdmin is necessary here? */}
        <Header isAdmin={isGameMaster} exposeSettings={settingsOpen} onSettingsToggleClicked={toggleSettingsOpen} />
        <PlayerList exposeSettings={settingsOpen} />
        {settingsOpen && <Footer />}
      </Drawer>
    </div>
  );
};

export default RightSidebar;
