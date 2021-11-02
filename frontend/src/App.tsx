import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import DummyComponent from './components/DummyComponent';
import CanvasMain from './components/CanvasMain';
import Home from './components/Home';
import NodeView from './components/NodeView/nodeview';

function App(): JSX.Element {
  const customTheme = createTheme({
    // Note: to be edited later
    palette: {},
  });

  const currentGameId = 7;
  const currentUserId = 2;

  return (
    <ThemeProvider theme={customTheme}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" render={() => <Home />} />
          <Route
            exact
            path="/canvas"
            render={() => <CanvasMain currentUserId={currentUserId} currentGameId={currentGameId} />}
          />
          <Route exact path="/dummy" render={() => <DummyComponent counterCaption="Increment counter" />} />
          <Route exact path="/nodeviewAdmin" render={() => <NodeView nodeId={1} userId={2} gameId={1} />} />
          <Route exact path="/nodeviewUser" render={() => <NodeView nodeId={1} userId={1} gameId={1} />} />
          {/* TODO: Figure out how to route this better */}
          <Route exact path="/nodeviewAdmin/1" render={() => <NodeView nodeId={1} userId={2} gameId={1} />} />
          <Route exact path="/nodeviewAdmin/2" render={() => <NodeView nodeId={2} userId={2} gameId={1} />} />
          <Route exact path="/nodeviewAdmin/3" render={() => <NodeView nodeId={3} userId={2} gameId={1} />} />
          <Route exact path="/nodeviewAdmin/4" render={() => <NodeView nodeId={4} userId={2} gameId={1} />} />
          <Route exact path="/nodeviewUser/1" render={() => <NodeView nodeId={1} userId={1} gameId={1} />} />
          <Route exact path="/nodeviewUser/2" render={() => <NodeView nodeId={2} userId={1} gameId={1} />} />
          <Route exact path="/nodeviewUser/3" render={() => <NodeView nodeId={3} userId={1} gameId={1} />} />
          <Route exact path="/nodeviewUser/4" render={() => <NodeView nodeId={4} userId={1} gameId={1} />} />
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
