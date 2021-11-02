import './styles.css';
import React from 'react';

interface Props {
  xPos: number;
  yPos: number;
  nodeWidth: number;
  nodeHeight: number;
  onCloseClicked: () => void;
}

export default class CanvasNode extends React.Component<Props> {
  render(): JSX.Element {
    const { xPos, yPos, nodeWidth, nodeHeight, onCloseClicked } = this.props;

    return (
      <div
        className="node"
        style={{ left: `${xPos}px`, top: `${yPos}px`, width: `${nodeWidth}px`, height: `${nodeHeight}px` }}
      >
        <div>
          <button type="button" onClick={onCloseClicked}>
            Close
          </button>
        </div>
        I can now be moved around!
      </div>
    );
  }
}
