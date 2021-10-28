import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Dialog as MuiDialog,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { PureComponent } from 'react';

interface Props {
  description: string;
  header: string;
  onAgree?: () => void;
  onAgreeRedirectTo: string;
  onClose: () => void;
  onDisagree?: () => void;
  open: boolean;
}

export default class Dialog extends PureComponent<Props> {
  render(): JSX.Element {
    return (
      // Code retrieved from: https://mui.com/components/modal/#BasicModal.tsx
      <MuiDialog
        aria-describedby="alert-dialog-description"
        aria-labelledby="alert-dialog-title"
        open={this.props.open}
        onClose={this.props.onClose}
      >
        <DialogTitle id="alert-dialog-title">{this.props.header}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{this.props.description}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onDisagree}>Disagree</Button>
          {this.props.onAgreeRedirectTo ? (
            <Link style={{ textDecoration: 'none' }} to={this.props.onAgreeRedirectTo}>
              <Button onClick={this.props.onAgree}>Agree</Button>
            </Link>
          ) : (
            <Button onClick={this.props.onAgree}>Agree</Button>
          )}
        </DialogActions>
      </MuiDialog>
    );
  }
}
