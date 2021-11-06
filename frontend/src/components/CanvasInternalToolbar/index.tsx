import './styles.css';
import React from 'react';

interface Props {
  onCenterClicked: () => void;
  onAddClicked: () => void;
}

interface State {
  openLeftPos: number;
  closeLeftPos: number;
  isOpen: boolean;
}

export default class CanvasInternalToolbar extends React.Component<Props, State> {
  state: State = {
    openLeftPos: 0,
    closeLeftPos: -240,
    isOpen: true,
  };

  onToggleSideBar = (): void => {
    console.log(this.state.isOpen);
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  render(): JSX.Element {
    const { onCenterClicked, onAddClicked } = this.props;

    return (
      <div
        className="wrapper"
        style={{
          left: `${this.state.isOpen ? this.state.openLeftPos : this.state.closeLeftPos}px`,
        }}
      >
        <div className="sideBar">test</div>
        <div className="interface">
          <button className="btn" onClick={onCenterClicked} type="button">
            ۞
          </button>
          <button className="btn" onClick={onAddClicked} type="button">
            +
          </button>
          <button className="btn" id="sideBarToggleButton" onClick={this.onToggleSideBar} type="button">
            {this.state.isOpen ? <span>≪</span> : <span>≫</span>}
          </button>
        </div>
      </div>
    );
  }
}
