
import {uid} from 'react-uid';

export const NodeManager = function(state) {
    const _this = this;  
    let isMouseDown = false;
    let activeNode = null;

    let finalX = 0;
    let finalY = 0;
    let startX = 0;
    let startY = 0;

    this.allNodes = [];
    this.scale = 1;
    
    /* INPUT */
    this.onPress = function (e)  {
        console.log(e.clientX);
        isMouseDown = true;
        startX = e.clientX;
        startY = e.clientY;

        activeNode = _this.isMouseOver(e.clientX, e.clientY);

    }
    
    this.onRelease = function (e) {
        isMouseDown = false;
        activeNode = null;
    }
    
    this.onMove = function (e) {
        if (!isMouseDown) return;

        const deltaX = (e.clientX - startX) * (1/_this.scale);
        const deltaY = (e.clientY - startY) * (1/_this.scale);

        if (activeNode) _this.addNodePos(deltaX, deltaY, activeNode);
        else _this.addAllPos(deltaX, deltaY);

        startX = e.clientX;
        startY = e.clientY;
    }

    this.onWheel = function (e) {
      const tolerance = 0.1;

      const offSetOld = (1 / _this.scale) - 1;
      _this.addAllPos(-(offSetOld * e.clientX), -(offSetOld * e.clientY));

      if (e.deltaY < 0) {
        _this.scale += tolerance; 
        console.log("wheel up");
      } else if (e.deltaY > 0) {
        _this.scale -= tolerance; 
        console.log("wheel down")
      } 

     const offSet = (1 / _this.scale) - 1;
     _this.addAllPos(offSet * e.clientX, offSet * e.clientY);
      
     state.setState({});
    }

    /* BUTTONS */
    this.createNode = function () {
      const node = {}
      node.xPos = 0;
      node.yPos = 0;
      node.width = 200;
      node.height = 200;
      node.id = uid(node);

      _this.allNodes.push(node);

      state.setState({});
    }

    this.removeNode = function (id) {
      const index = this.allNodes.findIndex(e => e.id == id)
      if (index > -1) this.allNodes.splice(index, 1);
      state.setState({});
    }

    this.setCenter = function () {
      _this.addAllPos(-finalX, -finalY);
      finalX = 0;
      finalY = 0;
    }

    /* UTILITY */

    this.isMouseOver = function(mouseX, mouseY) {
      return _this.allNodes.find(node => (
        (mouseX > (node.xPos * _this.scale)) && 
        (mouseX < _this.scale * (node.xPos + node.width)) &&
        (mouseY > (node.yPos * _this.scale)) &&
        (mouseY < _this.scale * (node.yPos + node.height))
      ));

    }

    this.addNodePos = function (xPos, yPos, node) {
      _this.allNodes = _this.allNodes.filter(item => item !== node);
      _this.allNodes.unshift(node);

      node.xPos += xPos;
      node.yPos += yPos;

      state.setState({});
    }
    
    this.addAllPos = function (xPos, yPos) {
      finalX += xPos;
      finalY += yPos;

      for (let i = 0; i < _this.allNodes.length; i++) {
        const node = _this.allNodes[i];
    
        node.xPos += xPos;
        node.yPos += yPos;
      }

      state.setState({});
    }

    this.getFinalX = function () {
      return finalX;
    }

    this.getFinalY = function () {
      return finalY;
    }

}