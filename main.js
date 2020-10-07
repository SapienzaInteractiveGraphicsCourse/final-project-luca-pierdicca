// scene-------------------------------------------------------------------------
let scene = new THREE.Scene();
scene.fog = new THREE.Fog("rgb(250,250,204)", 30, 200);



// renderer----------------------------------------------------------------------
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha:true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);




// camera-------------------------------------------------------------------------
let camera = initCamera()




// lights-------------------------------------------------------------------------
let lights = initLights()
for(let l of lights)
    scene.add(l)
let spotLightOn = false
let spotLight = lights[1]
let spotLightTarget = lights[2]




// controls-----------------------------------------------------------------------
initControls(spotLight, spotLightTarget, camera)




// sun--------------------------------------------------------------------------
let sun = initSun();
scene.add(sun);





// ground------------------------------------------------------------------------
let [ground,r] = initGround()
scene.add(ground)





// tree--------------------------------------------------------------------------
let [tree, sinks, treeData] = initTree()
scene.add(tree)

let treeTimeline = gsap.timeline({defaults:{ease:Linear.easeNone, duration:0.01}})

for(let type in treeData){
  for(let axes of treeData[type]){
    for(let i=0;i<axes.bones.length-1;i++){
      treeTimeline.to(tree.skeleton.bones[axes.bones[i+1]['index']].position,
        {x:axes.bones[i+1].p[0],y:axes.bones[i+1].p[1],z:axes.bones[i+1].p[2]})
      treeTimeline.to(tree.skeleton.bones[axes.bones[i]['index']].rotation,
        {x:axes.bones[i].r[0],y:axes.bones[i].r[1],z:axes.bones[i].r[2]},'<')
      treeTimeline.to(tree.skeleton.bones[axes.bones[i]['index']].scale,
        {x:axes.bones[i].s[0],y:axes.bones[i].s[1],z:axes.bones[i].s[2]},'<')  
    }
  }
}

// scene.add(bones[0])
// let helper = new THREE.SkeletonHelper(tree.skeleton.bones[0]);
// helper.material.linewidth = 3;
// scene.add(helper);



// flowers-----------------------------------------------------------------------
let stemGroup = [];
let stemGroupTimelines = [];
let stem = initStem();

function onComplete(s) {
  scene.attach(s.particles);
  s.particles.updateMatrixWorld(true);
  s.particles.geometry.applyMatrix4(s.particles.matrixWorld);
  s.particles.position.set(0, 0, 0);
  s.particles.rotation.set(0, 0, 0);
  s.particles.scale.set(1, 1, 1);
  s.bloomed = true;
}

let stemClone;

for (let i = 0; i < 500; i++) {
  stemClone = THREE.SkeletonUtils.clone(stem);
  let d = (r - 2) * Math.random();
  let theta = 2 * Math.PI * Math.random();
  stemClone.skeleton.bones[0].position.x = d * Math.cos(theta);
  stemClone.skeleton.bones[0].position.z = d * Math.sin(theta);
  stemClone.skeleton.bones[0].rotation.y = Math.random() * 2 * Math.PI;

  //particles
  let particles = initParticles();
  stemClone.skeleton.bones[3].add(particles); // add particles to the stem tip

  let sinkmap = [];
  for (let p of particles.geometry.vertices) {
    let [sinkIndex, sink] = sinks.sample();
    sinkmap.push(sink.center);
  }

  stemGroup.push({
    stemClone: stemClone,
    particles: particles,
    sinkmap: sinkmap,
    bloomed: false
  });

  let timeline = gsap.timeline({
    onComplete: onComplete,
    onCompleteParams: [stemGroup[i]],
    paused: true
  });
  let scale = 0.2;
  timeline
    .to(
      stemClone.skeleton.bones[1].position,
      { y: 0.4, duration: 2 * scale, ease: Linear.easeNone },
      0
    )
    .to(
      stemClone.skeleton.bones[2].position,
      { y: 0.4, duration: 2 * scale, ease: Linear.easeNone },
      1 * scale
    )
    .to(
      stemClone.skeleton.bones[3].position,
      { y: 0.4, duration: 2 * scale, ease: Linear.easeOut },
      2 * scale
    )
    .to(
      stemClone.skeleton.bones[1].rotation,
      { z: 0.2, duration: 2 * scale },
      2 * scale
    )
    .to(
      stemClone.skeleton.bones[2].rotation,
      { z: 0.2, duration: 2 * scale },
      3 * scale
    )
    .to(
      stemClone.skeleton.bones[3].children[0].material,
      { opacity: 1.0, duration: 1 },
      2 * scale
    );

  stemGroupTimelines.push({ tl: timeline, time: 0 });

  scene.add(stemClone);
}

// rendering--------------------------------------------------------------------------------------------------
let spotDir = new THREE.Vector3();
let stemDir = new THREE.Vector3();
let p_v = new THREE.Vector3(),
  p_a = new THREE.Vector3(),
  p_x = new THREE.Vector3();
let delta_t = 0.05;

function animate() {
  //flowers blooming (within spotlight cone)
  spotDir.subVectors(spotLightTarget.position, lights[1].position).normalize();
  for (let i = 0; i < stemGroup.length; i++) {
    stemDir
      .subVectors(
        stemGroup[i].stemClone.skeleton.bones[0].position,
        lights[1].position
      )
      .normalize();
    if (Math.acos(stemDir.dot(spotDir)) <= lights[1].angle && spotLightOn) {
      stemGroupTimelines[i].time += 0.01;
      stemGroupTimelines[i].tl.time(stemGroupTimelines[i].time);
    }
  }

  //particles motion
  for (let s of stemGroup) {
    if (s.bloomed) {
      for (let i = 0; i < s.particles.geometry.vertices.length; i++) {
        p_x = s.particles.geometry.vertices[i];
        p_v = s.particles.geometry.velocities[i];

        p_a.subVectors(s.sinkmap[i], p_x);

        p_a.x += -30 + 60 * Math.random();
        p_a.y += -30 + 60 * Math.random();
        p_a.z += -30 + 60 * Math.random();

        p_v.addVectors(p_v, p_a.multiplyScalar(delta_t));
        p_x.addVectors(p_x, p_v.multiplyScalar(delta_t));

        s.particles.geometry.velocities[i] = p_v;
        s.particles.geometry.vertices[i] = p_x;
        s.particles.geometry.verticesNeedUpdate = true;
      }
    }
  }

  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}

animate();