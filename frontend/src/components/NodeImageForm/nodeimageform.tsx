import { DeleteForever, SaveRounded } from '@mui/icons-material';
import { Button, Tooltip } from '@mui/material';
import cloneDeep from 'lodash.clonedeep';
import { ChangeEvent, SyntheticEvent, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import { selectActiveNode, updateNode } from '../../state/slices/gameSlice';
import { setIsImageModalOpen } from '../../state/slices/nodeviewSlice';
import { addImage } from '../../state/slices/userSlice';
import { Node } from '../../types';
import './nodeimageform.css';

const STOCK_NODE_IMAGES = [
  '/images/stock/default.jpg',
  '/images/stock/museum.jpg',
  '/images/stock/path.jpg',
  '/images/stock/sky.jpg',
  '/images/stock/stgeorge.jpg',
];
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
    dispatch(updateNode(game._id, tempNode)); // TODO: async
    dispatch(setIsImageModalOpen(false));
  };

  const handleImageUpload = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files?.[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        if (fileReader.result) {
          // Note: We know fileReader.result will be a string because we loaded it using readAsDataURL
          const image = fileReader.result as unknown as string;
          dispatch(addImage(image));
        } else {
          console.log('Something went wrong.');
        }
      };
      fileReader.onerror = console.error;
    }
  }, []);

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
              {user.images.map((image, idx) => (
                <img className="image-collection__image" key={idx} src={image} onClick={() => changeImage(image)} />
              ))}
            </div>
          </div>
          <div className="modal__body__section">
            <h4>Stock Images</h4>
            <div className="image-collection">
              {STOCK_NODE_IMAGES.map((path, idx) => (
                <img className="image-collection__image" key={idx} src={path} onClick={() => changeImage(path)} />
              ))}
            </div>
          </div>
          <div className="modal__body__section">
            <h4>Upload New Image</h4>
            <div className="upload-new-image">
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleImageUpload}
                aria-label="add own image"
              />
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
