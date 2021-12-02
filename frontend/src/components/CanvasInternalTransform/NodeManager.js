/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-this-alias */
import { uid } from 'react-uid';
import { store } from '../../state/';
import { activateNode, updateNodePos } from '../../state/slices/gameSlice';
import { setCanvasPos, setCanvasScale } from '../../state/slices/nodeviewSlice';

export const NodeManager = function () {
  const xBound = 2000;
  const yBound = 2000;
  this.nodeWidth = 200;
  this.nodeHeight = 200;

  let activeNode = null;
  let hoverNode = null;

  let isMouseDown = false;
  let startX = 0;
  let startY = 0;

  /* INPUT */
  this.onPress = (e) => {
    isMouseDown = true;
    startX = e.clientX;
    startY = e.clientY;

    setActiveNode(hoverNode);
  };

  this.onRelease = (e) => {
    isMouseDown = false;

    setActiveNode(null);
  };

  this.onMove = (e) => {
    hoverNode = store.getState().game.gameInstance.nodes.find((node) => node.id == e.target.getAttribute('node-id'));

    if (!isMouseDown) return;

    const scale = store.getState().nodeview.canvasScale;
    const deltaX = (e.clientX - startX) * (1 / scale);
    const deltaY = (e.clientY - startY) * (1 / scale);

    if (activeNode) this.addNodePos(deltaX, deltaY, activeNode);
    else this.addAllPos(deltaX, deltaY);

    startX = e.clientX;
    startY = e.clientY;
  };

  this.onWheel = (e) => {
    /*
    const tolerance = 0.1;

    if (e.deltaY < 0) this.setScale(this.scale + tolerance, e.clientX, e.clientY);
    else if (e.deltaY > 0) this.setScale(this.scale - tolerance, e.clientX, e.clientY);*/
  };

  /* UTILITY */
  const setActiveNode = (node) => {
    activeNode = node;
    if (node) store.dispatch(activateNode(node));
  };

  /* BUTTONS */

  /*
  this.setCenter = function () {
    animate(finalX, finalY, 0, 0, (x, y) => {
      this.setAllPos(x, y);
    });
  };

  this.centerNode = function (nodeID) {
    const node = this.allNodes.find((e) => e.id == nodeID);
    const deltaX = finalX - node.xPos;
    const deltaY = finalY - node.yPos;

    animate(finalX, finalY, deltaX, deltaY, (x, y) => {
      this.setAllPos(x, y);
    });
  };*/

  /* TRANSFORMATION */
  /*
  this.setScale = (newScale, mouseX, mouseY) => {
    const offSetOld = 1 / this.scale - 1;
    this.addAllPos(-offSetOld * (mouseX - window.innerWidth / 2), -offSetOld * (mouseY - window.innerHeight / 2));

    if (newScale > 0.5 && newScale < 2) store.dispatch(setCanvasPos(newScale));

    const offSetNew = 1 / this.scale - 1;
    this.addAllPos(offSetNew * (mouseX - window.innerWidth / 2), offSetNew * (mouseY - window.innerHeight / 2));
  };*/

  this.addNodePos = (xPos, yPos, node) => {
    const finalX = store.getState().nodeview.canvasX;
    const finalY = store.getState().nodeview.canvasY;

    const limitX = xBound + window.innerWidth - this.nodeWidth / 2;
    const limitY = yBound + window.innerHeight - this.nodeHeight / 2;

    if (node.x - finalX + xPos > limitX) xPos = limitX - (node.x - finalX);
    if (node.x - finalX + xPos < -limitX) xPos = -limitX - (node.x - finalX);
    if (node.y - finalY + yPos > limitY) yPos = limitY - (node.y - finalY);
    if (node.y - finalY + yPos < -limitY) yPos = -limitY - (node.y - finalY);

    const index = store.getState().game.gameInstance.nodes.findIndex((n) => n.id === node.id);
    node = store.getState().game.gameInstance.nodes[index];

    store.dispatch(updateNodePos([node, node.x + xPos, node.y + yPos]));
  };

  this.addAllPos = (xPos, yPos) => {
    const finalX = store.getState().nodeview.canvasX;
    const finalY = store.getState().nodeview.canvasY;
    const allNodes = store.getState().game.gameInstance.nodes;

    if (finalX + xPos > xBound) xPos = xBound - finalX;
    if (finalX + xPos < -xBound) xPos = -xBound - finalX;
    if (finalY + yPos > yBound) yPos = yBound - finalY;
    if (finalY + yPos < -yBound) yPos = -yBound - finalY;

    store.dispatch(setCanvasPos([finalX + xPos, finalY + yPos]));
    for (const node of allNodes) this.addNodePos(xPos, yPos, node);
  };
};
/*
function animate(x, y, newX, newY, c) {
  const sens = 0.1;

  function tick() {
    x = lerp(x, newX, sens);
    y = lerp(y, newY, sens);

    c(x, y);
  }

  function lerp(start, end, amt) {
    //https://codepen.io/ma77os/pen/KGIEh
    return (1 - amt) * start + amt * end;
  }

  const callback = () => {
    if (Math.abs(x - newX) + Math.abs(y - newY) < 3) {
      c(newX, newY);
      return;
    }
    tick();
    window.requestAnimationFrame(callback);
  };

  window.requestAnimationFrame(callback);
}
*/
