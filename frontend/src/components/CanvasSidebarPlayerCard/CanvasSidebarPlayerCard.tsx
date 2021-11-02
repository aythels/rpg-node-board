import './canvasSidebarPlayerCard.css';
import { Avatar, IconButton, Tooltip } from '@mui/material';
import { Person, PersonOutline, PersonRemove } from '@mui/icons-material';
import { PureComponent } from 'react';
import { User } from '../../types';

interface Props {
  promotable: boolean;
  removable: boolean;
  user: User;
  onRemovePlayerClicked: (user: User) => void;
  onPromotePlayerClicked: (id: number) => void;
  onDemotePlayerClicked: (id: number) => void;
}

export default class CanvasSidebarPlayerCard extends PureComponent<Props> {
  render(): JSX.Element {
    const { promotable, removable, user } = this.props;
    return (
      <div className="canvas-sidebar-player-card">
        {promotable ? (
          <Tooltip arrow placement="left" title="Promote to game master">
            <IconButton
              aria-label={`Promote player ${user.username} to game master`}
              component="span"
              onClick={() => this.props.onPromotePlayerClicked(user.id)}
            >
              <PersonOutline />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip arrow placement="left" title="Demote to regular player">
            <IconButton
              aria-label={`Demote game master ${user.username} to regular player`}
              component="span"
              onClick={() => this.props.onDemotePlayerClicked(user.id)}
            >
              <Person />
            </IconButton>
          </Tooltip>
        )}
        <Avatar>{user.username.charAt(0).toUpperCase()}</Avatar>
        <div className="canvas-sidebar-player-card__name">{`@${user.username}`}</div>
        {removable && (
          <div className="canvas-sidebar-player-card__button">
            <Tooltip arrow placement="left" title="Remove player">
              <IconButton
                aria-label="Remove player"
                component="span"
                onClick={() => this.props.onRemovePlayerClicked(user)}
              >
                <PersonRemove />
              </IconButton>
            </Tooltip>
          </div>
        )}
      </div>
    );
  }
}
