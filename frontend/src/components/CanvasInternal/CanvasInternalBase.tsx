import './canvasinternalbase.css';
import React from 'react';
import Sidebar from '../LeftSidebar/Sidebar/Sidebar';
import NodeView from '../NodeView/nodeview';
import { Alert, AlertTitle } from '@mui/material';
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
      {activeNode !== '' ? (
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
