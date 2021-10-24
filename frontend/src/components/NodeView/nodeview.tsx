import './nodeview.css';
import { Component } from 'react';
// import ReactQuill from 'react-quill';
import SubnodeView from '../SubnodeView/subnodeview';
import { uid } from 'react-uid';
import { GET_node_by_id, GET_user_by_id, Node, User, Subnode, GET_subnodes_by_node_id } from '../../mock-backend';

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
    const node = GET_node_by_id(props.node_id);
    const user = GET_user_by_id(props.user_id);
    const subnodes = GET_subnodes_by_node_id(props.node_id);
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
          <SubnodeView subnode={subnode} key={uid(subnode)} />
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
