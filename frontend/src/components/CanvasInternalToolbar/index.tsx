import './styles.css';
import React from 'react';

interface Props {
  onBackClicked: () => void;
  onCenterClicked: () => void;
  onAddClicked: () => void;
}

export default class CanvasInternalToolbar extends React.Component<Props> {
  render(): JSX.Element {
    const { onBackClicked, onCenterClicked, onAddClicked } = this.props;

    return (
      <div id="interface">
        <button className="btn" onClick={onBackClicked} type="button">
          BACK
        </button>
        <button className="btn" onClick={onCenterClicked} type="button">
          CENTER
        </button>
        <button className="btn" onClick={onAddClicked} type="button">
          ADD
        </button>
      </div>
    );
  }
}
