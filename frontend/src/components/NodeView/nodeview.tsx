import './nodeview.css';
import { Component } from 'react';
// import ReactQuill from 'react-quill';
import SubnodeView from '../SubnodeView/subnodeview';
import { uid } from 'react-uid';
import { GETnodeById, GETsubnodesByNodeId, GETuserById } from '../../mock-backend';
import { Node, Subnode, User } from '../../types';

// MUI Components
import { ButtonGroup, Button } from '@mui/material';

// Icons
import EditIcon from '@mui/icons-material/Edit';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';

interface Props {
  node_id: number;
  user_id: number;
}

interface State {
  node: Node;
  user: User;
  subnodes: Array<Subnode>;
}

export default class NodeView extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const node = GETnodeById(props.node_id);
    const user = GETuserById(props.user_id);
    const subnodes = GETsubnodesByNodeId(props.node_id);
    this.state = {
      node: node,
      user: user,
      subnodes: subnodes,
    };
  }

  // componentDidMount = (): void => {};

  renderSubnodes = (): JSX.Element => {
    const subnodes = this.state.subnodes;
    return (
      <div className="subnodes">
        {subnodes.map((subnode) => (
          <SubnodeView subnode={subnode} user={this.state.user} key={uid(subnode)} />
        ))}
      </div>
    );
  };

  render(): JSX.Element {
    const node = this.state.node;
    return (
      <div className="node">
        <div className="node-header">
          <div className="node-topline">
            <p>{node.name}</p>
            <ButtonGroup>
              <Button>
                <EditIcon />
              </Button>
              <Button>
                <PeopleAltIcon />
              </Button>
              <Button>
                <InsertPhotoIcon />
              </Button>
            </ButtonGroup>
          </div>
          <img className="node-header-image" src={node.image} alt="sky"></img>
        </div>
        {this.renderSubnodes()}
      </div>
    );
  }
}
