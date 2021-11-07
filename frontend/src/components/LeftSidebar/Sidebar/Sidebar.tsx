import './sidebar.css';
import React from 'react';
import NodeCard from '../NodeCard/NodeCard';
import { Drawer, IconButton, Tooltip, Typography } from '@mui/material';
import { Add, CenterFocusStrong, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { withTheme } from '@emotion/react';
import { MuiTheme } from '../../../theme';

interface Props extends MuiTheme {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nodeManager: any;
  setActiveNodeCallback: (id: number) => void;
  onCenterNodeViewClicked: () => void;
  onAddNodeClicked: () => void;
  onRemoveNodeClicked: (id: number) => void;
}

interface State {
  isOpen: boolean;
}

class Sidebar extends React.Component<Props, State> {
  state: State = {
    isOpen: true,
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
          className="vertical-toolbar"
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
      </div>
    );
  }
}

export default withTheme(Sidebar);
