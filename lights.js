function initLights(){

    let lights = []
    
    let pointLight = new THREE.PointLight(0xffffff, 14, 25, 1);
    pointLight.position.set(0, 20, 0);
    let pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);


    let spotLight = new THREE.SpotLight(0xffffff, 0);
    spotLight.angle = Math.PI / 15;
    spotLight.position.set(0, 10, 0);
    spotLight.target.position.set(0,0,0)
    let spotLightHelper = new THREE.SpotLightHelper(spotLight, 0.2);
    spotLightHelper.update()


    let directionalLight = new THREE.DirectionalLight( 0xffffff, 2 );
    directionalLight.position.set(0,20,30)
    directionalLight.target.position.set(0,0,0)
    let directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.1);
    directionalLightHelper.update()

    let directionalLightb = new THREE.DirectionalLight( 0xffffff, 2 );
    directionalLightb.position.set(0,20,-30)
    directionalLightb.target.position.set(0,100,0)
    let directionalLightHelperb = new THREE.DirectionalLightHelper(directionalLightb, 0.1);


    lights = [directionalLight, spotLight, spotLight.target ,directionalLight.target,directionalLightb]
    
    return lights

}