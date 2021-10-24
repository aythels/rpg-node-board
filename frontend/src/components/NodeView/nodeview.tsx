import './nodeview.css';
import { Component } from 'react';
// import ReactQuill from 'react-quill';
import Subnode from '../Subnode/subnode';
import { uid } from 'react-uid';
import { GET_node_by_id } from '../../mock-backend';

// MUI Components
import { ButtonGroup, Button } from '@mui/material';

// Icons
import EditIcon from '@mui/icons-material/Edit';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';

interface Props {
  node_id: number;
  user: number;
}

interface State {
  node: Node;
  user: string;
}

export default class NodeView extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const node = GET_node_by_id(props.node_id);
    this.state = {
      node: node,
    };
  }

  componentDidMount = (): void => {};

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
