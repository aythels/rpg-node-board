import './sidebar.css';
import { useState, useMemo } from 'react';
import NodeCard from '../NodeCard/NodeCard';
import { Drawer, IconButton, Tooltip, Typography } from '@mui/material';
import { ExitToApp, Add, CenterFocusStrong, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { withTheme } from '@emotion/react';
import { MuiTheme } from '../../../theme';
import Dialog from '../../Dialog/Dialog';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../state/rootReducer';
import { Node } from '../../../types';
import { addDefaultNode, selectVisibleNodes } from '../../../state/slices/gameSlice';
import { setIsEditPermissionsModalOpen } from '../../../state/slices/nodeviewSlice';
import nodeManager from '../../../state/nodeManager';
import { selectIsGameMaster } from '../../../state/slices/userSlice';

type Props = MuiTheme;

const Sidebar = (props: Props): JSX.Element => {
  const [isOpen, setIsOpen] = useState(true);
  const [leaveGameDialogue, setLeaveGameDialogue] = useState(false);

  const dispatch = useDispatch();
  const allNodes = useSelector((state: RootState) => selectVisibleNodes(state));
  const gameId = useSelector((state: RootState) => state.game.gameInstance._id);
  const isGameMaster = useSelector((state: RootState) => selectIsGameMaster(state));

  const sortedNodes = useMemo(() => {
    return [...allNodes].sort((a, b) => a.name.localeCompare(b.name));
  }, [allNodes]);

  return (
    <div className="left-sidebar">
      <Drawer className="container" anchor="left" open={isOpen} variant="persistent">
        <div className="header" style={{ backgroundColor: props.theme.palette.primary.light }}>
          <Typography className="title" variant="h6" component="div" align="center" noWrap={true}>
            Node Overview
          </Typography>
        </div>
        <div className="node-list">
          {sortedNodes.map((node: Node) => (
            <NodeCard key={node._id} node={node} />
          ))}
        </div>
      </Drawer>
      <div
        className="top-toolbar"
        style={{
          left: isOpen ? '20%' : '0%',
        }}
      >
        <Tooltip title="Center the canvas" placement="right">
          <IconButton aria-label="Center the canvas" onClick={() => nodeManager.centerCanvas()}>
            <CenterFocusStrong />
          </IconButton>
        </Tooltip>
        <Tooltip title="Add a new node" placement="right">
          <IconButton
            aria-label="Add a new node"
            onClick={() => {
              if (isGameMaster) {
                dispatch(addDefaultNode(gameId));
              } else {
                dispatch(setIsEditPermissionsModalOpen(true));
              }
            }}
          >
            <Add />
          </IconButton>
        </Tooltip>
        {/*<Tooltip className="first-button" title="Leave game" placement="right">
          <IconButton aria-label="Lave game" onClick={() => setLeaveGameDialogue(true)}>
            <ExitToApp />
          </IconButton>
      </Tooltip>*/}
      </div>
      <div
        className="bottom-toolbar"
        style={{
          left: isOpen ? '20%' : '0%',
        }}
      >
        <IconButton aria-label={`${isOpen ? 'Close' : 'Open'} the sidebar`} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </div>
      <Dialog
        header="Are you sure you wish to exit the game?"
        description="Doing so will redirect you to game overview."
        open={leaveGameDialogue}
        onClose={() => setLeaveGameDialogue(false)}
        onAgree={() => setLeaveGameDialogue(false)}
        onAgreeRedirectTo="/games"
        onDisagree={() => setLeaveGameDialogue(false)}
      />
    </div>
  );
};

export default withTheme(Sidebar);
