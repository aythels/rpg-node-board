import './subnodeview.css';
import { useEffect, useState } from 'react';
import Quill from 'quill';
import Delta from 'quill-delta';
import NodeLinkBlot from '../../blots/NodeLink';
import { Subnode, Node } from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import { selectActiveNode, selectVisibleNodes, updateSubnode } from '../../state/slices/gameSlice';
import { setActiveNode } from '../../state/slices/nodeviewSlice';
import { Button, Tooltip } from '@mui/material';
import { Save } from '@mui/icons-material';
import { cloneDeep } from 'lodash';

//const autosaveFrequency = 1 * 1000;

const standardEditorToolbar = [
  [
    {
      header: [1, 2, false],
    },
  ],
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote'],
  [{ script: 'sub' }, { script: 'super' }],
  [{ color: [] }, { background: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ indent: '-1' }, { indent: '+1' }],
  [{ direction: 'rtl' }],
  [{ align: [] }],
  ['image', 'code-block'],
  ['clean'],
];

NodeLinkBlot.blotName = 'nodelink';
NodeLinkBlot.tagName = 'nodelink';

Quill.register(NodeLinkBlot);

interface TextLink {
  location: number;
  length: number;
  name: string;
  id: string;
}

interface Props {
  subnode: Subnode;
}

const SubnodeView = (props: Props): JSX.Element => {
  const game = useSelector((state: RootState) => state.game.gameInstance);
  const user = useSelector((state: RootState) => state.user.userInstance);
  const nodes = useSelector((state) => selectVisibleNodes(state));
  const node: Node = useSelector((state: RootState) => selectActiveNode(state));
  const [editor, setEditor] = useState(null as Quill | null);
  const [isEditorLoaded, setIsEditorLoaded] = useState(false);
  const [change, setChange] = useState(new Delta());
  const [localSubnode, setLocalSubnode] = useState(cloneDeep(props.subnode)); // TODO: Use this
  // const [autoSaver, setAutoSaver] = useState(null as NodeJS.Timeout | null);
  const dispatch = useDispatch();

  useEffect(() => {
    loadEditor();
    // return () => {
    //   if (autoSaver) {
    //     clearInterval(autoSaver);
    //   }
    // };
  }, []);

  useEffect(() => {
    if (!isEditorLoaded) setIsEditorLoaded(true);
  }, [editor]);

  useEffect(() => {
    updateNodeTextLinks();
  }, [isEditorLoaded]);

  // useEffect(() => {
  //   console.log(change);
  // }, [change]);

  const loadEditor = (): void => {
    const readOnly = !props.subnode.editors.includes(user._id);
    const toolbar = readOnly ? false : standardEditorToolbar;

    const editor = new Quill('#editor-' + props.subnode._id, {
      modules: {
        toolbar: toolbar,
      },
      placeholder: 'Compose an epic...',
      readOnly: readOnly,
      theme: 'snow',
    });
    editor.setContents(props.subnode.content, 'api');
    editor.on('text-change', (delta) => {
      // this.setState({ change: this.state.change.compose(delta) });
      setChange(change.compose(delta));
    });
    setEditor(editor);
    // setAutoSaver(setInterval(saveEditorChanges, autosaveFrequency));
  };

  const updateNodeTextLinks = (): void => {
    if (editor) {
      // Remove outdated links
      editor.formatText(0, editor.getLength(), 'nodelink', false);

      // Add in new links:
      const currentText = editor.getText();
      const links: TextLink[] = [];
      const names = [];
      for (const node of nodes) {
        names.push(node.name);
        let nextNameInstance = currentText.indexOf(node.name, 0);
        while (nextNameInstance != -1) {
          links.push({ location: nextNameInstance, length: node.name.length, name: node.name, id: node._id });
          nextNameInstance = currentText.indexOf(node.name, nextNameInstance + 1);
        }
      }
      for (const link of links) {
        editor.formatText(link.location, link.length, 'nodelink', link.id, 'api');
      }

      // Add onclick behaviour
      const nodeLinks = document.getElementsByTagName('nodelink');
      for (const nodeLink of nodeLinks) {
        nodeLink.addEventListener('click', () => {
          const linkId = nodeLink.getAttribute('linkid');
          if (linkId) dispatch(setActiveNode(linkId));
        });
      }
    }
  };

  // TODO: Fix autosave, stop re-rendering on update
  // Idea: save contents locally in state every few seconds, only push on deliberate saves or on exit

  const saveEditorChanges = (): void => {
    if (editor) {
      const updatedSubnode = cloneDeep(props.subnode);
      updatedSubnode.content = editor.getContents();
      // TODO: write specific update contents routes + dispatch
      dispatch(updateSubnode(game._id, node._id, updatedSubnode));
      // setChange(new Delta());
      updateNodeTextLinks();
      // this.setState({ change: new Delta() }, this.updateNodeTextLinks);
    }
  };

  return (
    <div className="subnodeview">
      <div className="subnode-title">
        <h2>{props.subnode.name}</h2>
        <Tooltip title="Save Changes">
          <Button onClick={saveEditorChanges}>
            <Save />
          </Button>
        </Tooltip>
      </div>
      <div id={'editor-' + props.subnode._id} />
    </div>
  );
};

export default SubnodeView;
