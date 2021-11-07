import './playerCard.css';
import { Avatar, IconButton, Tooltip, Typography } from '@mui/material';
import { Person, PersonOutline, PersonRemove } from '@mui/icons-material';
import { PureComponent } from 'react';
import { User } from '../../../types';
import { withTheme } from '@mui/styles';
import { MuiTheme } from '../../../theme';

interface Props extends MuiTheme {
  exposeSettings: boolean;
  promotable: boolean;
  removable: boolean;
  user: User;
  onRemovePlayerClicked: () => void;
  onPromotePlayerClicked: () => void;
  onDemotePlayerClicked: () => void;
}
class PlayerCard extends PureComponent<Props> {
  render(): JSX.Element {
    const { exposeSettings, promotable, removable, user } = this.props;
    return (
      <div className="canvas-sidebar-player-card">
        <Tooltip arrow placement="left" title={promotable ? 'Promote to game master' : 'Demote to regular player'}>
          <IconButton
            aria-label={
              promotable
                ? `Promote player ${user.username} to game master`
                : `Demote game master ${user.username} to regular player`
            }
            component="span"
            disabled={!exposeSettings}
            onClick={promotable ? this.props.onPromotePlayerClicked : this.props.onDemotePlayerClicked}
          >
            {promotable ? <PersonOutline /> : <Person />}
          </IconButton>
        </Tooltip>
        <Avatar color="primary" alt={user.username} src={user.profilePicture}>
          {user.username.charAt(0).toUpperCase()}
        </Avatar>
        <Typography className="name" variant="body1" component="div" noWrap={true}>
          {`@${user.username}`}
        </Typography>
        {exposeSettings && removable && (
          <div className="button">
            <Tooltip arrow placement="left" title="Remove player">
              <IconButton
                color="warning"
                aria-label="Remove player"
                component="span"
                onClick={this.props.onRemovePlayerClicked}
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

export default withTheme(PlayerCard);
