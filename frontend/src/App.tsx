import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import DummyComponent from './components/DummyComponent';
import CanvasMain from './components/CanvasMain';
import Home from './components/Home';

function App(): JSX.Element {
  const customTheme = createTheme({
    // Note: to be edited later
    palette: {},
  });

  return (
    <ThemeProvider theme={customTheme}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" render={() => <Home />} />
          <Route exact path="/canvas" render={() => <CanvasMain />} />
          <Route exact path="/dummy" render={() => <DummyComponent counterCaption="Increment counter" />} />
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
