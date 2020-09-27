function initFlower(){
	
	p = {ns:3, sh:2}
	let geometry = new THREE.CylinderGeometry(0.05, 0.05, p.ns*p.sh, 12, p.ns, false);


	// bones
	let bones = [];

	for(let i=0;i<p.ns+1;i++)
		bones.push(new THREE.Bone())

	bones[0].position.y = -(p.ns*p.sh)/2
	for(let i=0;i<bones.length-1;i++){
		bones[i].add(bones[i+1])
		bones[i+1].position.y = 2
	}

	let skeleton = new THREE.Skeleton(bones);

	//indices and weights
	let level_to_vertices = {}
	for(let [i,v] of geometry.vertices.entries()){
		let level = (v.y+(p.ns*p.sh)/2)/p.sh
		if(!(level in level_to_vertices)){
			level_to_vertices[level] = [new THREE.Vector4(v.x,v.y,v.z,i)]
		}
		else{
			level_to_vertices[level].push(new THREE.Vector4(v.x,v.y,v.z,i))
		}
	}


	let skinIndices = new Array(geometry.vertices.length).fill(0)
	let skinWeights = new Array(geometry.vertices.length).fill(0)
	let maxLevel = bones.length-1
	let w = 0;

	// for(let level in level_to_vertices){
	//   let l = parseInt(level)
	//   for(let v of level_to_vertices[l]){
	//     switch(l){
	//       case maxLevel:
	//           skinIndices[v.w] = new THREE.Vector4(l,0,0,0)
	//           skinWeights[v.w] = new THREE.Vector4(1,0,0,0)
	//       break;
	//       case maxLevel-1:
	//           w = (0.6*l/4)+0.1
	//           skinIndices[v.w] = new THREE.Vector4(l,l+1,0,0)
	//           skinWeights[v.w] = new THREE.Vector4(1-w,w,0,0)	
	//       break;
	//       default:
	//           w = (0.6*l/4)+0.1
	//           skinIndices[v.w] = new THREE.Vector4(l,l+1,maxLevel,0)
	//           skinWeights[v.w] = new THREE.Vector4(1-w,w/4,3*w/4,0)
	//           break;
	//     }



	//     }
	// }

	for(let level in level_to_vertices){
		let l = parseInt(level)
		for(let v of level_to_vertices[l]){
			skinIndices[v.w] = new THREE.Vector4(l,0,0,0)
			skinWeights[v.w] = new THREE.Vector4(1,0,0,0)
		}
	}

	geometry.skinIndices = skinIndices  
	geometry.skinWeights = skinWeights


	// material
    let material = new THREE.MeshPhongMaterial({
      skinning: true,
      wireframe: false,
      wireframeLinewidth : 0.3,
      side: THREE.DoubleSide,
      color: "rgb(80,130,10)"
    });


	let skinnedMesh = new THREE.SkinnedMesh(geometry, material);
	skinnedMesh.add(bones[0]);
	skinnedMesh.bind(skeleton);


	bones[0].position.y=0.01
	bones[3].position.y=0
	bones[2].position.y=0
	bones[1].position.y=0

	

	return skinnedMesh
}

