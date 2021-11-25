import './styles.css';
import React from 'react';
import { Node } from '../../types';
import { Delete, Launch } from '@mui/icons-material';
import { Tooltip } from '@mui/material';

interface Props {
  xPos: number;
  yPos: number;
  nodeWidth: number;
  nodeHeight: number;
  id: number;
  dataNode: Node;
  onCloseClicked: () => void;
  onOpenClicked: () => void;
}

export default class CanvasInternalNode extends React.Component<Props> {
  render(): JSX.Element {
    const { xPos, yPos, nodeWidth, nodeHeight, id, dataNode, onCloseClicked, onOpenClicked } = this.props;

    return (
      <div
        node-id={id}
        className="node"
        onDoubleClick={onOpenClicked}
        style={{
          left: `${xPos}px`,
          top: `${yPos}px`,
          width: `${nodeWidth}px`,
          height: `${nodeHeight}px`,
          backgroundImage: `url(${dataNode.image})`,
        }}
      >
        <div className="node__header">
          <div className="node-text-div" node-id={id}>
            {dataNode.name}
          </div>
        </div>
        <div className="node__footer">
          <Tooltip title="Delete node">
            <button className="node-button" onClick={onCloseClicked}>
              <Delete />
            </button>
          </Tooltip>
          <Tooltip title="View node">
            <button className="node-button" onClick={onOpenClicked}>
              <Launch />
            </button>
          </Tooltip>
        </div>
      </div>
    );
  }
}
