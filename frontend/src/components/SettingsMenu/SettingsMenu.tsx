import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, useHistory } from 'react-router-dom';
import { Avatar, Button, Grid, IconButton, Snackbar, TextField, Tooltip } from '@mui/material';
import { useState, useRef, useCallback, ChangeEvent, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import { updateUserData, UserDataUpdates } from '../../state/slices/userSlice';
import { Alert, AlertTitle } from '@mui/material';

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const MIN_PASSWORD_LENGTH = 6;
const SettingsMenu = (): JSX.Element => {
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user.userInstance);
  const history = useHistory(); //temp fix.

  const logout = async (): Promise<void> => {
    // TODO
    const request = new Request(`${process.env.REACT_APP_API_URL}/user/logout`, {
      method: 'get',
      credentials: 'include',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
    });

    fetch(request, { credentials: 'include' })
      .then(async (res) => {
        console.log('should be logged out');
        history.push('/'); //temp fix.
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [error, setError] = useState<string>('');
  const [editedUserData, setEditedUserData] = useState<
    UserDataUpdates & { secondPassword: UserDataUpdates['password'] }
  >({
    username: user.username,
    email: user.email,
    password: undefined,
    secondPassword: undefined,
    profilePicture: undefined,
  });

  const handleSubmitChanges = useCallback(() => {
    // Perform validation
    if (!editedUserData.username) {
      setError('Username must not be empty');
      return;
    }
    if (invalidEmail) {
      setError('Email invalid');
      return;
    }
    if (invalidPassword) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long`);
      return;
    }
    if (passwordsDoNotMatch) {
      setError('Passwords must match');
      return;
    }
    // TODO: handle username or email taken

    // Update database and Redux state
    const { username, email, password, profilePicture } = editedUserData;
    const updates = {
      // Conditionally set attributes that have been updated
      ...(username && username !== user.username && { username }),
      ...(email && email !== user.email && { email }),
      ...(password && password !== user.password && { password }),
      ...(profilePicture && profilePicture !== user.profilePicture && { profilePicture }),
    };
    dispatch(updateUserData(updates));
  }, [user, editedUserData]);

  const handleImageUpload = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files?.[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        if (fileReader.result) {
          // Note: We know fileReader.result will be a string because we loaded it using readAsDataURL
          const profilePicture = fileReader.result as unknown as string;
          setEditedUserData((prevData) => ({ ...prevData, profilePicture }));
        } else {
          console.log('Something went wrong.');
        }
      };
      fileReader.onerror = console.error;
    }
  }, []);

  const imageInput = useRef<HTMLInputElement>(null);

  // Input validation flags
  const invalidEmail = useMemo(() => {
    return !Boolean(editedUserData.email?.match(EMAIL_REGEX));
  }, [editedUserData.email]);

  const invalidPassword = useMemo(() => {
    return Boolean(editedUserData.password && editedUserData.password.length < MIN_PASSWORD_LENGTH);
  }, [editedUserData.password]);

  const passwordsDoNotMatch = useMemo(() => {
    return Boolean(
      (editedUserData.password || editedUserData.secondPassword) &&
        editedUserData.password !== editedUserData.secondPassword,
    );
  }, [editedUserData.password, editedUserData.secondPassword]);

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
                  <Avatar
                    color="primary"
                    alt={user.username}
                    src={editedUserData.profilePicture || user.profilePicture}
                  >
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
            error={invalidEmail}
            helperText={(invalidEmail && 'Email invalid') || (editedUserData.email !== user.email && 'Modified')}
            onChange={(event) => setEditedUserData({ ...editedUserData, email: event.target.value })}
          />
        </Grid>
        <Grid item>
          <TextField
            label="Username"
            defaultValue={user.username}
            error={!editedUserData.username}
            helperText={
              (!editedUserData.username && 'User name must not be empty') ||
              (editedUserData.username !== user.username && 'Modified')
            }
            onChange={(event) => setEditedUserData({ ...editedUserData, username: event.target.value })}
          />
        </Grid>
        <Grid item>
          <TextField
            label="New Password"
            type="password"
            error={invalidPassword}
            helperText={
              (invalidPassword && `Enter at least ${MIN_PASSWORD_LENGTH} characters`) ||
              (editedUserData.password && editedUserData.password !== user.password && 'Modified')
            }
            onChange={(event) => setEditedUserData({ ...editedUserData, password: event.target.value })}
          />
        </Grid>
        <Grid item>
          <TextField
            label="Confirm Password"
            error={passwordsDoNotMatch}
            type="password"
            helperText={passwordsDoNotMatch && 'Passwords do not match'}
            onChange={(event) => setEditedUserData({ ...editedUserData, secondPassword: event.target.value })}
          />
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleSubmitChanges}>
            Submit Changes
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="warning" onClick={logout}>
            Log Out
          </Button>
        </Grid>
      </Grid>
      <Grid item justifyContent="flex-end" />
      <div className="alert-container">
        <Snackbar
          open={Boolean(error)}
          onClose={() => setError('')}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert severity="error" onClose={() => setError('')}>
            <AlertTitle>Warning</AlertTitle>
            <p>{error}</p>
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default SettingsMenu;