function initButterfly(){

	// geometry
	let head = new THREE.SphereGeometry(0.5,8,8)
	let chest = new THREE.BoxGeometry(0.8,2,0.8)
	let body = new THREE.CylinderGeometry(0.3,0.3,2.5)
	let rwShape = new THREE.Shape()
	rwShape.lineTo(1,1)
	rwShape.lineTo(2,1)
	rwShape.lineTo(3,0)
	rwShape.lineTo(3,-1)
	rwShape.lineTo(2,-3)
	rwShape.lineTo(1,-3)
	rwShape.lineTo(1,-2)
	rwShape.lineTo(0,-1)
	rwShape.lineTo(0,0)
	let rw = new THREE.ShapeGeometry(rwShape)

	let lwShape = new THREE.Shape()
	lwShape.lineTo(-1,1)
	lwShape.lineTo(-2,1)
	lwShape.lineTo(-3,0)
	lwShape.lineTo(-3,-1)
	lwShape.lineTo(-2,-3)
	lwShape.lineTo(-1,-3)
	lwShape.lineTo(-1,-2)
	lwShape.lineTo(0,-1)
	lwShape.lineTo(0,0)
	let lw = new THREE.ShapeGeometry(lwShape)


	head.translate(0,1+0.4+0.1,0)
	body.translate(0,-2.25-0.2,0)
	lw.translate(-0.7,0.3,0)
	rw.translate(0.7,0.3,0)


	let butterflyGeometry = new THREE.Geometry()
	butterflyGeometry.merge(head)
	butterflyGeometry.merge(chest)
	butterflyGeometry.merge(body)
	butterflyGeometry.merge(lw)
	butterflyGeometry.merge(rw)


	// material 
	let material = new THREE.MeshPhongMaterial({color:'rgb(125,125,125)', 
		skinning:true,
		side:THREE.DoubleSide,})

	// skeleton
	let bones = []
	let lbl = {CoM:0,lwJ:1,rwJ:2,hJ:3,bJ:4,lw:5,rw:6,h:7,b:8}

	for(let i=0;i<9;i++)
		bones.push(new THREE.Bone())
	
	bones[lbl.CoM].add(bones[lbl.hJ])
	bones[lbl.CoM].add(bones[lbl.lwJ])
	bones[lbl.CoM].add(bones[lbl.rwJ])
	bones[lbl.CoM].add(bones[lbl.bJ])

	bones[lbl.hJ].add(bones[lbl.h])
	bones[lbl.lwJ].add(bones[lbl.lw])
	bones[lbl.rwJ].add(bones[lbl.rw])
	bones[lbl.bJ].add(bones[lbl.b])

	bones[lbl.CoM].position.set(0,0,0)
	bones[lbl.hJ].position.set(0,1,0)
	bones[lbl.lwJ].position.set(-0.4,0,0)
	bones[lbl.rwJ].position.set(0.4,0,0)
	bones[lbl.bJ].position.set(0,-1,0)

	bones[lbl.h].position.set(0,0.4+0.1,0)
	bones[lbl.lw].position.set(-1-0.3,0,0)
	bones[lbl.rw].position.set(1+0.3,0,0)
	bones[lbl.b].position.set(0,-1.25-0.2,0)

	let skeleton = new THREE.Skeleton(bones);

	//scene.add(bones[0])
	let helper = new THREE.SkeletonHelper(bones[lbl.CoM]);
	helper.material.linewidth = 2;
	scene.add(helper);

	for(let v of chest.vertices){
		chest.skinIndices.push(new THREE.Vector4(lbl.CoM,0,0,0))
		chest.skinWeights.push(new THREE.Vector4(1,0,0,0))
	}

	for(let v of head.vertices){
		head.skinIndices.push(new THREE.Vector4(lbl.h,0,0,0))
		head.skinWeights.push(new THREE.Vector4(1,0,0,0))
	}

	for(let v of lw.vertices){
		lw.skinIndices.push(new THREE.Vector4(lbl.lw,0,0,0))
		lw.skinWeights.push(new THREE.Vector4(1,0,0,0))
	}

	for(let v of rw.vertices){
		rw.skinIndices.push(new THREE.Vector4(lbl.rw,0,0,0))
		rw.skinWeights.push(new THREE.Vector4(1,0,0,0))
	}

	for(let v of body.vertices){
		body.skinIndices.push(new THREE.Vector4(lbl.b,0,0,0))
		body.skinWeights.push(new THREE.Vector4(1,0,0,0))
	}

	let a = []
	butterflyGeometry.skinIndices = a.concat(head.skinIndices,
		chest.skinIndices,
		body.skinIndices,
		lw.skinIndices,
		rw.skinIndices)

	let b = []
	butterflyGeometry.skinWeights = b.concat(head.skinWeights,
		chest.skinWeights,
		body.skinWeights,
		lw.skinWeights,
		rw.skinWeights)

	  // butterfly.skeleton.bones[1].rotation.y += 0.1*1*Math.sin(t)
	  // butterfly.skeleton.bones[1].rotation.x += 0.1*2*Math.pow(Math.sin(t-3),7)
	  // butterfly.skeleton.bones[2].rotation.y += 0.1*1*-Math.sin(t)

	  // t+=0.2



	let mesh = new THREE.SkinnedMesh(butterflyGeometry, material);

  	mesh.add(bones[lbl.CoM]);
  	mesh.bind(skeleton);
  	
  	return mesh
}


