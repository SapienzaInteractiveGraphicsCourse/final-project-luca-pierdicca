function initCamera(){

	const fov = 75;
	const aspect = window.innerWidth / window.innerHeight; // the canvas default
	const near = 0.1;
	const far = 400;
	let camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	camera.position.set(0, 15, 50);
	camera.lookAt(0, 0, 0);

	return camera

}