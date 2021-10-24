import './nodeview.css';
import { Component } from 'react';
// import ReactQuill from 'react-quill';
import Subnode from '../Subnode/subnode';
import { uid } from 'react-uid';
import { ButtonGroup, Button } from '@mui/material';

// Icons
import EditIcon from '@mui/icons-material/Edit';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';

interface Props {
  node_id: null;
  user: string;
}

interface State {
  node_id: null;
  image: string;
  name: string;
  subnodes: Array<string>; // TODO: replace with Array<Subnode>
  user: string;
}

export default class NodeView extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      node_id: props.node_id,
      image: '/images/sky.jpg',
      name: 'The Soaring Skies',
      subnodes: ['Description', 'Events', 'Player Notes'],
      user: props.user,
    };
  }

  renderSubnodes = (): JSX.Element => {
    const subnodes = this.state.subnodes;
    return (
      <div className="subnodes">
        {subnodes.map((subnode) => (
          <Subnode subnode={null} name={subnode} key={uid(subnode)} />
        ))}
      </div>
    );
  };

  render(): JSX.Element {
    const { image, name } = this.state;
    return (
      <div className="node">
        <div className="node-header">
          <div className="node-topline">
            <p>{name}</p>
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
          <img className="node-header-image" src={image} alt="sky"></img>
        </div>
        {this.renderSubnodes()}
      </div>
    );
  }
}
