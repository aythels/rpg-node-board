import './sidebar.css';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Drawer, IconButton } from '@mui/material';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import PlayerList from '../PlayerList/PlayerList';
import { Component } from 'react';
import { MuiTheme } from '../../../theme';
import { withTheme } from '@mui/styles';

interface ExternalProps {
  currentUserId: number;
  isAdmin: boolean;
  gameId: number;
  gameMasterIds: number[];
}

interface Props extends ExternalProps, MuiTheme {}

interface State {
  sidebarOpen: boolean;
  settingsOpen: boolean;
}
class SidebarBase extends Component<Props, State> {
  state: State = {
    sidebarOpen: true,
    settingsOpen: false,
  };

  toggleSidebarOpen = (): void => {
    this.setState((prevState: State) => ({
      sidebarOpen: !prevState.sidebarOpen,
    }));
  };

  toggleSettingsOpen = (): void => {
    this.setState((prevState: State) => ({
      settingsOpen: !prevState.settingsOpen,
    }));
  };

  render(): JSX.Element {
    return (
      <div className="canvas-sidebar" style={{ backgroundColor: this.props.theme.palette.primary }}>
        <IconButton
          className="open-close-button"
          style={{
            right: this.state.sidebarOpen ? '20%' : '0%',
          }}
          aria-label={`${this.state.sidebarOpen ? 'Close' : 'Open'} the sidebar`}
          component="span"
          onClick={this.toggleSidebarOpen}
        >
          {this.state.sidebarOpen ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
        <Drawer anchor="right" className="container" open={this.state.sidebarOpen} variant="persistent">
          <Header
            isAdmin={this.props.isAdmin}
            exposeSettings={this.state.settingsOpen}
            onSettingsToggleClicked={this.toggleSettingsOpen}
          />
          <PlayerList exposeSettings={this.state.settingsOpen} />
          {this.state.settingsOpen && <Footer />}
        </Drawer>
      </div>
    );
  }
}

export default withTheme(SidebarBase);
