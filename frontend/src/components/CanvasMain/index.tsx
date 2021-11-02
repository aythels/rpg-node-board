import './styles.css';
import gridImage from './assets/grid.jpg';
import React from 'react';
import CanvasToolbar from './CanvasToolbar';
import CanvasNode from './CanvasNode';
import { NodeManager } from './actions/NodeManager';

export default class CanvasMain extends React.Component {
  nodeManager = new NodeManager(this);

  render(): JSX.Element {
    const array = this.nodeManager.allNodes.slice().reverse();

    return (
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
            <CanvasNode
              key={node.id}
              xPos={node.xPos}
              yPos={node.yPos}
              nodeWidth={node.width}
              nodeHeight={node.height}
              removeButton={() => this.nodeManager.removeNode(node.id)}
            />
          ))}
        </div>

        <CanvasToolbar
          backButton={() => console.log('back')}
          centerButton={this.nodeManager.setCenter}
          addButton={this.nodeManager.createNode}
        />
      </div>
    );
  }
}
