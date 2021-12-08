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
  let scale = 1;

  const componentToUpdate: any[] = [];

  //----------------------------------------------------------------------States

  this.getSnapshot = () => {
    return {
      allNodes: allNodes,
      finalX: finalX,
      finalY: finalY,
      scale: scale,
    };
  };

  this.update = () => {
    componentToUpdate.forEach((callback) => callback());
  };

  this.addComponentToUpdate = (callback: any) => {
    componentToUpdate.push(callback);
  };

  this.removeComponentToUpdate = (callback: any) => {
    const index = componentToUpdate.indexOf(callback);
    if (index !== -1) componentToUpdate.splice(index, 1);
  };

  this.appendData = (data: any) => {
    allNodes = [];

    data.forEach((node: Node) => {
      allNodes.push({
        _id: node._id,
        node: node,
        width: nodeWidth,
        height: nodeHeight,
        x: node.x,
        y: node.y,
      });
    });

    this.update();
  };

  //----------------------------------------------------------------------Events

  this.deleteNode = (_id: string) => {
    const node = allNodes.find((node) => node._id === _id);
    if (node) allNodes.splice(allNodes.indexOf(node), 1);

    this.update();
  };

  this.addNode = (node: Node) => {
    allNodes.unshift({
      _id: node._id,
      node: node,
      width: nodeWidth,
      height: nodeHeight,
      x: node.x,
      y: node.y,
    });

    this.update();
  };

  this.onPress = (e: MouseEvent) => {
    isMouseDown = true;
    startX = e.clientX;
    startY = e.clientY;

    setActiveNode(hoverNode);

    this.update();
  };

  this.onMove = (e: MouseEvent) => {
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

  this.onRelease = (e: MouseEvent) => {
    isMouseDown = false;

    setActiveNode(null);
  };

  this.onWheel = (e: WheelEvent) => {
    const tolerance = 0.1;

    if (e.deltaY < 0) setScale(scale + tolerance, e.clientX, e.clientY);
    else if (e.deltaY > 0) setScale(scale - tolerance, e.clientX, e.clientY);

    this.update();
  };

  this.centerNode = (_id: string) => {
    const node = allNodes.find((node) => node._id === _id);
    if (node) {
      const deltaX = finalX - node.x;
      const deltaY = finalY - node.y;

      animate(finalX, finalY, deltaX, deltaY, (x: number, y: number) => {
        setAllPos(x, y);
        this.update();
      });
    }
  };

  this.centerCanvas = () => {
    animate(finalX, finalY, 0, 0, (x: number, y: number) => {
      setAllPos(x, y);
      this.update();
    });
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

  const setScale = (newScale: number, mouseX: number, mouseY: number) => {
    const offSetOld = 1 / scale - 1;
    addAllPos(-offSetOld * (mouseX - window.innerWidth / 2), -offSetOld * (mouseY - window.innerHeight / 2));

    if (newScale > 0.5 && newScale < 2) scale = newScale;

    const offSetNew = 1 / scale - 1;
    addAllPos(offSetNew * (mouseX - window.innerWidth / 2), offSetNew * (mouseY - window.innerHeight / 2));
  };

  const setAllPos = (x: number, y: number) => {
    // TODO Add restrictions here

    const deltaX = finalX - x;
    const deltaY = finalY - y;

    for (const node of allNodes) {
      node.x -= deltaX;
      node.y -= deltaY;
    }

    finalX = x;
    finalY = y;
  };
};

function lerp(start: number, end: number, amt: number) {
  // https://codepen.io/ma77os/pen/KGIEh
  return (1 - amt) * start + amt * end;
}

function animate(x1: number, y1: number, x2: number, y2: number, callback: any) {
  const sens = 0.1;
  const tols = 3;

  const tick = () => {
    if (Math.abs(x1 - x2) + Math.abs(y1 - y2) < tols) {
      callback(x2, y2);
      return;
    }
    x1 = lerp(x1, x2, sens);
    y1 = lerp(y1, y2, sens);
    callback(x1, y1);
    window.requestAnimationFrame(tick);
  };

  window.requestAnimationFrame(tick);
}

const nodeManager = new (NodeManager as any)();

export default nodeManager;
