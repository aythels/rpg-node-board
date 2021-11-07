import { DeleteForever, SaveRounded } from '@mui/icons-material';
import { Button, Tooltip } from '@mui/material';
import { Component, SyntheticEvent } from 'react';
import { uid } from 'react-uid';
import { GETgameById, GETnodeById, GETsubnodesByNodeId, GETuserById, POSTuser } from '../../mock-backend';
import { Game, Node, Subnode, User } from '../../types';
import './nodeimageform.css';

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

  handleNewImageUpload = (e: SyntheticEvent): void => {
    // TODO: This will need extensive changes in phase 2
    const target = e.target as HTMLInputElement;
    console.log(target.value);
    const path = '/images/' + this.extractFakeImagePath(target.value);
    const user = this.state.user;
    user.images.push(path);
    this.setState(
      {
        user: user,
      },
      () => {
        POSTuser(this.state.user);
      },
    );
  };

  extractFakeImagePath = (path: string): string => {
    return path.slice(path.lastIndexOf('\\') + 1);
  };

  changeImage = (image: string): void => {
    const node = this.state.node;
    node.image = image;
    this.setState({
      node: node,
    });
  };

  render(): JSX.Element {
    return (
      <div className="custom-modal" onClick={this.handleModalClick}>
        <form onSubmit={this.handleSubmit} className="modal-content-wrapper --wide">
          <div className="modal__body">
            <div className="modal__body__section">
              <img className="image-preview-full" src={this.state.node.image}></img>
            </div>
            <div className="modal__body__section">
              <h4>Thumbnail</h4>
            </div>
            <div className="modal__body__section">
              <h4>Your Images</h4>
              <div className="image-collection">
                {this.state.user.images.map((image) => {
                  return (
                    <div className="image-collection__image" key={uid(image)}>
                      <img
                        src={image}
                        onClick={() => {
                          this.changeImage(image);
                        }}
                      ></img>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="modal__body__section">
              <h4>Stock Images</h4>
              <div className="image-collection">
                <div className="image-collection__image">
                  <img
                    src="/images/default.jpg"
                    onClick={() => {
                      this.changeImage('/images/default.jpg');
                    }}
                  ></img>
                </div>
              </div>
            </div>
            <div className="modal__body__section">
              <h4>Upload New Image</h4>
              <div className="upload-new-image">
                <input type="file" onChange={this.handleNewImageUpload} />
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
