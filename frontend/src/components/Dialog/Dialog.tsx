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
  open: boolean;
  onClose: () => void;
  onAgree?: () => void;
  onAgreeRedirectTo?: string;
  onDisagree?: () => void;
}

export default class Dialog extends PureComponent<Props> {
  render(): JSX.Element {
    const showActions = this.props.onDisagree && (this.props.onAgree || this.props.onAgreeRedirectTo);
    return (
      // Code retrieved from: https://mui.com/components/modal/#BasicModal.tsx
      <MuiDialog
        color="primary"
        aria-describedby="alert-dialog-description"
        aria-labelledby="alert-dialog-title"
        open={this.props.open}
        onClose={this.props.onClose}
        onKeyPress={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            this.props.onClose();
          }
        }}
      >
        <DialogTitle id="alert-dialog-title">{this.props.header}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{this.props.description}</DialogContentText>
        </DialogContent>
        {showActions && (
          <DialogActions>
            <Button onClick={this.props.onDisagree}>No</Button>
            {this.props.onAgreeRedirectTo ? (
              <Link style={{ textDecoration: 'none' }} to={this.props.onAgreeRedirectTo}>
                <Button onClick={this.props.onAgree}>Yes</Button>
              </Link>
            ) : (
              <Button onClick={this.props.onAgree}>Yes</Button>
            )}
          </DialogActions>
        )}
      </MuiDialog>
    );
  }
}
