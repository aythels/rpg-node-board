import './sidebar.css';
import React from 'react';
import NodeCard from '../NodeCard/NodeCard';
import { Drawer, IconButton, Tooltip, Typography } from '@mui/material';
import { ExitToApp, Add, CenterFocusStrong, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { withTheme } from '@emotion/react';
import { MuiTheme } from '../../../theme';
import Dialog from '../../Dialog/Dialog';

interface Props extends MuiTheme {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nodeManager: any;
  setActiveNodeCallback: (id: number) => void;
  onCenterNodeViewClicked: () => void;
  onAddNodeClicked: () => void;
  onRemoveNodeClicked: (id: number) => void;
  isAdmin: boolean;
}

interface State {
  isOpen: boolean;
  showLeaveGameDialog: boolean;
}

class Sidebar extends React.Component<Props, State> {
  state: State = {
    isOpen: true,
    showLeaveGameDialog: false,
  };

  onToggleSideBar = (): void => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  sortNodes = (nodes: any): any => {
    return [...nodes].sort((a, b) => a.dataNode.name.localeCompare(b.dataNode.name));
  };

  render(): JSX.Element {
    const { nodeManager, setActiveNodeCallback, onCenterNodeViewClicked, onAddNodeClicked, onRemoveNodeClicked } =
      this.props;

    return (
      <div className="left-sidebar">
        <Drawer className="container" anchor="left" open={this.state.isOpen} variant="persistent">
          <div className="header" style={{ backgroundColor: this.props.theme.palette.primary.light }}>
            <Typography className="title" variant="h6" component="div" align="center" noWrap={true}>
              Node Overview
            </Typography>
          </div>
          <div className="node-list">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {this.sortNodes(nodeManager.getAllNodes()).map((node: any) => (
              <NodeCard
                key={node.id}
                visible={node.isVisible}
                caption={node.dataNode.name}
                onDoubleClick={() => setActiveNodeCallback(node.id)}
                onVisibilityToggled={() => {
                  node.isVisible = !node.isVisible;
                  nodeManager.update();
                }}
                onNavigateToNodeClicked={() => nodeManager.centerNode(node.id)}
                onRemoveNodeClicked={() => onRemoveNodeClicked(node.id)}
              />
            ))}
          </div>
        </Drawer>
        <div
          className="top-toolbar"
          style={{
            left: this.state.isOpen ? '20%' : '0%',
          }}
        >
          <Tooltip className="first-button" title="Leave game" placement="right">
            <IconButton aria-label="Lave game" onClick={() => this.setState({ showLeaveGameDialog: true })}>
              <ExitToApp />
            </IconButton>
          </Tooltip>
        </div>
        <div
          className="bottom-toolbar"
          style={{
            left: this.state.isOpen ? '20%' : '0%',
          }}
        >
          <Tooltip title="Center node view" placement="right">
            <IconButton aria-label="Center node view" onClick={onCenterNodeViewClicked}>
              <CenterFocusStrong />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add a new node" placement="right">
            <IconButton aria-label="Add a new node" onClick={onAddNodeClicked}>
              <Add />
            </IconButton>
          </Tooltip>
          <IconButton aria-label={`${this.state.isOpen ? 'Close' : 'Open'} the sidebar`} onClick={this.onToggleSideBar}>
            {this.state.isOpen ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </div>
        <Dialog
          header="Are you sure you wish to leave the game?"
          description="Doing so will redirect you to game overview."
          open={this.state.showLeaveGameDialog}
          onClose={() => this.setState({ showLeaveGameDialog: false })}
          onAgree={() => this.setState({ showLeaveGameDialog: false })}
          onAgreeRedirectTo="/games"
          onDisagree={() => this.setState({ showLeaveGameDialog: false })}
        />
      </div>
    );
  }
}

export default withTheme(Sidebar);