function initGround(){

	//geometry
	let r = 20
	let points = [];
	for(let i = 0; i < 21; i ++ ) 
		points.push(new THREE.Vector2( 
			r*Math.sin(i/20*Math.PI/2), 
			-r*Math.cos(i/20*Math.PI/2)));
	
	let bottom = new THREE.LatheGeometry(points,32);
	for(let i=0;i<bottom.vertices.length;i++){
		if(bottom.vertices[i].y<-1){

			let perturb = new THREE.Vector3(bottom.vertices[i].x,
											bottom.vertices[i].y,
											bottom.vertices[i].z)

			
			perturb.normalize().multiplyScalar(0.5)
			//if(Math.random() > 0.5) perturb.multiplyScalar(-1);
			bottom.vertices[i].addVectors(bottom.vertices[i], perturb)
			//bottom.vertices[i].x+= -0.5+(1*Math.random())
			bottom.vertices[i].y+= -5*Math.random()
			//bottom.vertices[i].z+= -0.5+(1*Math.random())
			bottom.verticesNeedUpdate = true
		}
	}

	let up = new THREE.CircleGeometry( r, 32 );
	up.rotateX(-Math.PI/2)

	let groundGeometry = new THREE.Geometry()
	groundGeometry.merge(bottom)
	groundGeometry.merge(up)

	//texture
	let texture = THREE.ImageUtils.loadTexture("ground.jpg")

	//material
	let material = new THREE.MeshPhongMaterial({
	skinning: false,
	wireframe: false,
	flatShading:false,
	needsUpdate: true,
	//map:texture,
	bumpMap:texture,
	bumpScale:1,
	shininess:0,
	color:"rgb(53,40,30)"})

	let mesh = new THREE.Mesh(groundGeometry,material)

	return [mesh,r]
}


function initBackground(){

	//geometry
	let sun = new THREE.CircleGeometry(1,32)
	let cyl = new THREE.CylinderGeometry(1,1,1)

	//texture
	let texture = THREE.ImageUtils.loadTexture("sun.jpg")

	//material
	let sunMaterial = new THREE.MeshPhongMaterial({
		side:THREE.DoubleSide,
		skinning: false,
		wireframe: false,
		bumpMap:texture,
		bumpScale:0.4,
		shininess:5,
		color: "rgb(120,40,30)"})

	let cylMaterial = new THREE.MeshBasicMaterial({
		skinning: false,
		wireframe: false,
		color: "rgb(10,10,10)"})

	let sunMesh = new THREE.Mesh(sun, sunMaterial)
	let cylMesh = new THREE.Mesh(cyl, cylMaterial)

	return [sunMesh, cylMesh]
}


Array.prototype.sample = function(){
	let index = Math.floor(Math.random()*this.length)
  	return [index, this[index]];
}


