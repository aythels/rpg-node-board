import './playerCard.css';
import { Avatar, IconButton, Tooltip, Typography } from '@mui/material';
import { Person, PersonOutline, PersonRemove } from '@mui/icons-material';
import { User } from '../../../types';
interface Props {
  user: User;
  exposeSettings: boolean;
  promotable: boolean;
  removable: boolean;
  // TODO: the above should stay
  onRemovePlayerClicked: () => void;
  onPromotePlayerClicked: () => void;
  onDemotePlayerClicked: () => void;
}

const PlayerCard = (props: Props): JSX.Element => {
  const { exposeSettings, promotable, removable, user } = props;

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
          onClick={promotable ? props.onPromotePlayerClicked : props.onDemotePlayerClicked}
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
            <IconButton color="error" aria-label="Remove player" component="span" onClick={props.onRemovePlayerClicked}>
              <PersonRemove />
            </IconButton>
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export default PlayerCard;
