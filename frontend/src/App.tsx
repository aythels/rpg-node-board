import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import DummyComponent from './components/DummyComponent';
import Home from './components/Home';
import NodeView from './components/NodeView/nodeview';

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
          <Route exact path="/dummy" render={() => <DummyComponent counterCaption="Increment counter" />} />
          <Route exact path="/nodeview" render={() => <NodeView node_id={null} user="Game Master" />} />
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
