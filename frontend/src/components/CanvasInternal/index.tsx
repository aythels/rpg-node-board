import './styles.css';
import gridImage from './grid.jpg';
import React from 'react';
import Sidebar from '../LeftSidebar';
import CanvasInternalNode from '../CanvasInternalNode';
import { NodeManager } from './NodeManager';
import {
  DELETEnode,
  GETgameById,
  GETgmIds,
  GETnewNodeId,
  GETnodesInGameVisibleToUser,
  GETuserById,
  POSTnodeToGame,
} from '../../mock-backend';
import NodeView from '../NodeView/nodeview';
import { Node } from '../../types';

interface Props {
  currentGameId: number;
  currentUserId: number;
}

export default class CanvasInternal extends React.Component<Props> {
  nodeManager = new NodeManager();
  activeNode = -1;

  constructor(props: Props) {
    super(props);
    this.nodeManager.addOnUpdateEvent(() => this.setState({}));
    for (const node of GETnodesInGameVisibleToUser(props.currentGameId, props.currentUserId)) {
      this.nodeManager.createNode(node.id, node);
    }
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
    DELETEnode(nodeId);
    this.nodeManager.removeNode(nodeId);
  };

  handleAddNodeClicked = (): void => {
    const id = GETnewNodeId();
    const newNode = {
      id: id,
      name: 'Default' + id,
      image: '/images/default.jpg',
      imageAlt: 'Default',
      subnodes: [],
      informationLevels: {},
      editors: GETgmIds(this.props.currentGameId),
      type: 'default',
    } as Node;
    POSTnodeToGame(newNode, this.props.currentGameId);
    this.nodeManager.createNode(newNode.id, newNode);
  };

  render(): JSX.Element {
    return (
      <div>
        <div
          className="w"
          onPointerDown={this.nodeManager.onPress}
          onPointerMove={this.nodeManager.onMove}
          onPointerUp={this.nodeManager.onRelease}
          onPointerLeave={this.nodeManager.onRelease}
          onWheel={this.nodeManager.onWheel}
        >
          <div className="c" style={{ transform: `scale(${this.nodeManager.scale})` }}>
            <img
              id="img"
              src={gridImage}
              style={{ left: `${this.nodeManager.getFinalX()}px`, top: `${this.nodeManager.getFinalY()}px` }}
            />

            {this.nodeManager.getAllNodes().map((node) => {
              if (!node.isVisible) {
                return;
              } else {
                return (
                  <CanvasInternalNode
                    key={node.id}
                    xPos={node.xPos}
                    yPos={node.yPos}
                    nodeWidth={node.width}
                    nodeHeight={node.height}
                    id={node.id}
                    dataNode={node.dataNode}
                    onCloseClicked={() => {
                      this.handleRemoveNodeClicked(node.id);
                    }}
                    onImageClicked={(id) => {
                      this.activeNode = id;
                      this.setState({});
                    }}
                  />
                );
              }
            })}
          </div>
        </div>
        <Sidebar
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
            <NodeView
              node={this.getActiveNodeFromNodeManager()}
              user={GETuserById(this.props.currentUserId)}
              game={GETgameById(this.props.currentGameId)}
              onLinkClick={this.handleNodeLinkClick}
              closeCallback={this.handleNodeviewSave}
            />
          </div>
        ) : null}
      </div>
    );
  }
}
