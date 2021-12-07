import './header.css';
import { useCallback, useState, useRef, ChangeEvent, KeyboardEvent, MutableRefObject, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '@mui/styles';
import { Done, Edit, ChevronLeft, Settings, Image } from '@mui/icons-material';
import { IconButton, TextField, Theme, Tooltip, Typography, CardMedia, CardActionArea, Input } from '@mui/material';
import { setGameTitle } from '../../../state/slices/gameSlice';
import { RootState } from '../../../state/rootReducer';
import { selectIsGameMaster } from '../../../state/slices/userSlice';
import { updateGameImage } from '../../../state/slices/gameSlice';
interface Props {
  exposeSettings: boolean;
  onSettingsToggleClicked: () => void;
}

const FALLBACK_IMAGE = '/images/fallbacks/game_icon.jpeg';
const Header = (props: Props): JSX.Element => {
  const theme = useTheme<Theme>();
  const dispatch = useDispatch();

  const isGameMaster = useSelector((state: RootState) => selectIsGameMaster(state));
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState(useSelector((state: RootState) => state.game.gameInstance.title));
  const [prevTitle, setPrevTitle] = useState('');
  const game = useSelector((state: RootState) => state.game.gameInstance);

  // Handlers related to game title
  const handleTitleChanged = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    setTitle(event.target.value);
  }, []);

  const handleEditTitleClicked = useCallback((): void => {
    setPrevTitle(title);
    setEditingTitle(true);
  }, [title]);

  const handleSubmitTitle = useCallback((): void => {
    setEditingTitle(false);
    dispatch(setGameTitle(game._id, title));
  }, [game._id, title]);

  const handleCancelEdit = useCallback((): void => {
    setTitle(prevTitle);
    setEditingTitle(false);
    setPrevTitle('');
  }, [prevTitle]);

  const handleTitleTextFieldKeyPress = useCallback(
    (event: KeyboardEvent<Element>): void => {
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
    },
    [handleSubmitTitle, handleCancelEdit],
  );

  const handleImageUpload = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files?.[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        if (fileReader.result) {
          // Note: We know fileReader.result will be a string because we loaded it using readAsDataURL
          dispatch(updateGameImage(fileReader.result as unknown as string));
        } else {
          console.log('Something went wrong.');
        }
      };
      fileReader.onerror = console.error;
    }
  }, []);

  const imageInput = useRef<HTMLInputElement>(null);

  const image = useMemo(() => game.image || FALLBACK_IMAGE, [game.image]);

  return (
    <div>
      <input
        ref={imageInput}
        type="file"
        accept="image/png, image/jpeg"
        hidden
        onChange={handleImageUpload}
        aria-label="change game image"
      />
      <div className="canvas-sidebar-header" style={{ backgroundColor: theme.palette.primary.light }}>
        {isGameMaster && !editingTitle && (
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
          {props.exposeSettings ? (
            editingTitle ? (
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
              <Tooltip arrow title="Change game name">
                <CardActionArea onClick={handleEditTitleClicked}>
                  <Typography className="title" variant="h6" component="div" align="center" noWrap={true}>
                    {title}
                  </Typography>
                </CardActionArea>
              </Tooltip>
            )
          ) : (
            <Typography className="title" variant="h6" component="div" align="center" noWrap={true}>
              {title}
            </Typography>
          )}
        </div>
        <div className="button">
          {props.exposeSettings ? (
            editingTitle ? (
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
              <Tooltip arrow title="Change game image">
                <CardActionArea onClick={() => imageInput?.current?.click()}>
                  <CardMedia
                    image={image}
                    style={{ height: '3rem', width: '3rem', borderRadius: '5px' }}
                    component="img"
                    alt="Game Title"
                  />
                </CardActionArea>
              </Tooltip>
            )
          ) : (
            <CardMedia
              image={image}
              style={{ height: '3rem', width: '3rem', borderRadius: '5px' }}
              component="img"
              alt="Game Title"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
