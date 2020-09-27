// scene-------------------------------------------------------------------------
let scene = new THREE.Scene();




// renderer----------------------------------------------------------------------
const renderer = new THREE.WebGLRenderer({ antialiasing: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor("rgb(80,100,22)"); //80 100 22
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);




// camera-------------------------------------------------------------------------
let camera = initCamera()




// lights-------------------------------------------------------------------------
let lights = initLights()
for(let l of lights)
    scene.add(l)
let on = false
let spotLight = lights[1]
let spotLightTarget = lights[2]




// controls-----------------------------------------------------------------------
initControls(spotLight, spotLightTarget, camera)




// background---------------------------------------------------------------------
let background = initBackground()
background[0].scale.set(20,20,20)
background[0].position.set(0,20,-40)

background[1].scale.set(0.3,110,0.3)
background[1].position.set(0,-50,-40)

for(let b of background)
  scene.add(b)





// ground------------------------------------------------------------------------
let [ground,r] = initGround()
scene.add(ground)





// tree--------------------------------------------------------------------------
let [tree, sinks, treeData] = initTree()
scene.add(tree)

let treeTimeline = gsap.timeline({defaults:{ease:Linear.easeNone, duration:0.05}})

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
let grassGroup = []
let grassTimelineGroup = []
let grass = initFlower()

function complete(g){

  scene.attach(g.particles)
  g.particles.updateMatrixWorld(true)
  g.particles.geometry.applyMatrix4(g.particles.matrixWorld)
  g.particles.position.set(0,0,0)
  g.particles.rotation.set(0,0,0)
  g.particles.scale.set(1,1,1)

  g.bloomed=true
}

let grassClone

for(let i=0;i<500;i++){
  grassClone = THREE.SkeletonUtils.clone(grass) 
  let d = r*Math.random()
  let theta = 2*Math.PI*Math.random()
  grassClone.skeleton.bones[0].position.x = d*Math.cos(theta)//-10+(20*Math.random())
  grassClone.skeleton.bones[0].position.z = d*Math.sin(theta)//-10+(20*Math.random())
  grassClone.skeleton.bones[0].rotation.y = Math.random()*2*Math.PI
  //grassClone.skeleton.bones[0].position.x = 4

  //particles
  let particles = initParticles()
  grassClone.skeleton.bones[3].add(particles)

  let sinkmap = []
  for(let p of particles.geometry.vertices){
    [sinkIndex, sink] = sinks.sample()
    sinkmap.push(sink.center)
  }

  
  grassGroup.push({grassClone:grassClone,particles:particles,sinkmap:sinkmap,bloomed:false})

  let timeline = gsap.timeline({onComplete:complete, 
                                onCompleteParams:[grassGroup[i]],
                                paused:true})
  let s = 0.2
  timeline.to(grassClone.skeleton.bones[1].position,{y:0.4,duration:2*s,ease:Linear.easeNone},0)
      .to(grassClone.skeleton.bones[2].position,{y:0.4,duration:2*s,ease:Linear.easeNone},1*s)
      .to(grassClone.skeleton.bones[3].position,{y:0.4,duration:2*s,ease:Linear.easeOut},2*s)
      //.to(grass.skeleton.bones[0].scale,{x:0.5,z:0.5,duration:8*s},0)
      //.to(grass.skeleton.bones[1].scale,{x:1,z:1,duration:8*s},0)
      //.to(grass.skeleton.bones[2].scale,{x:1,z:1,duration:8*s},0)
      //.to(grass.skeleton.bones[3].scale,{x:1,z:1,duration:8*s},0)
      .to(grassClone.skeleton.bones[1].rotation,{z:0.2,duration:2*s},2*s)
      .to(grassClone.skeleton.bones[2].rotation,{z:0.2,duration:2*s},3*s)
      .to(grassClone.skeleton.bones[3].children[0].material,{opacity:1.0, duration:1},2*s)
  
  grassTimelineGroup.push({tl:timeline, time:0})

  scene.add(grassClone); 
}


// let helper2 = new THREE.SkeletonHelper(grassClone.skeleton.bones[0]);
// helper2.material.linewidth = 3;
// scene.add(helper2);










// rendering--------------------------------------------------------------------------------------------------
let spotDir = new THREE.Vector3()
let grassDir = new THREE.Vector3()
let p_vDir = new THREE.Vector3()

function animate() {

  //flower motion
  spotDir.subVectors(spotLightTarget.position,lights[1].position).normalize()
  for(let i=0;i<grassGroup.length;i++){
    grassDir.subVectors(grassGroup[i].grassClone.skeleton.bones[0].position,lights[1].position).normalize()
    if(Math.acos(grassDir.dot(spotDir))<=lights[1].angle && on){
      grassTimelineGroup[i].time+=0.01
      grassTimelineGroup[i].tl.time(grassTimelineGroup[i].time)
    }
  }

  //particles motion
  for(let g of grassGroup){
    if(g.bloomed){
      for(let i=0;i<g.particles.geometry.vertices.length;i++){
          
        p_vDir.subVectors(g.sinkmap[i], g.particles.geometry.vertices[i]).normalize()

        p_vDir.x += -15+(30*Math.random())
        p_vDir.y += -5+(10*Math.random())
        p_vDir.z += -15+(30*Math.random())

        p_vDir.normalize()
        p_vDir.multiplyScalar(0.25)

        g.particles.geometry.vertices[i].add(p_vDir)
        g.particles.geometry.verticesNeedUpdate = true

      }      
    }
  }

  renderer.render(scene, camera);
  
  requestAnimationFrame(animate);
  
}



animate();