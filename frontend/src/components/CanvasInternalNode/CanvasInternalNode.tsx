import './canvasInternalNode.css';
import { Node } from '../../types';
import { Delete, Launch } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { setActiveNode, setIsEditPermissionsModalOpen } from '../../state/slices/nodeviewSlice';
import { deleteNode } from '../../state/slices/gameSlice';
import { RootState } from '../../state/rootReducer';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsGameMaster } from '../../state/slices/userSlice';

interface Props {
  node: Node;
  nodeX: number;
  nodeY: number;
  nodeWidth: number;
  nodeHeight: number;
}

const CanvasInternalNode = (props: Props): JSX.Element => {
  const { node, nodeX, nodeY, nodeWidth, nodeHeight } = props;
  const game = useSelector((state: RootState) => state.game.gameInstance);
  const dispatch = useDispatch();
  const isGameMaster = useSelector((state: RootState) => selectIsGameMaster(state));

  return (
    <div
      className="node"
      node-id={node._id}
      onDoubleClick={() => dispatch(setActiveNode(node._id))}
      style={{
        left: `${nodeX - nodeWidth / 2}px`,
        top: `${nodeY - nodeHeight / 2}px`,
        width: `${nodeWidth}px`,
        height: `${nodeHeight}px`,
        backgroundImage: `url(${node.image})`,
      }}
    >
      <div className="node__header">
        <div className="node-text-div" node-id={node._id}>
          {node.name}
        </div>
      </div>
      <div className="node__footer">
        <Tooltip title="Delete node">
          <button
            className="node-button"
            onClick={() => {
              if (isGameMaster) {
                dispatch(deleteNode(game._id, node._id));
              } else {
                dispatch(setIsEditPermissionsModalOpen(true));
              }
            }}
          >
            <Delete />
          </button>
        </Tooltip>
        <Tooltip title="View node">
          <button className="node-button" onClick={() => dispatch(setActiveNode(node._id))}>
            <Launch />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default CanvasInternalNode;
