import './sidebar.css';
import React from 'react';
import NodeCard from '../NodeCard/NodeCard';
import { Drawer, IconButton } from '@mui/material';
import { Add, CenterFocusStrong, ChevronLeft, ChevronRight } from '@mui/icons-material';

interface Props {
  nodeManager: any;
  setActiveNodeCallback: (id: number) => void;
  onCenterClicked: () => void;
  onAddClicked: () => void;
  closeCallback: (id: number) => void;
}

interface State {
  openLeftPos: number;
  closeLeftPos: number;
  isOpen: boolean;
}

export default class LeftSidebar extends React.Component<Props, State> {
  state: State = {
    openLeftPos: 0,
    closeLeftPos: -240,
    isOpen: true,
  };

  onToggleSideBar = (): void => {
    console.log(this.state.isOpen);
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  render(): JSX.Element {
    const { nodeManager, setActiveNodeCallback, onCenterClicked, onAddClicked } = this.props;

    return (
      <div
        className="left-sidebar"
        style={{
          left: `${this.state.isOpen ? this.state.openLeftPos : this.state.closeLeftPos}px`,
        }}
      >
        <Drawer className="container" anchor="left" open={this.state.isOpen} variant="persistent">
          <div className="node-list">
            {nodeManager.getAllNodes().map((node: any) => (
              <NodeCard
                key={node.id}
                node={node}
                entryDBClickCallback={() => setActiveNodeCallback(node.id)}
                visibleCallback={() => {
                  node.isVisible = !node.isVisible;
                  nodeManager.update();
                }}
                navigateCallback={() => nodeManager.centerNode(node.id)}
                closeCallback={() => this.props.closeCallback(node.id)}
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
          <IconButton aria-label="Center node view" onClick={onCenterClicked}>
            <CenterFocusStrong />
          </IconButton>
          <IconButton aria-label="Add a new node" onClick={onAddClicked}>
            <Add />
          </IconButton>
          <IconButton aria-label={`${this.state.isOpen ? 'Close' : 'Open'} the sidebar`} onClick={this.onToggleSideBar}>
            {this.state.isOpen ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </div>
      </div>
    );
  }
}
