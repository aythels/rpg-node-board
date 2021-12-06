import './nodeCard.css';
import { IconButton, Tooltip, Typography } from '@mui/material';
import { CenterFocusStrong, Delete, Visibility, VisibilityOff } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../state/rootReducer';
import { store } from '../../../state/';
import { Node } from '../../../types';
import {
  addInvisibleNode,
  removeInvisibleNode,
  setActiveNode,
  setIsEditPermissionsModalOpen,
} from '../../../state/slices/nodeviewSlice';
import { deleteNode } from '../../../state/slices/gameSlice';

interface Props {
  node: Node;
}

const NodeCard = (props: Props): JSX.Element => {
  //const allNodes = useSelector((state: RootState) => state.game.gameInstance.nodes);
  console.log('this is updating too much');

  const invisibleNodes = useSelector((state: RootState) => state.nodeview.invisibleNodes);
  const game = useSelector((state: RootState) => state.game.gameInstance);
  const node = props.node;
  const visible = !invisibleNodes.some((id) => id === node._id);
  const isAdmin = useSelector((state: RootState) => state.nodeview.isUserGameAdmin);

  return (
    <div className="node-card" onDoubleClick={() => store.dispatch(setActiveNode(node._id))}>
      <Typography className="title" variant="body1" component="div" noWrap={true}>
        {node.name}
      </Typography>
      <Tooltip arrow title={`Make node ${visible ? 'invisible' : 'visible'}`}>
        <IconButton
          style={{ marginLeft: 'auto' }}
          aria-label={`Make node ${visible ? 'invisible' : 'visible'}`}
          onClick={() => {
            if (visible) store.dispatch(addInvisibleNode(node._id));
            else store.dispatch(removeInvisibleNode(node._id));
          }}
        >
          {visible ? <Visibility /> : <VisibilityOff />}
        </IconButton>
      </Tooltip>
      <Tooltip arrow title="Navigate to node">
        <IconButton aria-label="Navigate to node" onClick={() => console.log('center node, fix this part')}>
          <CenterFocusStrong />
        </IconButton>
      </Tooltip>
      <Tooltip arrow title="Delete node">
        <IconButton
          color="error"
          aria-label="Delete node"
          onClick={() => {
            if (isAdmin) store.dispatch(deleteNode(game._id, node._id));
            else store.dispatch(setIsEditPermissionsModalOpen(true));
          }}
        >
          <Delete />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default NodeCard;
