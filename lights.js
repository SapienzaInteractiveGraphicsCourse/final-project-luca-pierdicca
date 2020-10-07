function initLights() {
  let lights = [];

  let pointLight = new THREE.PointLight(0xffffff, 14, 25, 1);
  pointLight.position.set(0, 20, 0);

  let spotLight = new THREE.SpotLight(0xffffff, 0);
  spotLight.angle = Math.PI / 15;
  spotLight.position.set(0, 10, 0);
  spotLight.target.position.set(0, 0, 0);

  let directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(0, 20, 30);
  directionalLight.target.position.set(0, 0, 0);

  let ambientLight = new THREE.AmbientLight(0xffffff, 0.2);

  lights = [directionalLight, spotLight, spotLight.target, ambientLight];

  return lights;
}