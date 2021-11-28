import './styles.css';
import React from 'react';
import Sidebar from '../LeftSidebar/Sidebar/Sidebar';
// import CanvasInternalNode from '../CanvasInternalNode';
import { DELETEnodeFromGame, GETgmIds, GETuserIsGMInGame, POSTnode } from '../../mock-backend';
import NodeView from '../NodeView/nodeview';
import { Node } from '../../types';
import { Alert, AlertTitle } from '@mui/material';
import { selectVisibleNodes } from '../../state/slices/gameSlice';
import { connect } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import CanvasInternalTransform from '../CanvasInternalTransform';
import { useSelector } from 'react-redux';
import { store } from '../../state/';
import { setIsEditPermissionsModalOpen } from '../../state/slices/nodeviewSlice';

const CanvasInternalBase = (): JSX.Element => {
  const activeNode = useSelector((state: RootState) => state.nodeview.activeNode);
  const errorModalOpen = useSelector((state: RootState) => state.nodeview.isEditPermissionsModalOpen);

  return (
    <div>
      <CanvasInternalTransform />
      <Sidebar />
      {activeNode !== -1 ? (
        <div className="nodeview-container">
          <NodeView />
        </div>
      ) : null}
      <div className="alert-container">
        {errorModalOpen ? (
          <Alert severity="error" onClose={() => store.dispatch(setIsEditPermissionsModalOpen(false))}>
            <AlertTitle>ERROR</AlertTitle>
            <p>You do not have permission to do that.</p>
          </Alert>
        ) : null}
      </div>
    </div>
  );
};

export default CanvasInternalBase;
