import './styles.css';
import React from 'react';

interface Props {
  backButton(): any;
  centerButton(): any;
  addButton(): any;
}

export default class CanvasToolbar extends React.Component<Props> {
  render(): JSX.Element {
    const {backButton, centerButton, addButton} = this.props;

    return (
      <div id="interface">
        <button className="btn" onClick={backButton} type="button">BACK</button>
		    <button className="btn" onClick={centerButton} type="button">CENTER</button>
		    <button className="btn" onClick={addButton} type="button">ADD</button>
      </div>
    );
  }
}
