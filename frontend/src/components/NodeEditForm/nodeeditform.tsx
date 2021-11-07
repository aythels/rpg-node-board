import { DeleteForever, SaveRounded, Menu } from '@mui/icons-material';
import { Button, Tooltip } from '@mui/material';
import { Component, SyntheticEvent } from 'react';
import { uid } from 'react-uid';
import { GETgameById, GETnodeById, GETsubnodesByNodeId, GETuserById } from '../../mock-backend';
import { Game, Node, Subnode, User } from '../../types';
import './nodeeditform.css';

interface Props {
  gameId: number;
  nodeId: number;
  userId: number;
  closeCallback: () => void;
  // eslint-disable-next-line no-unused-vars
  submitCallback: (arg0: SyntheticEvent, arg1: Node) => void;
}

interface State {
  game: Game;
  node: Node;
  user: User;
  subnodes: Subnode[];
  closeCallback: () => void;
  // eslint-disable-next-line no-unused-vars
  submitCallback: (arg0: SyntheticEvent, arg1: Node) => void;
}

export default class NodeEditForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const game = GETgameById(props.gameId);
    const node = GETnodeById(props.nodeId);
    const user = GETuserById(props.userId);
    const subnodes = GETsubnodesByNodeId(node.id);
    this.state = {
      game: game,
      node: node,
      user: user,
      subnodes: subnodes,
      closeCallback: props.closeCallback,
      submitCallback: props.submitCallback,
    };
  }

  handleModalClick = (e: SyntheticEvent): void => {
    const target = e.target as HTMLElement;
    if (target.className == 'modal') {
      this.handleClose();
    }
  };

  handleClose = (): void => {
    this.state.closeCallback();
  };

  handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    const node = this.state.node;
    this.validate() ? this.state.submitCallback(e, node) : console.log('Validation failed.');
  };

  handleNameChange = (e: SyntheticEvent): void => {
    const target = e.target as HTMLInputElement;
    const node = this.state.node;
    node.name = target.value;
    this.setState({
      node: node,
    });
  };

  validate = (): boolean => {
    const node = this.state.node;
    let validation = true;
    validation = validation ? this.validateName(node.name) : false;
    validation = validation ? this.validateType(node.type) : false;
    return validation;
  };

  validateType = (type: string): boolean => {
    // Validation: Not empty string
    return type != '';
  };

  validateName = (name: string): boolean => {
    // NOTE: we shoudl also validate names (and evrything else) server-side -- this is just for better UX
    // Validation: Not empty string
    return name != '';
  };

  handleTypeChange = (e: SyntheticEvent): void => {
    const target = e.target as HTMLInputElement;
    const node = this.state.node;
    node.type = target.value; // TODO: Change to Game.Types enum (customizable but with good default values)
    this.setState({
      node: node,
    });
  };

  // TODO: allow subnode name and type changes in this menu
  // TODO: allow subnode reorganization via dragging

  render(): JSX.Element {
    return (
      <div className="custom-modal" onClick={this.handleModalClick}>
        <form onSubmit={this.handleSubmit} className="modal-content-wrapper">
          <div className="modal__body">
            <div className="modal__body__section">
              <div className="input-line-wrapper">
                <span className="input-label">Title</span>
                <input type="text" value={this.state.node.name} onChange={this.handleNameChange}></input>
              </div>
              <div className="input-line-wrapper">
                <span className="input-label">Type</span>
                <input type="text" value={this.state.node.type} onChange={this.handleTypeChange}></input>
              </div>
            </div>
            <div className="modal__body__section">
              <h4>Subnodes</h4>
              <div className="subnode-organization-menu">
                {this.state.subnodes.map((subnode) => {
                  return (
                    <div className="subnode-organization-menu__subnode" key={uid(subnode)}>
                      <Menu />
                      <span>{subnode.name} &#8211; </span>
                      <span>
                        <i>{subnode.type}</i>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="modal__footer">
            <div>
              <Tooltip title="Discard Changes">
                <Button color="error" variant="contained" onClick={this.handleClose}>
                  <DeleteForever />
                </Button>
              </Tooltip>
            </div>
            <div>
              <Tooltip title="Save Changes">
                <Button type="submit" variant="contained" color="success">
                  <SaveRounded />
                </Button>
              </Tooltip>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
