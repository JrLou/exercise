import React, {Component} from 'react';
import less from './demo.less';
import * as THREE from 'three';
// import {
//     Scene,
//     WebGLRenderer,
//     PerspectiveCamera,
//     CubeGeometry,
//     MeshBasicMaterial,
//     Mesh,
//     DirectionalLight
// } from 'three';

class page extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.renderer = {};
        this.camera = {};
        this.scene = {};
        this.light = {};
        this.mesh = {};
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

    /**
     * 绘制
     */
    // paintChart() {
    //     let scene = new THREE.Scene();
    //     let camera = new THREE.PerspectiveCamera(75, 1, 0.6, 1000);
    //     let renderer = new THREE.WebGLRenderer();
    //
    //     renderer.setSize(800, 800);
    //
    //     this.wall.appendChild(renderer.domElement);
    //
    //     let geometry = new THREE.CubeGeometry(1, 1, 1);
    //     let material = new THREE.MeshBasicMaterial({color: '#00ffff'});
    //     let cube = new Mesh(geometry, material);
    //     scene.add(cube);
    //     camera.position.z = 5;
    //
    //     let render = ()=>{
    //         requestAnimationFrame(render);
    //         cube.rotation.x += 0.01;
    //         cube.rotation.y += 0.01;
    //         renderer.render(scene,camera);
    //     };
    //
    //     render();
    // }

    initThree() {
        let width = 800;
        let height = 800;
        let renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        renderer.setSize(width, height);
        this.wall.appendChild(renderer.domElement);
        renderer.setClearColor('#ffff00', 1.0);

        this.renderer = renderer;
    }

    initCamera() {
        let camera = new THREE.PerspectiveCamera(40, 1, 100, 10000);
        camera.position.x = 0;
        camera.position.y = 1000;
        camera.position.z = 0;
        camera.up.x = 0;
        camera.up.y = 1000;
        camera.up.z = 0;
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
        let geometry = new THREE.CylinderGeometry(100,150,400);
        let material = new THREE.MeshLambertMaterial({color: 0xffffff});

        let mesh = new THREE.Mesh(geometry,material);
        // mesh.position = new THREE.Vector3(0,0,0);

        this.mesh = mesh;
        this.scene.add(this.mesh);
    }

    initGrid(){
        let helper = new THREE.GridHelper(1000,50);
        helper.setColors(0x0000ff,0x808080);
        this.scene.add(helper);
    }

    animate() {
        if(this.mesh.position.x>100){
            this.dec = -1;
        }else if(this.mesh.position.x<-100){
            this.dec = 1;
        }
        this.mesh.position.x = this.mesh.position.x + 1*this.dec;
        this.camera.fov = this.camera.fov + 0.1;
        this.camera.updateProjectionMatrix();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(()=>{this.animate();});
    }

    paintChart() {
        this.initThree();
        this.initCamera();
        this.initScene();
        this.initLight();
        this.initObject();
        this.initGrid();
        this.renderer.clear();
        this.renderer.render(this.scene, this.camera);
        this.animate();
    }

}

page.contextTypes = {
    router: React.PropTypes.object
};
module.exports = page;