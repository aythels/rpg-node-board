import './styles.css';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { PureComponent } from 'react';

export default class Home extends PureComponent {
  render(): JSX.Element {
    return (
      <div className="wrapper">
        <div>Welcome</div>
        <Link to="dummy">
          <Button variant="outlined">Let&apos;s play!</Button>
        </Link>
      </div>
    );
  }
}
