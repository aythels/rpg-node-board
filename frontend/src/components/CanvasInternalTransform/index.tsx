import './styles.css';
import React from 'react';
import CanvasInternalNode from '../CanvasInternalNode';

interface Props {
  nodeManager: any;
  onCloseClicked: (id: number) => void;
  onOpenClicked: (id: number) => void;
}

export default class CanvasInternalTransform extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.props.nodeManager.addOnUpdateEvent(() => this.setState({}));
  }

  render(): JSX.Element {
    const { nodeManager, onCloseClicked, onOpenClicked } = this.props;

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
          <div className="scale-container" style={{ transform: `scale(${nodeManager.scale})` }}>
            <div
              className="grid-container"
              style={{
                left: `${nodeManager.getFinalX()}px`,
                top: `${nodeManager.getFinalY()}px`,
              }}
            />

            {nodeManager.getAllNodes().map((node: any) => {
              if (!node.isVisible) {
                return;
              } else {
                return (
                  <CanvasInternalNode
                    key={node.id}
                    xPos={node.getRenderX()}
                    yPos={node.getRenderY()}
                    nodeWidth={node.width}
                    nodeHeight={node.height}
                    id={node.id}
                    dataNode={node.dataNode}
                    onCloseClicked={() => onCloseClicked(node.id)}
                    onOpenClicked={() => onOpenClicked(node.id)}
                  />
                );
              }
            })}
          </div>
        </div>
      </div>
    );
  }
}
