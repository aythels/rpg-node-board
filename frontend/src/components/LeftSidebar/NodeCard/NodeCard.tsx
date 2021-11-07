import './nodeCard.css';
import { PureComponent } from 'react';
import { IconButton, Tooltip, Typography } from '@mui/material';
import { CenterFocusStrong, Delete, Visibility, VisibilityOff } from '@mui/icons-material';

interface Props {
  node: any;
  entryDBClickCallback: () => void;
  visibleCallback: () => void;
  navigateCallback: () => void;
  closeCallback: () => void;
}

export default class NodeCard extends PureComponent<Props> {
  render(): JSX.Element {
    const { node, entryDBClickCallback, visibleCallback, navigateCallback, closeCallback } = this.props;

    return (
      <div className="node-card" onDoubleClick={entryDBClickCallback}>
        <Typography className="title" variant="body1" component="div" align="center" noWrap={true}>
          {node.dataNode.name}
        </Typography>

        <Tooltip arrow title={`Make node ${node.isVisible ? 'invisible' : 'visible'}`}>
          <IconButton
            style={{ marginLeft: 'auto' }}
            aria-label={`Make node ${node.isVisible ? 'invisible' : 'visible'}`}
            onClick={() => {
              visibleCallback();
              this.setState({});
            }}
          >
            {/* TODO: get isVisible as props */}
            {node.isVisible ? <Visibility /> : <VisibilityOff />}
          </IconButton>
        </Tooltip>
        <Tooltip arrow title="Bring node into view">
          <IconButton aria-label="Bring node into view" onClick={navigateCallback}>
            <CenterFocusStrong />
          </IconButton>
        </Tooltip>
        <Tooltip arrow title="Delete node">
          <IconButton color="warning" aria-label="Delete node" onClick={closeCallback}>
            <Delete />
          </IconButton>
        </Tooltip>
      </div>
    );
  }
}