function initTree(){


	// tree topology data
	let N = 80 //80
	let h = 30 //40
	let axesZeroSeg = 30

	let treeData = {
		0:[{geo:0, 
			bones:[	{gen:[0,0,0],s:[0.9,0.9,0.9],r:[0,0,0],p:[0,0,0],index:0}]}]
	}

	for(let i=0;i<axesZeroSeg;i++)
		treeData[0][0].bones.push({	s:[0.98,0.98,0.98],//s:[0.9,1,0.9]
									r:[-0.2+(0.4*Math.random()),0,-0.2+(0.4*Math.random())],//r:[-0.2+(0.4*Math.random()),0,-0.2+(0.4*Math.random())]
									p:[0,1,0]}) 

	for(let i=0;i<N;i++){
		let types = Object.keys(treeData)
		types = types.map(x => parseInt(x));

		let [ipType, pType] 		= types.sample()   
		let [ipAxes, pAxes] 		= treeData[pType].sample()
		let [ipAxesGen, pAxesGen] 	= pAxes.bones.sample()
		let minTh
		if (pType==0){
			minTh = 4
		}
		else{
			minTh=2
		}

		while(ipAxesGen <= minTh || ipAxesGen == pAxes.bones.length-1)
			[ipAxesGen, pAxesGen] 	= pAxes.bones.sample()
		
		let pLevel 	= pAxesGen.l
		let cType 	= pType + 1

		if(!(cType in treeData))
			treeData[cType] = []

		let tempAxes = {geo:0, bones:[]}
		let theta_y
		for(let j=0;j<h;j++){
			if(j==0){
				if(pType == 0){ theta_y = 2*Math.PI*Math.random()}
				else{theta_y = Math.PI*Math.random()}
				
				tempAxes.bones.push({	gen:[pType,ipAxes,ipAxesGen],
										s:[0.6,0.6,0.6], //s:[0.5,1,0.5]
										r:[0,theta_y,-Math.PI/4-(Math.PI/4*Math.random())],//r:[0,theta_y,-Math.PI/4-(Math.PI/4*Math.random())]
										p:[0,0,0]})
			}
			else{
				tempAxes.bones.push({	s:[0.98,0.98,0.98], //s:[0.9,1,0.9]
										r:[-0.3+(0.6*Math.random()),0,-0.3+(0.6*Math.random())], //[-0.3+(0.6*Math.random()),0,-0.3+(0.6*Math.random())]
										p:[0,1,0]}) 
			}
		}
		treeData[cType].push(tempAxes)


	}

	//bones
	let bonesList = [new THREE.Bone()]

	for(let type in treeData){
		for(let axes of treeData[type]){
			let gen = axes.bones[0].gen
			let parent = bonesList[treeData[gen[0]][gen[1]].bones[gen[2]].index]
			for(let i=0;i<axes.bones.length;i++){
				bonesList.push(new THREE.Bone())
				axes.bones[i]['index'] = bonesList.length-1 //mapping nella lista bones
				parent.add(bonesList[axes.bones[i]['index']])
				//bonesList[axes.bones[i]['index']].scale.set(axes.bones[i].s[0],axes.bones[i].s[1],axes.bones[i].s[2])
				//bonesList[axes.bones[i]['index']].rotation.set(axes.bones[i].r[0],axes.bones[i].r[1],axes.bones[i].r[2])
				bonesList[axes.bones[i]['index']].position.set(axes.bones[i].p[0],axes.bones[i].p[1],axes.bones[i].p[2])
				parent = bonesList[axes.bones[i]['index']]
			}
		}
	}

	let skeleton = new THREE.Skeleton(bonesList)



	//create geometry and put its frame into 0,0,0
	//translate the geometry
	let n_seg 
	let h_seg = 1
	let params = {rt:0.5,rb:0.5}
	for(let type in treeData){
		for(let axes of treeData[type]){
			n_seg = axes.bones.length-1
			axes.geo = new THREE.CylinderGeometry(params.rt, params.rb, n_seg*h_seg, 10, n_seg)
			axes.geo.translate(0,n_seg*h_seg/2,0)
		}
	}


	
	//assign skinIndices and skinWeights
	//note: the geometry is in 0,0,0
	//not in its bone position
	//this is because [v.y] is used
	//to fetch from axes.bones
	for(let type in treeData){
		for(let axes of treeData[type]){
			for(let v of axes.geo.vertices){
				axes.geo.skinIndices.push(new THREE.Vector4(axes.bones[v.y].index,0,0,0))
				axes.geo.skinWeights.push(new THREE.Vector4(1,0,0,0))
			}
			
		}
	}

	//now we can translate the geometry (again)
	//to its bone position
	for(let type in treeData){
		for(let axes of treeData[type]){
			let p  = new THREE.Vector3()
			
			bonesList[axes.bones[0].index].getWorldPosition(p)
			axes.geo.translate(p.x,p.y,p.z)

		}
	}
	

	// final merged geometry
	let treeGeometry = new THREE.Geometry()
	for(let type in treeData){
		for(let axes of treeData[type]){
			treeGeometry.merge(axes.geo)
			treeGeometry.skinIndices = treeGeometry.skinIndices.concat(axes.geo.skinIndices)
			treeGeometry.skinWeights = treeGeometry.skinWeights.concat(axes.geo.skinWeights)
		}
	}
	
	//texture
	let texture = THREE.ImageUtils.loadTexture("tree.jpg")

	//material
	let material = new THREE.MeshPhongMaterial({	skinning: true,
													wireframe: false,
													wireframeLinewidth: 0.3,
													bumpMap:texture,
													bumpScale:0.2,
													shininess:5,
													color: "rgb(53,40,30)"})

	
	let mesh = new THREE.SkinnedMesh(treeGeometry,material)


  	mesh.add(bonesList[0])
  	mesh.bind(skeleton)

  	for(let type in treeData){
		for(let axes of treeData[type]){
			//let gen = axes.bones[0].gen
			//let parent = bonesList[treeData[gen[0]][gen[1]].bones[gen[2]].index]
			for(let i=0;i<axes.bones.length;i++){
				bonesList[axes.bones[i]['index']].scale.set(axes.bones[i].s[0],axes.bones[i].s[1],axes.bones[i].s[2])
				bonesList[axes.bones[i]['index']].rotation.set(axes.bones[i].r[0],axes.bones[i].r[1],axes.bones[i].r[2])
				bonesList[axes.bones[i]['index']].updateMatrix()
				bonesList[axes.bones[i]['index']].updateMatrixWorld(true)
			}
		}
	}


	let sinks = []
	let	r
	for(let type in treeData){
		if(type > 0){
			for(let axes of treeData[type]){
				let lastBonePosition_w = new THREE.Vector3(), halfBonePosition_w = new THREE.Vector3()
				bonesList[axes.bones[axes.bones.length-1]['index']].getWorldPosition(lastBonePosition_w)
				bonesList[axes.bones[Math.floor(axes.bones.length/2)]['index']].getWorldPosition(halfBonePosition_w)
				
				r = halfBonePosition_w.distanceTo(lastBonePosition_w)
				
				sinks.push({center:lastBonePosition_w, radius:r})
			}
		}
	}

	for(let type in treeData){
		for(let axes of treeData[type]){
			for(let i=0;i<axes.bones.length;i++){
				bonesList[axes.bones[i]['index']].rotation.set(0,0,0)
				bonesList[axes.bones[i]['index']].position.set(0,0,0)
				bonesList[axes.bones[i]['index']].scale.set(1,1,1)
			}
		}
	}




	return [mesh,sinks, treeData]
}


