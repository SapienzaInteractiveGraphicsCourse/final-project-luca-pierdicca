function initControls(sl, slt, c) {
  document.onkeydown = function(e) {
    switch (e.keyCode) {
      case 37:
      slt.position.x = Math.max(slt.position.x-=0.3,-20);
      break;
      case 38:
      slt.position.z = Math.min(slt.position.z-=0.3,20);
      break;
      case 39:
      slt.position.x = Math.min(slt.position.x+=0.3,20);
      break;
      case 40:
      slt.position.z = Math.max(slt.position.z+=0.3,-20);
      break;
      case 32:
      if(spotLightOn){
        sl.intensity = 0;
        console.log('0')
        spotLightOn = false
      }
      else{
        sl.intensity = 3;
        console.log('1')
        spotLightOn = true
      }
      break;
      case 65:
      c.position.x = Math.max(c.position.x-1, -50)
      c.lookAt(0, 0, 0);
      //c.updateProjectionMatrix()
      break;
      case 68:
      c.position.x = Math.min(c.position.x+1, 50)
      c.lookAt(0, 0, 0);
      //c.updateProjectionMatrix()
      break;
      case 87:
      c.position.y = Math.min(c.position.y+1, 50)
      c.lookAt(0, 0, 0);
      //c.updateProjectionMatrix()
      break;
      case 83:
      c.position.y = Math.max(c.position.y-1, -50)
      c.lookAt(0, 0, 0);
      //c.updateProjectionMatrix()
      break;
    }
  }
}