
import { LensSharp } from '@mui/icons-material';
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
    this.renderCallbacks = [];
    this.scale = 1;

    /*
    function repeatOften() {
      // Do whatever
      console.log("hi");
      requestAnimationFrame(repeatOften);
    }
    requestAnimationFrame(repeatOften);
*/
    
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

      if (e.deltaY < 0) _this.setScale(_this.scale + tolerance, e.clientX, e.clientY);
      else if (e.deltaY > 0) _this.setScale(_this.scale - tolerance, e.clientX, e.clientY);

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
      /*
      animate(finalX, finalY, 0, 0, (x, y) => {
        _this.setAllPos(x, y);
      });
      */
      _this.setAllPos(0, 0);

      /*
      _this.addAllPos(-finalX, -finalY);
      finalX = 0;
      finalY = 0;
      */
    }

    /* UTILITY */

    this.setScale = function (newScale, mouseX, mouseY) {
      const offSetOld = (1 / _this.scale) - 1;
      _this.addAllPos(-(offSetOld * mouseX), -(offSetOld * mouseY));

      console.log(newScale);
      if (newScale > 0.5 && newScale < 2) _this.scale = newScale; 

     const offSetNew = (1 / _this.scale) - 1;
     _this.addAllPos(offSetNew * mouseX, offSetNew * mouseY);

     state.setState({});
    }

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

    this.setAllPos = function (xPos, yPos) {
      for (let i = 0; i < _this.allNodes.length; i++) {
        const node = _this.allNodes[i];
    
        node.xPos -= finalX;
        node.yPos -= finalY;
      }

      finalX = xPos;
      finalY = xPos;

      state.setState({});
    }

    this.getFinalX = function () {
      return finalX;
    }

    this.getFinalY = function () {
      return finalY;
    }

}


function animate(x, y, newX, newY, c) {
  
  const sens = 0.05;

  function tick() {
    x = lerp(x, newX, sens);
    y = lerp(y, newY, sens);

    c(x, y);
  }

  function lerp (start, end, amt){
    //https://codepen.io/ma77os/pen/KGIEh
    return (1-amt)*start+amt*end
  }

  const callback = () => {
    if ((x + sens > newX) && (y + sens > newY)) return;

    tick()
    window.requestAnimationFrame(callback);
    console.log(x, y, newX, newY);
  }

  window.requestAnimationFrame(callback);
}

