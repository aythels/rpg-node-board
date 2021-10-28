import './modal.css';
import { Box, Modal as MuiModal } from '@mui/material';

interface Props {
  description?: string;
  header: string;
  onClose: () => void;
  open: boolean;
}

const Modal = (props: Props): JSX.Element => {
  return (
    <MuiModal
      aria-describedby="modal-modal-description"
      aria-labelledby="modal-modal-title"
      open={props.open}
      onClose={props.onClose}
    >
      <Box className="box">
        <h1 id="modal-modal-title">{props.header}</h1>
        {props.description && <p id="modal-modal-description">{props.description}</p>}
      </Box>
    </MuiModal>
  );
};

export default Modal;
