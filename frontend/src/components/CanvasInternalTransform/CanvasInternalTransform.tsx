import './canvasInternalTransform.css';
import CanvasInternalNode from '../CanvasInternalNode/CanvasInternalNode';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import { Node } from '../../types';
import nodeManager from '../../state/nodeManager';
import React, { useState } from 'react';

const CanvasInternalTransform = (): JSX.Element => {
  const [canvasData, getCanvasData] = useState(nodeManager.getSnapshot());
  nodeManager.addComponentToUpdate(() => getCanvasData(nodeManager.getSnapshot())); //  this line looks kind of ugly
  const invisibleNodes = useSelector((state: RootState) => state.nodeview.invisibleNodes);

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
        <div className="scale-container" style={{ transform: `scale(${canvasData.scale})` }}>
          <div
            className="grid-container"
            style={{
              left: `${canvasData.finalX}px`,
              top: `${canvasData.finalY}px`,
            }}
          />

          {[...canvasData.allNodes].reverse().map((node: any) => {
            const visible = !invisibleNodes.some((id: any) => id === node._id);
            if (visible)
              return (
                <CanvasInternalNode
                  key={node._id}
                  node={node.node}
                  nodeX={node.x}
                  nodeY={node.y}
                  nodeWidth={node.width}
                  nodeHeight={node.height}
                />
              );
          })}
        </div>
      </div>
    </div>
  );
};

export default CanvasInternalTransform;
