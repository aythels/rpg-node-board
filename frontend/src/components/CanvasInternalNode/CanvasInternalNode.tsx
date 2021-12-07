import './canvasInternalNode.css';
import { Node } from '../../types';
import { Delete, Launch } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { store } from '../../state';
import { setActiveNode, setIsEditPermissionsModalOpen } from '../../state/slices/nodeviewSlice';
import { deleteNode } from '../../state/slices/gameSlice';
import { RootState } from '../../state/rootReducer';
import { useSelector } from 'react-redux';

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
  const isAdmin = useSelector((state: RootState) => state.nodeview.isUserGameAdmin);

  return (
    <div
      className="node"
      node-id={node._id}
      onDoubleClick={() => store.dispatch(setActiveNode(node._id))}
      style={{
        left: `${nodeX}px`,
        top: `${nodeY}px`,
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
              if (isAdmin) store.dispatch(deleteNode(game._id, node._id));
              else store.dispatch(setIsEditPermissionsModalOpen(true));
            }}
          >
            <Delete />
          </button>
        </Tooltip>
        <Tooltip title="View node">
          <button className="node-button" onClick={() => store.dispatch(setActiveNode(node._id))}>
            <Launch />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default CanvasInternalNode;
