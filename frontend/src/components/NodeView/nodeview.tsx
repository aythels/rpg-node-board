import './nodeview.css';
import { Component } from 'react';
// import ReactQuill from 'react-quill';
import SubnodeView from '../SubnodeView/subnodeview';
import { uid } from 'react-uid';
import { GETnodeById, GETsubnodesByNodeId, GETuserById } from '../../mock-backend';
import { Node, Subnode, User } from '../../types';

// MUI Components
import { ButtonGroup, Button, Modal } from '@mui/material';

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
  editModalOpen: boolean;
  usersModalOpen: boolean;
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
      editModalOpen: false,
      usersModalOpen: false,
    };
  }

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

  handleEditModalOpen = (): void => {
    this.setState({
      editModalOpen: true,
    });
  };

  handleUsersModalOpen = (): void => {
    this.setState({
      usersModalOpen: true,
    });
  };

  handleEditModalClose = (): void => {
    this.setState({
      editModalOpen: false,
    });
  };

  handleUsersModalClose = (): void => {
    this.setState({
      usersModalOpen: false,
    });
  };

  render(): JSX.Element {
    const node = this.state.node;
    return (
      <div className="node">
        <div className="node-header">
          <div className="node-topline">
            <p>
              {node.name} &#8211; <span className="node__type">{node.type}</span>
            </p>
            <ButtonGroup>
              <Button onClick={this.handleEditModalOpen}>
                <EditIcon />
              </Button>
              <Button onClick={this.handleUsersModalOpen}>
                <PeopleAltIcon />
              </Button>
              <Button>
                <InsertPhotoIcon />
              </Button>
            </ButtonGroup>
          </div>
          <img className="node-header-image" src={node.image} alt="sky"></img>
        </div>
        <Modal open={this.state.editModalOpen} onClose={this.handleEditModalClose}>
          <p>EDIT MODAL</p>
        </Modal>
        <Modal open={this.state.usersModalOpen} onClose={this.handleUsersModalClose}>
          <p>EDIT MODAL</p>
        </Modal>
        {this.renderSubnodes()}
      </div>
    );
  }
}
