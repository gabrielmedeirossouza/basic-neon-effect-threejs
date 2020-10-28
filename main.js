import * as THREE from './node_modules/three/build/three.module.js'

import {EffectComposer} from './node_modules/three/examples/jsm/postprocessing/EffectComposer.js'
import {RenderPass} from './node_modules/three/examples/jsm/postprocessing/RenderPass.js'
import {UnrealBloomPass} from './node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js'

const renderer = new THREE.WebGLRenderer( {antialias: true} )
renderer.autoClear = false
renderer.setPixelRatio( window.devicePixelRatio )
renderer.setSize( window.innerWidth, window.innerHeight )
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.gammaInput = true
renderer.gammaOutput = true

document.body.appendChild( renderer.domElement )

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(

  60,
  window.innerWidth / window.innerHeight,
  1,
  200

)
camera.position.set( 0, 0, 5 )
camera.layers.enable( 1 )

scene.add( new THREE.AmbientLight(0x404040) )

const renderScene = new RenderPass( scene, camera )

const bloomPass = new UnrealBloomPass(

  new THREE.Vector2( window.innerWidth, window.innerHeight ),
  1.5,
  0.4,
  0.85

)
bloomPass.threshold = 0
bloomPass.strength = 5
bloomPass.radius = 0
bloomPass.renderToScreen = true

const composer = new EffectComposer( renderer )
composer.setSize( window.innerWidth, window.innerHeight )
composer.addPass( renderScene )
composer.addPass( bloomPass )

const geometry = new THREE.BoxGeometry( 0.2, 0.2, 2 )

const material = new THREE.MeshBasicMaterial( {color: 'purple'} )

const cube1 = new THREE.Mesh( geometry, material )
cube1.position.set( 1, -1, 0 )
cube1.layers.set(0)
scene.add(cube1)

const cube2 = new THREE.Mesh( geometry, material )
cube2.position.set( -1, -1, 0 )
cube2.layers.set(1)
scene.add(cube2)

const cube3 = new THREE.Mesh( geometry, material )
cube3.position.set( 0, 1, 0 )
cube3.layers.enable(0)
cube3.layers.enable(1)
scene.add(cube3)

function animate() {

  requestAnimationFrame( animate )

  cube1.rotation.x += 0.01
  cube1.rotation.y += 0.02

  cube2.rotation.x += 0.01
  cube2.rotation.y += 0.02

  cube3.rotation.x += 0.01
  cube3.rotation.y += 0.02

  camera.layers.set(1)
  composer.render()

  renderer.clearDepth()
  camera.layers.set(0)
  renderer.render(scene, camera)

}

window.requestAnimationFrame( animate )

window.onclick = () => {

  cube3.layers.toggle(1)

}
