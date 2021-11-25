import './styles.css';
import React from 'react';
import { Node } from '../../types';
import { Delete, Launch } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { store } from '../../state/';
import { setActiveNode } from '../../state/slices/nodeviewSlice';

interface Props {
  node: Node;
  nodeWidth: number;
  nodeHeight: number;
}

const CanvasInternalNode = (props: Props): JSX.Element => {
  const { node, nodeWidth, nodeHeight } = props;

  return (
    <div
      className="node"
      node-id={node.id}
      onDoubleClick={() => store.dispatch(setActiveNode(node.id))}
      style={{
        left: `${node.x}px`,
        top: `${node.y}px`,
        width: `${nodeWidth}px`,
        height: `${nodeHeight}px`,
        backgroundImage: `url(${node.image})`,
      }}
    >
      <div className="node__header">
        <div className="node-text-div" node-id={node.id}>
          {node.name}
        </div>
      </div>
      <div className="node__footer">
        <Tooltip title="Delete node">
          <button className="node-button" onClick={() => store.dispatch(setActiveNode(-1))}>
            <Delete />
          </button>
        </Tooltip>
        <Tooltip title="View node">
          <button className="node-button" onClick={() => store.dispatch(setActiveNode(node.id))}>
            <Launch />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default CanvasInternalNode;
