import * as THREE from './node_modules/three/build/three.module.js'

import Stats from './node_modules/three/examples/jsm/libs/stats.module.js'

import {EffectComposer} from './node_modules/three/examples/jsm/postprocessing/EffectComposer.js'
import {RenderPass} from './node_modules/three/examples/jsm/postprocessing/RenderPass.js'
import {UnrealBloomPass} from './node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js'

const CONTAINER = document.querySelector('#main-container')

const renderer = new THREE.WebGLRenderer( {antialias: true} )
renderer.setClearColor( 0x0000ff, 0.03 )
renderer.autoClear = false
renderer.setPixelRatio( window.devicePixelRatio )
renderer.setSize( window.innerWidth, window.innerHeight )
renderer.toneMapping = THREE.ReinhardToneMapping
CONTAINER.appendChild( renderer.domElement )

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(

    60,
    window.innerWidth / window.innerHeight,
    1,
    200

)
camera.position.set( 0, 3, 10 )
camera.layers.enable( 1 )
camera.lookAt( scene.position )

const HELPERS_INIT = () => {

    const stats = new Stats()
    CONTAINER.appendChild( stats.dom )

    const size = 10;
    const divisions = 10;

    const gridHelper = new THREE.GridHelper( size, divisions )
    scene.add( gridHelper )

    return {

        stats

    }

}

const HELPERS = HELPERS_INIT()

const NEON_INIT = () => {

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

    return {

        composer

    }

}

const NEON = NEON_INIT()

const SCENE_OBJECTS_INIT = () => {

    const geometry = new THREE.BoxGeometry( 0.2, 0.2, 2 )

    const material = new THREE.MeshBasicMaterial( {color: 'purple'} )

    const cube1 = new THREE.Mesh( geometry, material )
    cube1.position.set( 1, 2, 0 )
    cube1.layers.set(0)
    scene.add(cube1)

    const cube2 = new THREE.Mesh( geometry, material )
    cube2.position.set( -1, 2, 0 )
    cube2.layers.set(1)
    scene.add(cube2)

    const cube3 = new THREE.Mesh( geometry, material )
    cube3.position.set( 0, 4, 0 )
    cube3.layers.enable(0)
    cube3.layers.enable(1)
    scene.add(cube3)

    return {

        cube1,
        cube2,
        cube3

    }
}

const SCENE_OBJECTS = SCENE_OBJECTS_INIT()

function animate() {

    requestAnimationFrame( animate )

    animateCubes( {x: 0.01, y: 0.02} )

    render()

    HELPERS.stats.update()
}

window.requestAnimationFrame( animate )

function animateCubes ( {x = 0.1, y = 0.2} = {} ) {

    SCENE_OBJECTS.cube1.rotation.x += x
    SCENE_OBJECTS.cube1.rotation.y += y

    SCENE_OBJECTS.cube2.rotation.x += x
    SCENE_OBJECTS.cube2.rotation.y += y

    SCENE_OBJECTS.cube3.rotation.x += x
    SCENE_OBJECTS.cube3.rotation.y += y

}

function render () {

    camera.layers.set(1)
    NEON.composer.render()

    renderer.clearDepth()
    camera.layers.set(0)
    renderer.render(scene, camera)

}

window.onclick = () => {

    SCENE_OBJECTS.cube3.layers.toggle(1)

}
