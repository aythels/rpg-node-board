import './styles.css';
import React from 'react';

interface Props {
  xPos: number;
  yPos: number;
  nodeWidth: number;
  nodeHeight: number;
  id: number;
  name: string;
  image: string;
  onCloseClicked: () => void;
  onImageClicked: (id: number) => void;
}

export default class CanvasInternalNode extends React.Component<Props> {
  render(): JSX.Element {
    const { xPos, yPos, nodeWidth, nodeHeight, id, name, image, onCloseClicked, onImageClicked } = this.props;

    return (
      <div
        className="node"
        onDoubleClick={() => onImageClicked(id)}
        style={{
          left: `${xPos}px`,
          top: `${yPos}px`,
          width: `${nodeWidth}px`,
          height: `${nodeHeight}px`,
          backgroundImage: `url(${image})`,
        }}
      >
        <div className="node-button-div">
          <button className="node-button" type="button" onClick={onCloseClicked}>
            X
          </button>
        </div>

        <div className="node-text-div">{name}</div>
      </div>
    );
  }
}
