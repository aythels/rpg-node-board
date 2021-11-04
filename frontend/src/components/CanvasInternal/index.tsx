import './styles.css';
import gridImage from './grid.jpg';
import React from 'react';
import CanvasInternalToolbar from '../CanvasInternalToolbar';
import CanvasInternalNode from '../CanvasInternalNode';
import { NodeManager } from './NodeManager';
import { GETgameById, GETnodesInGame, GETuserById, GETnodeById } from '../../mock-backend';
import NodeView from '../NodeView/nodeview';

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

    const game = GETgameById(props.currentGameId);
    for (const node of GETnodesInGame(game.id)) {
      this.nodeManager.createNode(node.id, node.name, node.image);
    }
  }

  render(): JSX.Element {
    const array = this.nodeManager.allNodes.slice().reverse();

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

            {array.map((node) => (
              <CanvasInternalNode
                key={node.id}
                xPos={node.xPos}
                yPos={node.yPos}
                nodeWidth={node.width}
                nodeHeight={node.height}
                id={node.id}
                name={node.name}
                image={node.image}
                onCloseClicked={() => this.nodeManager.removeNode(node.id)}
                onImageClicked={(id) => {
                  this.activeNode = id;
                  this.setState({});
                }}
              />
            ))}
          </div>
        </div>
        <CanvasInternalToolbar
          onBackClicked={() => console.log('back')}
          onCenterClicked={this.nodeManager.setCenter}
          onAddClicked={this.nodeManager.createNodeDefault}
        />

        {this.activeNode && GETnodeById(this.activeNode) ? (
          <div className="nodeview-container">
            <NodeView
              node={GETnodeById(this.activeNode)}
              user={GETuserById(this.props.currentUserId)}
              game={GETgameById(this.props.currentGameId)}
              closeCallback={() => {
                this.activeNode = -1;
                this.setState({});
              }}
            />
          </div>
        ) : null}
      </div>
    );
  }
}
