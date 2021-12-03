import './styles.css';
import React from 'react';
import Sidebar from '../LeftSidebar';
// import CanvasInternalNode from '../CanvasInternalNode';
import { NodeManager } from './NodeManager';
import { DELETEnodeFromGame, GETgmIds, GETuserIsGMInGame, POSTnode } from '../../mock-backend';
import NodeView from '../NodeView/nodeview';
import { Game, Node, User } from '../../types';
import { Alert, AlertTitle } from '@mui/material';
import { selectVisibleNodes } from '../../state/slices/gameSlice';
import { connect } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import CanvasInternalTransform from '../CanvasInternalTransform';

interface Props {
  visibleNodes: Node[];
  currentGameId: Game['_id'];
  currentUserId: User['_id'];
}

// Note: before you refactor to a functional component make sure you know what you
// are doing - the setState({}) trick won't work on a functional component
class CanvasInternalBase extends React.Component<Props> {
  nodeManager = new NodeManager();
  activeNode = -1;
  activeAlert = false;

  constructor(props: Props) {
    super(props);
    // TODO: Refactor
    // for (const node of GETnodesInGameVisibleToUser(props.currentGameId, props.currentUserId)) {
    //   this.nodeManager.createNode(node.id, node);
    // }
  }

  getActiveNodeFromNodeManager = (): Node => {
    const node = this.nodeManager.allNodes.filter((node) => node.id === this.activeNode)[0];
    return node.dataNode;
  };

  handleNodeLinkClick = (id: number, updatedNode: Node): void => {
    this.handleNodeviewSave(updatedNode);
    this.activeNode = -1;
    this.setState({}, () => {
      this.activeNode = id;
      this.setState({});
    });
  };

  handleNodeviewSave = (updatedNode: Node): void => {
    const nodeToUpdate = this.nodeManager.allNodes.filter((node) => node.dataNode.id === updatedNode.id)[0];
    nodeToUpdate.dataNode = updatedNode;
    this.activeNode = -1;
    this.setState({});
  };

  handleRemoveNodeClicked = (nodeId: number): void => {
    if (!GETuserIsGMInGame(this.props.currentUserId, this.props.currentGameId)) {
      this.activeAlert = true;
      this.setState({});
      return;
    }
    DELETEnodeFromGame(this.props.currentGameId, nodeId);
    this.nodeManager.removeNode(nodeId);
  };

  handleAddNodeClicked = (): void => {
    if (!GETuserIsGMInGame(this.props.currentUserId, this.props.currentGameId)) {
      this.activeAlert = true;
      this.setState({});
      return;
    }
    const id = Math.ceil(Math.random() * 1000); //TODO: handle ID creation in database? !IMPORTANT
    const newNode = {
      id: id,
      name: 'Default' + id,
      image: '/images/default.jpg',
      imageAlt: 'Default',
      subnodes: [],
      informationLevels: [],
      editors: GETgmIds(this.props.currentGameId),
      type: 'default',
    } as Node;
    POSTnode(newNode, this.props.currentGameId);
    this.nodeManager.createNode(newNode.id, newNode);
    this.setState({});
  };

  render(): JSX.Element {
    return (
      <div>
        <CanvasInternalTransform
          nodeManager={this.nodeManager}
          onCloseClicked={(id) => {
            this.handleRemoveNodeClicked(id);
          }}
          onOpenClicked={(id) => {
            this.activeNode = id;
            this.setState({});
          }}
        />
        <Sidebar
          isAdmin={GETuserIsGMInGame(this.props.currentUserId, this.props.currentGameId)}
          nodeManager={this.nodeManager}
          setActiveNodeCallback={(id) => {
            this.activeNode = id;
            this.setState({});
          }}
          onCenterNodeViewClicked={this.nodeManager.setCenter}
          onAddNodeClicked={this.handleAddNodeClicked}
          onRemoveNodeClicked={this.handleRemoveNodeClicked}
        />
        {this.activeNode !== -1 ? (
          <div className="nodeview-container">
            <NodeView />
          </div>
        ) : null}
        <div className="alert-container">
          {this.activeAlert ? (
            <Alert
              severity="error"
              onClose={() => {
                this.activeAlert = false;
                this.setState({});
              }}
            >
              <AlertTitle>ERROR</AlertTitle>
              <p>You do not have permission to do that.</p>
            </Alert>
          ) : null}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState): Props => ({
  visibleNodes: selectVisibleNodes(state),
  currentUserId: state.user.userInstance._id,
  currentGameId: state.game.gameInstance._id,
});

export default connect(mapStateToProps)(CanvasInternalBase);
