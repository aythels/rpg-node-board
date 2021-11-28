import { DeleteForever, SaveRounded } from '@mui/icons-material';
import { Button, Tooltip } from '@mui/material';
import cloneDeep from 'lodash.clonedeep';
import { SyntheticEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uid } from 'react-uid';
import { RootState } from '../../state/rootReducer';
import { selectActiveNode, updateNode } from '../../state/slices/gameSlice';
import { setIsImageModalOpen } from '../../state/slices/nodeviewSlice';
import { addImage } from '../../state/slices/userSlice';
import { Node } from '../../types';
import './nodeimageform.css';

const NodeImageForm = (): JSX.Element => {
  const dispatch = useDispatch();

  const game = useSelector((state: RootState) => state.game.gameInstance);
  const user = useSelector((state: RootState) => state.user.userInstance);
  const node: Node = useSelector((state: RootState) => selectActiveNode(state));
  const [tempNode, setTempNode] = useState(cloneDeep(node));

  const handleModalClick = (e: SyntheticEvent): void => {
    const target = e.target as HTMLElement;
    if (target.className == 'modal') {
      dispatch(setIsImageModalOpen(false));
    }
  };

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    dispatch(updateNode(game.id, tempNode)); // TODO: async
    dispatch(setIsImageModalOpen(false));
  };

  const handleNewImageUpload = (e: SyntheticEvent): void => {
    // TODO: This will need extensive changes in phase 2
    const target = e.target as HTMLInputElement;
    const path = '/images/' + extractFakeImagePath(target.value);
    dispatch(addImage(path));
  };

  const extractFakeImagePath = (path: string): string => {
    return path.slice(path.lastIndexOf('\\') + 1);
  };

  const changeImage = (image: string): void => {
    setTempNode({ ...tempNode, image: image });
  };

  return (
    <div className="custom-modal" onClick={handleModalClick}>
      <form onSubmit={handleSubmit} className="modal-content-wrapper --wide">
        <div className="modal__body">
          <div className="modal__body__section">
            <img className="image-preview-full" src={tempNode.image}></img>
          </div>
          <div className="modal__body__section">
            <h4>Thumbnail</h4>
          </div>
          <div className="modal__body__section">
            <h4>Your Images</h4>
            <div className="image-collection">
              {user.images.map((image) => {
                return (
                  <div className="image-collection__image" key={uid(image)}>
                    <img
                      src={image}
                      onClick={() => {
                        changeImage(image);
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
                    changeImage('/images/default.jpg');
                  }}
                ></img>
              </div>
            </div>
          </div>
          <div className="modal__body__section">
            <h4>Upload New Image</h4>
            <div className="upload-new-image">
              <input type="file" onChange={handleNewImageUpload} />
            </div>
          </div>
        </div>
        <div className="modal__footer">
          <div>
            <Tooltip title="Discard Changes">
              <Button color="error" variant="contained" onClick={() => dispatch(setIsImageModalOpen(false))}>
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

export default NodeImageForm;
