import React, {Component} from 'react';
import less from './demo.less';
import * as THREE from 'three';
import OBJLoaderHelp from './OBJLoader.js';

OBJLoaderHelp.setOBJLoader(THREE);

class page extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.renderer = {};
        this.camera = {};
        this.scene = {};
        this.light = {};
        this.mesh = {};

        this.dec = 1;
    }


    componentDidMount() {
        setTimeout(() => {
            this.paintChart();
        }, 0);
    }


    render() {
        return (
            <div ref={(wall) => {
                this.wall = wall;
            }} className={less.mainPage}>
            </div>
        );
    }

    initThree() {
        let width = 800;
        let height = 800;
        let renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        renderer.setSize(width, height);
        this.wall.appendChild(renderer.domElement);
        renderer.setClearColor('#d6ffd4', 1.0);

        this.renderer = renderer;
    }

    initCamera() {
        let camera = new THREE.PerspectiveCamera(40, 1, 1, 10000);
        camera.position.x = 3;
        camera.position.y = 20;
        camera.position.z = 2;
        camera.up.x = 0;
        camera.up.y = 0;
        camera.up.z = 1;
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        this.camera = camera;
    }

    initScene() {
        this.scene = new THREE.Scene();
    }

    initLight() {
        let light = new THREE.DirectionalLight('#0000ff', 1.0, 0);
        light.position.set(100, 100, 200);
        this.light = light;
        this.scene.add(this.light);
    }

    initObject() {
        let loader = new THREE.OBJLoader();

        loader.load('http://192.168.8.14:3000/threejs/modules/threeTest.obj', (obj) => {
            obj.name = 'newMesh';
            this.scene.add(obj);
            this.renderer.clear();
            this.renderer.render(this.scene, this.camera);
            this.animate();
        });

    }


    animate() {
        //Todo
        let module = this.scene.getObjectByName('newMesh');
        if(module&&module.rotation){
            module.rotation.x = module.rotation.x +0.1;
            module.rotation.y = module.rotation.y +0.02;
            module.rotation.z = module.rotation.z +0.05;
        }

        this.renderer.clear();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => {
            this.animate();
        });
    }

    paintChart() {
        this.initThree();
        this.initCamera();
        this.initScene();
        this.initLight();
        this.initObject();
    }

}

page.contextTypes = {
    router: React.PropTypes.object
};
module.exports = page;