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
          <Route exact path="/nodeviewAdmin" render={() => <NodeView node_id={4} user_id={2} />} />
          <Route exact path="/nodeviewUser" render={() => <NodeView node_id={4} user_id={1} />} />
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
