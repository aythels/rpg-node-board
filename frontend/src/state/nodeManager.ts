import { ConstructionOutlined } from '@mui/icons-material';
import { Node } from '../types';

interface CanvasNode {
  _id: string;
  node: Node;
  width: number;
  height: number;
  x: number;
  y: number;
}

const NodeManager = function (this: any) {
  const xBound = 2000;
  const yBound = 2000;
  const nodeWidth = 200;
  const nodeHeight = 200;

  let allNodes: CanvasNode[] = [];
  let activeNode: CanvasNode | null = null;
  let hoverNode: CanvasNode | null = null;

  let isMouseDown = false;
  let startX = 0;
  let startY = 0;
  let finalX = 0;
  let finalY = 0;
  const scale = 1;

  const componentToUpdate: any[] = [];

  //----------------------------------------------------------------------States

  this.getSnapshot = () => {
    return {
      allNodes: allNodes,
      finalX: finalX,
      finalY: finalY,
      scale: 1,
    };
  };

  this.update = () => {
    componentToUpdate.forEach((callback) => callback());
  };

  this.addComponentToUpdate = (callback: any) => {
    componentToUpdate.push(callback);
  };

  this.appendData = (data: any) => {
    allNodes = [];

    data.forEach((node: Node) => {
      console.log(node.x);
      allNodes.push({
        _id: node._id,
        node: node,
        width: nodeWidth,
        height: nodeHeight,
        x: 100,
        y: 100,
      });
    });

    this.update();
  };

  //----------------------------------------------------------------------Events

  this.onPress = (e: React.MouseEvent<HTMLInputElement>) => {
    isMouseDown = true;
    startX = e.clientX;
    startY = e.clientY;

    setActiveNode(hoverNode);

    this.update();
  };

  this.onMove = (e: React.MouseEvent<HTMLInputElement>) => {
    const cNode = allNodes.find((node) => node._id == (e.target as HTMLDivElement).getAttribute('node-id'));
    if (cNode) hoverNode = cNode;
    else hoverNode = null;

    if (!isMouseDown) return;

    const deltaX = (e.clientX - startX) * (1 / scale);
    const deltaY = (e.clientY - startY) * (1 / scale);

    if (activeNode) addNodePos(deltaX, deltaY, activeNode);
    else addAllPos(deltaX, deltaY);

    startX = e.clientX;
    startY = e.clientY;

    this.update();
  };

  this.onRelease = (e: React.MouseEvent<HTMLInputElement>) => {
    isMouseDown = false;

    setActiveNode(null);
  };

  //---------------------------------------------------------------------Utility

  const setActiveNode = (node: CanvasNode | null) => {
    activeNode = node;

    if (node !== null) {
      allNodes.splice(allNodes.indexOf(node), 1);
      allNodes.unshift(node);
    }
  };

  const addNodePos = (xDelta: number, yDelta: number, node: CanvasNode) => {
    const limitX = xBound + window.innerWidth - nodeWidth / 2;
    const limitY = yBound + window.innerHeight - nodeHeight / 2;

    if (node.x - finalX + xDelta > limitX) xDelta = limitX - (node.x - finalX);
    if (node.x - finalX + xDelta < -limitX) xDelta = -limitX - (node.x - finalX);
    if (node.y - finalY + yDelta > limitY) yDelta = limitY - (node.y - finalY);
    if (node.y - finalY + yDelta < -limitY) yDelta = -limitY - (node.y - finalY);

    node.x += xDelta;
    node.y += yDelta;
  };

  const addAllPos = (xDelta: number, yDelta: number) => {
    if (finalX + xDelta > xBound) xDelta = xBound - finalX;
    if (finalX + xDelta < -xBound) xDelta = -xBound - finalX;
    if (finalY + yDelta > yBound) yDelta = yBound - finalY;
    if (finalY + yDelta < -yBound) yDelta = -yBound - finalY;

    finalX += xDelta;
    finalY += yDelta;

    for (const node of allNodes) addNodePos(xDelta, yDelta, node);
  };
};

const nodeManager = new (NodeManager as any)();

export default nodeManager;
