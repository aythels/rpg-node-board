import './nodeCard.css';
import { PureComponent } from 'react';
import { IconButton, Tooltip, Typography } from '@mui/material';
import { CenterFocusStrong, Delete, Visibility, VisibilityOff } from '@mui/icons-material';

interface Props {
  caption: string;
  visible: boolean;
  onDoubleClick: () => void;
  onVisibilityToggled: () => void;
  onNavigateToNodeClicked: () => void;
  onRemoveNodeClicked: () => void;
}

export default class NodeCard extends PureComponent<Props> {
  render(): JSX.Element {
    const { visible, caption, onDoubleClick, onVisibilityToggled, onNavigateToNodeClicked, onRemoveNodeClicked } =
      this.props;

    return (
      <div className="node-card" onDoubleClick={onDoubleClick}>
        <Typography className="title" variant="body1" component="div" align="center" noWrap={true}>
          {caption}
        </Typography>
        <Tooltip arrow title={`Make node ${visible ? 'invisible' : 'visible'}`}>
          <IconButton
            style={{ marginLeft: 'auto' }}
            aria-label={`Make node ${visible ? 'invisible' : 'visible'}`}
            onClick={onVisibilityToggled}
          >
            {visible ? <Visibility /> : <VisibilityOff />}
          </IconButton>
        </Tooltip>
        <Tooltip arrow title="Navigate to node">
          <IconButton aria-label="Navigate to node" onClick={onNavigateToNodeClicked}>
            <CenterFocusStrong />
          </IconButton>
        </Tooltip>
        <Tooltip arrow title="Delete node">
          <IconButton color="warning" aria-label="Delete node" onClick={onRemoveNodeClicked}>
            <Delete />
          </IconButton>
        </Tooltip>
      </div>
    );
  }
}
