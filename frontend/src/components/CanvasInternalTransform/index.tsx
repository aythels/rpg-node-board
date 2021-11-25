import './styles.css';
import React from 'react';
import CanvasInternalNode from '../CanvasInternalNode';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import { Node } from '../../types';
import { NodeManager } from './NodeManager';
import { updateNode, updateNodePos } from '../../state/slices/gameSlice';
import { store } from '../../state/';

const nodeManager = new NodeManager();

const CanvasInternalTransform = (): JSX.Element => {
  // const node = nodes[0];
  //store.dispatch(updateNode(gameId, node));
  // store.dispatch(updateNodePos([node, 100, 100]));

  const allNodes = useSelector((state: RootState) => state.game.gameInstance.nodes);
  const scale = useSelector((state: RootState) => state.nodeview.canvasScale);
  const canvasX = useSelector((state: RootState) => state.nodeview.canvasX);
  const canvasY = useSelector((state: RootState) => state.nodeview.canvasY);
  const width = nodeManager.nodeWidth;
  const height = nodeManager.nodeHeight;

  return (
    <div
      className="transform-wrapper"
      onPointerDown={nodeManager.onPress}
      onPointerMove={nodeManager.onMove}
      onPointerUp={nodeManager.onRelease}
      onPointerLeave={nodeManager.onRelease}
      onWheel={nodeManager.onWheel}
    >
      <div className="centerOffSet-container">
        <div className="scale-container" style={{ transform: `scale(${scale})` }}>
          <div
            className="grid-container"
            style={{
              left: `${canvasX}px`,
              top: `${canvasY}px`,
            }}
          />

          {[...allNodes].reverse().map((node: Node) => {
            if (false) {
              return;
            } else {
              return <CanvasInternalNode key={node.id} node={node} nodeWidth={width} nodeHeight={height} />;
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default CanvasInternalTransform;
