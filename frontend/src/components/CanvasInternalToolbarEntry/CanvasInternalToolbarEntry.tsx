import './styles.css';
import React from 'react';

interface Props {
  node: any;
  entryDBClickCallback: () => void;
  visibleCallback: () => void;
  navigateCallback: () => void;
  closeCallback: () => void;
}

export default class CanvasInternalToolbarEntry extends React.Component<Props> {
  render(): JSX.Element {
    const { node, entryDBClickCallback, visibleCallback, navigateCallback, closeCallback } = this.props;

    return (
      <div className="toolbarEntry">
        <div className="toolbarEntry-div" onDoubleClick={entryDBClickCallback}>
          <button
            className="toolbarEntry-btn"
            id="toolbarEntry-visible-btn"
            type="button"
            onClick={() => {
              visibleCallback();
              this.setState({});
            }}
            style={{
              color: node.isVisible ? 'blue' : 'white',
            }}
          >
            👁
          </button>
          <button className="toolbarEntry-btn" id="toolbarEntry-navigate-btn" onClick={navigateCallback} type="button">
            ۞
          </button>
          <button className="toolbarEntry-btn" id="toolbarEntry-close-btn" onClick={closeCallback} type="button">
            ✖
          </button>
          <span id="toolbarEntry-name">{node.dataNode.name}</span>
        </div>
      </div>
    );
  }
}
