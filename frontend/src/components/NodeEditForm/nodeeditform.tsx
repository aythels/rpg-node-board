import { DeleteForever, SaveRounded, Menu } from '@mui/icons-material';
import { Button, Tooltip } from '@mui/material';
import { cloneDeep } from 'lodash';
import { SyntheticEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uid } from 'react-uid';
import { RootState } from '../../state/rootReducer';
import { selectActiveNode, updateNode } from '../../state/slices/gameSlice';
import { setIsEditModalOpen } from '../../state/slices/nodeviewSlice';
import { Node, Subnode } from '../../types';
import './nodeeditform.css';

const NodeEditForm = (): JSX.Element => {
  const dispatch = useDispatch();

  const game = useSelector((state: RootState) => state.game.gameInstance);
  const node: Node = useSelector((state: RootState) => selectActiveNode(state));
  const [tempNode, setTempNode] = useState(cloneDeep(node));

  const handleModalClick = (e: SyntheticEvent): void => {
    const target = e.target as HTMLElement;
    if (target.className == 'modal') {
      dispatch(setIsEditModalOpen(false));
    }
  };

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    if (validate()) {
      dispatch(updateNode(game._id, tempNode));
      dispatch(setIsEditModalOpen(false));
    } else {
      console.log('Validation failed.');
    }
  };

  const handleNameChange = (e: SyntheticEvent): void => {
    const target = e.target as HTMLInputElement;
    setTempNode({ ...tempNode, name: target.value });
  };

  const validate = (): boolean => {
    let validation = true;
    validation = validation ? validateName(tempNode.name) : false;
    validation = validation ? validateType(tempNode.type) : false;
    return validation;
  };

  const validateType = (type: string): boolean => {
    // Validation: Not empty string
    return type != '';
  };

  const validateName = (name: string): boolean => {
    // TODO: add redux uniqueness validation
    // Validation: Not empty string
    return name != '';
  };

  const handleTypeChange = (e: SyntheticEvent): void => {
    const target = e.target as HTMLInputElement;
    setTempNode({ ...tempNode, type: target.value }); // TODO: setup Type enum
  };

  // TODO: allow subnode reorganization via dragging

  return (
    <div className="custom-modal" onClick={handleModalClick}>
      <form onSubmit={handleSubmit} className="modal-content-wrapper">
        <div className="modal__body">
          <div className="modal__body__section">
            <div className="input-line-wrapper">
              <span className="input-label">Title</span>
              <input type="text" value={tempNode.name} onChange={handleNameChange}></input>
            </div>
            <div className="input-line-wrapper">
              <span className="input-label">Type</span>
              <input type="text" value={tempNode.type} onChange={handleTypeChange}></input>
            </div>
          </div>
          <div className="modal__body__section">
            <h4>Subnodes</h4>
            <div className="subnode-organization-menu">
              {tempNode.subnodes.map((subnode: Subnode) => {
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
              <Button color="error" variant="contained" onClick={() => dispatch(setIsEditModalOpen(false))}>
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
};

export default NodeEditForm;
