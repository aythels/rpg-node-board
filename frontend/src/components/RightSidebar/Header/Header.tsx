import './header.css';
import { ChangeEvent, KeyboardEvent, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '@mui/styles';
import { Done, Edit, ChevronLeft, Settings } from '@mui/icons-material';
import { IconButton, TextField, Theme, Tooltip, Typography } from '@mui/material';
import { setGameTitle } from '../../../state/slices/gameSlice';
import { RootState } from '../../../state/rootReducer';

interface Props {
  exposeSettings: boolean;
  isAdmin: boolean;
  onSettingsToggleClicked: () => void;
}

const Header = (props: Props): JSX.Element => {
  const theme = useTheme<Theme>();
  const dispatch = useDispatch();

  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState(useSelector((state: RootState) => state.game.gameInstance.title));
  const [prevTitle, setPrevTitle] = useState('');

  // Handlers related to game title
  const handleTitleChanged = (event: ChangeEvent<HTMLInputElement>): void => {
    setTitle(event.target.value);
  };

  const handleEditTitleClicked = (): void => {
    setPrevTitle(title);
    setEditingTitle(true);
  };

  const handleSubmitTitle = (): void => {
    setEditingTitle(false);
    dispatch(setGameTitle(title));
    // TODO: redux call
    // props.onSubmitGameTitleClicked(this.state.title);
  };

  const handleCancelEdit = (): void => {
    setTitle(prevTitle);
    setEditingTitle(false);
    setPrevTitle('');
  };

  const handleTitleTextFieldKeyPress = (event: KeyboardEvent<Element>): void => {
    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        handleSubmitTitle();
        break;
      case 'Esc': // IE/Edge specific value
      case 'Escape':
        event.preventDefault();
        handleCancelEdit();
        break;
    }
  };

  return (
    <div className="canvas-sidebar-header" style={{ backgroundColor: theme.palette.primary.light }}>
      {props.isAdmin && !editingTitle && (
        <Tooltip arrow title={props.exposeSettings ? 'Close game settings' : 'Open game settings'}>
          <IconButton
            aria-label="Close game settings"
            component="span"
            className="temp"
            onClick={props.onSettingsToggleClicked}
          >
            {props.exposeSettings ? <ChevronLeft /> : <Settings />}
          </IconButton>
        </Tooltip>
      )}
      <div className="title">
        {props.exposeSettings && editingTitle ? (
          <TextField
            fullWidth
            autoComplete="off"
            className="title"
            id="outlined-basic"
            value={title}
            variant="outlined"
            onChange={handleTitleChanged}
            onKeyDown={handleTitleTextFieldKeyPress}
          />
        ) : (
          <Typography className="title" variant="h6" component="div" align="center" noWrap={true}>
            {title}
          </Typography>
        )}
      </div>
      {props.exposeSettings && (
        <div className="button">
          {editingTitle ? (
            <Tooltip arrow title="Submit new title">
              <IconButton
                aria-label="Submit edited game name"
                component="span"
                disabled={!title}
                onClick={handleSubmitTitle}
              >
                <Done />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip arrow title="Edit game title">
              <IconButton aria-label="Edit game title" component="span" onClick={handleEditTitleClicked}>
                <Edit />
              </IconButton>
            </Tooltip>
          )}
        </div>
      )}
    </div>
  );
};

export default Header;
