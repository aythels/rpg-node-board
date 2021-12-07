import './nodeCard.css';
import { IconButton, Tooltip, Typography } from '@mui/material';
import { CenterFocusStrong, Delete, Visibility, VisibilityOff } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../state/rootReducer';
import { Node } from '../../../types';
import {
  addInvisibleNode,
  removeInvisibleNode,
  setActiveNode,
  setIsEditPermissionsModalOpen,
} from '../../../state/slices/nodeviewSlice';
import { deleteNode } from '../../../state/slices/gameSlice';
import nodeManager from '../../../state/nodeManager';
import { selectIsGameMaster } from '../../../state/slices/userSlice';

interface Props {
  node: Node;
}

const NodeCard = (props: Props): JSX.Element => {
  const dispatch = useDispatch();
  const invisibleNodes = useSelector((state: RootState) => state.nodeview.invisibleNodes);
  const game = useSelector((state: RootState) => state.game.gameInstance);
  const node = props.node;
  const visible = !invisibleNodes.some((id) => id === node._id);
  const isGameMaster = useSelector((state: RootState) => selectIsGameMaster(state));

  return (
    <div className="node-card" onDoubleClick={() => dispatch(setActiveNode(node._id))}>
      <Typography className="title" variant="body1" component="div" noWrap={true}>
        {node.name}
      </Typography>
      {isGameMaster && (
        <Tooltip arrow title={`Make node ${visible ? 'invisible' : 'visible'}`}>
          <IconButton
            className="button"
            aria-label={`Make node ${visible ? 'invisible' : 'visible'}`}
            onClick={() => {
              if (visible) {
                dispatch(addInvisibleNode(node._id));
              } else {
                dispatch(removeInvisibleNode(node._id));
              }
              nodeManager.update();
            }}
          >
            {visible ? <Visibility /> : <VisibilityOff />}
          </IconButton>
        </Tooltip>
      )}
      <Tooltip arrow title="Navigate to node">
        <IconButton className="button" aria-label="Navigate to node" onClick={() => nodeManager.centerNode(node._id)}>
          <CenterFocusStrong />
        </IconButton>
      </Tooltip>
      {isGameMaster && (
        <Tooltip arrow title="Delete node">
          <IconButton
            className="button"
            color="error"
            aria-label="Delete node"
            onClick={() => {
              if (isGameMaster) {
                dispatch(deleteNode(game._id, node._id));
              } else {
                dispatch(setIsEditPermissionsModalOpen(true));
              }
            }}
          >
            <Delete />
          </IconButton>
        </Tooltip>
      )}
    </div>
  );
};

export default NodeCard;
