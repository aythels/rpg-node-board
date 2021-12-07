import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Avatar, Button, Grid, IconButton, TextField, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import { useState, useRef, useCallback, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import { updateProfilePicture } from '../../state/slices/userSlice';

const SettingsMenu = (): JSX.Element => {
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user.userInstance);

  // TODO: bind this to Redux
  const [editedUserData, setEditedUserData] = useState({
    username: user.username,
    email: user.email,
    password: user.password,
    secondPassword: user.password,
  });

  const same = (): boolean => {
    return (
      editedUserData.email === user.email &&
      editedUserData.username === user.username &&
      editedUserData.password === user.password
    );
  };

  const handleImageUpload = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files?.[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        if (fileReader.result) {
          // Note: We know fileReader.result will be a string because we loaded it using readAsDataURL
          dispatch(updateProfilePicture(fileReader.result as unknown as string));
        } else {
          console.log('Something went wrong.');
        }
      };
      fileReader.onerror = console.error;
    }
  }, []);

  const imageInput = useRef<HTMLInputElement>(null);

  return (
    <div className="padded_div">
      <input
        ref={imageInput}
        type="file"
        accept="image/png, image/jpeg"
        hidden
        onChange={handleImageUpload}
        aria-label="change profile picture"
      />
      <Grid
        item
        style={{
          position: 'absolute',
          margin: '1rem',
          top: '0',
          right: '0',
        }}
      >
        <Tooltip title="Account Dashboard" placement="left">
          <Link style={{ textDecoration: 'none' }} to="/games">
            <IconButton color="primary">
              <ArrowBackIcon sx={{ fontSize: '4rem' }} />
            </IconButton>
          </Link>
        </Tooltip>
      </Grid>
      <Grid
        container
        spacing={2}
        direction="column"
        justifyContent="center"
        alignItems="center"
        // xs={6}
        style={{ minHeight: '100vh' }}
      >
        <Grid item>
          <Typography
            variant="h3"
            style={{
              fontStyle: 'italic',
              textAlign: 'center',
              width: '100%',
            }}
          >
            <Grid container columnSpacing={2} direction="row" justifyContent="center" alignItems="center">
              <Grid item>
                <div style={{ cursor: 'pointer' }} onClick={() => imageInput?.current?.click()}>
                  <Avatar color="primary" alt={user.username} src={user.profilePicture}>
                    {user.username.charAt(0).toUpperCase()}
                  </Avatar>
                </div>
              </Grid>
              <Grid item>
                <b>{user.username}</b>
              </Grid>
            </Grid>
          </Typography>
        </Grid>
        <Grid item>
          <TextField
            label="Email"
            defaultValue={user.email}
            // error={this.state.invalid}
            helperText={editedUserData.email === user.email ? '' : 'Modified'}
            // color={editedUserData.email === user.email ? 'error' : 'error'}
            // color="warning"
            // focused
            onChange={(event) => setEditedUserData({ ...editedUserData, email: event.target.value })}
          ></TextField>
        </Grid>
        <Grid item>
          <TextField
            label="Username"
            defaultValue={user.username}
            // error={this.state.invalid}
            helperText={editedUserData.username === user.username ? '' : 'Modified'}
            onChange={(event) => setEditedUserData({ ...editedUserData, username: event.target.value })}
          ></TextField>
        </Grid>
        <Grid item>
          <TextField
            label="New Password"
            // defaultValue={user.username}
            // error={this.state.invalid}
            type="password"
            helperText={editedUserData.password === user.password ? '' : 'Modified'}
            onChange={(event) => setEditedUserData({ ...editedUserData, password: event.target.value })}
          ></TextField>
        </Grid>
        <Grid item>
          <TextField
            label="Confirm Password"
            // defaultValue={user.username}
            error={editedUserData.password != editedUserData.secondPassword && editedUserData.password != user.password}
            type="password"
            helperText={editedUserData.password === editedUserData.secondPassword ? '' : 'Passwords do not match'}
            onChange={(event) => setEditedUserData({ ...editedUserData, secondPassword: event.target.value })}
          ></TextField>
        </Grid>
        <Grid item>
          <Button variant="contained" disabled={same()} color="primary">
            Submit Changes
          </Button>
        </Grid>
      </Grid>
      <Grid item justifyContent="flex-end">
        <div></div>
      </Grid>
    </div>
  );
};

export default SettingsMenu;
