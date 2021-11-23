import './canvasMain.css';
import { useState } from 'react';
import Dialog from '../Dialog/Dialog';
import RightSidebar from '../RightSidebar';
import CanvasInternal from '../CanvasInternal';

const CanvasMain = (): JSX.Element => {
  const [showUserNotFoundModal, setShowUserNotFoundModal] = useState(false);

  return (
    <div>
      <CanvasInternal />

      <RightSidebar />

      <Dialog
        description="Please try again."
        header="The player could not be found!"
        open={showUserNotFoundModal}
        onClose={() => setShowUserNotFoundModal(false)}
      />
    </div>
  );
};
export default CanvasMain;
