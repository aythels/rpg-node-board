/* eslint-disable @typescript-eslint/no-this-alias */
import { uid } from 'react-uid';

export const NodeManager = function () {
  const _this = this;
  let isMouseDown = false;
  let activeNode = null;

  let finalX = 0;
  let finalY = 0;
  let startX = 0;
  let startY = 0;

  this.allNodes = [];
  this.renderCallbacks = [];
  this.scale = 1;

  /* INPUT */
  this.onPress = function (e) {
    // console.log(e.clientX);
    isMouseDown = true;
    startX = e.clientX;
    startY = e.clientY;

    activeNode = _this.isMouseOver(e.clientX, e.clientY);
  };

  this.onRelease = function (e) {
    isMouseDown = false;
    activeNode = null;
  };

  this.onMove = function (e) {
    if (!isMouseDown) return;

    const deltaX = (e.clientX - startX) * (1 / _this.scale);
    const deltaY = (e.clientY - startY) * (1 / _this.scale);

    if (activeNode) _this.addNodePos(deltaX, deltaY, activeNode);
    else _this.addAllPos(deltaX, deltaY);

    startX = e.clientX;
    startY = e.clientY;
  };

  this.onWheel = function (e) {
    const tolerance = 0.1;

    if (e.deltaY < 0) _this.setScale(_this.scale + tolerance, e.clientX, e.clientY);
    else if (e.deltaY > 0) _this.setScale(_this.scale - tolerance, e.clientX, e.clientY);

    _this.update();
  };

  /* BUTTONS */

  this.createNodeDefault = function () {
    _this.createNode(null, 'Untitled', null);
  };

  this.createNode = function (id, name, image) {
    const node = {};
    node.xPos = 0;
    node.yPos = 0;
    node.width = 200;
    node.height = 200;
    node.id = id == null ? uid(node) : id;
    node.name = name;
    node.image = image;

    _this.allNodes.push(node);

    _this.update();
  };

  this.removeNode = function (id) {
    const index = this.allNodes.findIndex((e) => e.id == id);
    if (index > -1) this.allNodes.splice(index, 1);

    this.update();
  };

  this.setCenter = function () {
    animate(finalX, finalY, 0, 0, (x, y) => {
      _this.setAllPos(x, y);
    });
  };

  /* UTILITY */

  this.setScale = function (newScale, mouseX, mouseY) {
    const offSetOld = 1 / _this.scale - 1;
    _this.addAllPos(-(offSetOld * mouseX), -(offSetOld * mouseY));

    // console.log(newScale);
    if (newScale > 0.5 && newScale < 2) _this.scale = newScale;

    const offSetNew = 1 / _this.scale - 1;
    _this.addAllPos(offSetNew * mouseX, offSetNew * mouseY);

    _this.update();
  };

  this.isMouseOver = function (mouseX, mouseY) {
    return _this.allNodes.find(
      (node) =>
        mouseX > node.xPos * _this.scale &&
        mouseX < _this.scale * (node.xPos + node.width) &&
        mouseY > node.yPos * _this.scale &&
        mouseY < _this.scale * (node.yPos + node.height),
    );
  };

  this.addNodePos = function (xPos, yPos, node) {
    _this.allNodes = _this.allNodes.filter((item) => item !== node);
    _this.allNodes.unshift(node);

    node.xPos += xPos;
    node.yPos += yPos;

    _this.update();
  };

  this.addAllPos = function (xPos, yPos) {
    finalX += xPos;
    finalY += yPos;

    for (const node of _this.allNodes) {
      node.xPos += xPos;
      node.yPos += yPos;
    }

    _this.update();
  };

  this.setAllPos = function (xPos, yPos) {
    const deltaX = finalX - xPos;
    const deltaY = finalY - yPos;

    for (const node of _this.allNodes) {
      node.xPos -= deltaX;
      node.yPos -= deltaY;
    }

    finalX = xPos;
    finalY = yPos;

    _this.update();
  };

  this.getFinalX = function () {
    return finalX;
  };

  this.getFinalY = function () {
    return finalY;
  };

  this.addOnUpdateEvent = function (callback) {
    _this.renderCallbacks.push(callback);
  };

  this.update = function () {
    for (const callback of _this.renderCallbacks) callback();
  };
};

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