function initTreeOrig(){


	// tree topology data
	let N = 1
	let h = 10
	let axesZeroSeg = 10

	let treeData = {
		0:[{geo:0, 
			bones:[	{gen:[0,0,0],s:[1,1,1],r:[0,0,0],p:[0,0,0],index:0}]}]
	}

	for(let i=0;i<axesZeroSeg;i++)
		treeData[0][0].bones.push({	s:[0.9,1,0.9],//s:[0.9,1,0.9]
									r:[0,0,0],//r:[-0.2+(0.4*Math.random()),0,-0.2+(0.4*Math.random())]
									p:[0,1,0]}) 

	for(let i=0;i<N;i++){
		let types = Object.keys(treeData)
		types = types.map(x => parseInt(x));

		let [ipType, pType] 		= types.sample()   
		let [ipAxes, pAxes] 		= treeData[pType].sample()
		let [ipAxesGen, pAxesGen] 	= pAxes.bones.sample()
		while(ipAxesGen <= 2 || ipAxesGen == pAxes.bones.length-1)
			[ipAxesGen, pAxesGen] 	= pAxes.bones.sample()
		
		let pLevel 	= pAxesGen.l
		let cType 	= pType + 1

		if(!(cType in treeData))
			treeData[cType] = []

		let tempAxes = {geo:0, bones:[]}
		let theta_y
		for(let j=0;j<h;j++){
			if(j==0){
				if(pType == 0){ theta_y = 2*Math.PI*Math.random()}
				else{theta_y = 2*Math.PI*Math.random()}
				
				tempAxes.bones.push({	gen:[pType,ipAxes,ipAxesGen],
										s:[0.5,1,0.5], //s:[0.5,1,0.5]
										r:[1.57,0,0],//r:[0,theta_y,-Math.PI/4-(Math.PI/4*Math.random())]
										p:[0,0,0]})
			}
			else{
				tempAxes.bones.push({	s:[1,1,1], //s:[0.9,1,0.9]
										r:[0,0,0], //[-0.3+(0.6*Math.random()),0,-0.3+(0.6*Math.random())]
										p:[0,1,0]}) 
			}
		}
		treeData[cType].push(tempAxes)


	}

	//bones
	let bonesList = [new THREE.Bone()]

	for(let type in treeData){
		for(let axes of treeData[type]){
			let gen = axes.bones[0].gen
			let parent = bonesList[treeData[gen[0]][gen[1]].bones[gen[2]].index]
			for(let i=0;i<axes.bones.length;i++){
				bonesList.push(new THREE.Bone())
				axes.bones[i]['index'] = bonesList.length-1 //mapping nella lista bones
				parent.add(bonesList[axes.bones[i]['index']])
				//bonesList[axes.bones[i]['index']].scale.set(axes.bones[i].s[0],axes.bones[i].s[1],axes.bones[i].s[2])
				//bonesList[axes.bones[i]['index']].rotation.set(axes.bones[i].r[0],axes.bones[i].r[1],axes.bones[i].r[2])
				bonesList[axes.bones[i]['index']].position.set(axes.bones[i].p[0],axes.bones[i].p[1],axes.bones[i].p[2])
				parent = bonesList[axes.bones[i]['index']]
			}
		}
	}

	let skeleton = new THREE.Skeleton(bonesList)



	//create geometry and put its frame into 0,0,0
	//translate the geometry
	let n_seg 
	let h_seg = 1
	let params = {rt:2,rb:2}
	for(let type in treeData){
		for(let axes of treeData[type]){
			n_seg = axes.bones.length-1
			axes.geo = new THREE.CylinderGeometry(params.rt, params.rb, n_seg*h_seg, 10, n_seg)
			axes.geo.translate(0,n_seg*h_seg/2,0)
		}
	}


	
	//assign skinIndices and skinWeights
	//note: the geometry is in 0,0,0
	//not in its bone position
	//this is because [v.y] is used
	//to fetch from axes.bones
	for(let type in treeData){
		for(let axes of treeData[type]){
			for(let v of axes.geo.vertices){
				axes.geo.skinIndices.push(new THREE.Vector4(axes.bones[v.y].index,0,0,0))
				axes.geo.skinWeights.push(new THREE.Vector4(1,0,0,0))
			}
			
		}
	}

	//now we can translate the geometry (again)
	//to its bone position
	for(let type in treeData){
		for(let axes of treeData[type]){
			let p  = new THREE.Vector3()
			bonesList[axes.bones[0].index].getWorldPosition(p)
			console.log(p)
			axes.geo.translate(p.x,p.y,p.z)
		}
	}
	

	// final merged geometry
	let treeGeometry = new THREE.Geometry()
	for(let type in treeData){
		for(let axes of treeData[type]){
			treeGeometry.merge(axes.geo)
			treeGeometry.skinIndices = treeGeometry.skinIndices.concat(axes.geo.skinIndices)
			treeGeometry.skinWeights = treeGeometry.skinWeights.concat(axes.geo.skinWeights)
		}
	}


	//material
	let material = new THREE.MeshLambertMaterial({	skinning: true,
													wireframe: false,
													color: "rgb(53,40,30)"})

	
	let mesh = new THREE.SkinnedMesh(treeGeometry,material)


  	mesh.add(bonesList[0])
  	mesh.bind(skeleton)

  	for(let type in treeData){
		for(let axes of treeData[type]){
			//let gen = axes.bones[0].gen
			//let parent = bonesList[treeData[gen[0]][gen[1]].bones[gen[2]].index]
			for(let i=0;i<axes.bones.length;i++){
				
				//axes.bones[i]['index'] = bonesList.length-1 //mapping nella lista bones
				//parent.add(bonesList[axes.bones[i]['index']])
				bonesList[axes.bones[i]['index']].scale.set(axes.bones[i].s[0],axes.bones[i].s[1],axes.bones[i].s[2])
				bonesList[axes.bones[i]['index']].rotation.set(axes.bones[i].r[0],axes.bones[i].r[1],axes.bones[i].r[2])
				
				
				//bonesList[axes.bones[i]['index']].position.set(axes.bones[i].p[0],axes.bones[i].p[1],axes.bones[i].p[2])
				//parent = bonesList[axes.bones[i]['index']]
			}
		}
	}


	return [mesh,treeData,bonesList,treeGeometry]
}


function initParticles(){

	// geometry
	let geometry = new THREE.Geometry()

    let n = 100, r = 0.5
    let d, theta, gamma, p
    for(let i=0;i<n;i++){
    	//random spherical coord
    	d = r*Math.random()
    	theta = 2*Math.PI*Math.random()
    	gamma = 2*Math.PI*Math.random()

    	p = new THREE.Vector3().setFromSphericalCoords(d,theta,gamma)
    	geometry.vertices.push(p)
    }

    //material
    let material = new THREE.PointsMaterial({color:0xfdd7e4, size: 0.15, transparent:true, opacity:0.0})

    //mesh
    let mesh = new THREE.Points(geometry,material)

    return mesh
}


