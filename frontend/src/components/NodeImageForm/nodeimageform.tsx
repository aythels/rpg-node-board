import { Component, SyntheticEvent } from 'react';
import { GETgameById, GETnodeById, GETsubnodesByNodeId, GETuserById } from '../../mock-backend';
import { Game, Node, Subnode, User } from '../../types';

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

export default class NodeImageForm extends Component<Props, State> {
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
    this.state.submitCallback(e, node);
  };

  render(): JSX.Element {
    return (
      <div className="modal" onClick={this.handleModalClick}>
        <form onSubmit={this.handleSubmit} className="modal-content-wrapper">
          <div className="modal__body">
            <div className="modal__body__section">
              <input type="file" />
            </div>
          </div>
          <div className="modal__footer"></div>
        </form>
      </div>
    );
  }
}
