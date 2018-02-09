import React, {Component} from 'react';
import less from './demo.less';
import * as THREE from 'three';

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
        this.act = 1;
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
        renderer.setClearColor('#000000', 1.0);

        this.renderer = renderer;
    }

    initCamera() {
        let camera = new THREE.PerspectiveCamera(40, 1, 100, 10000);
        camera.position.x = 0;
        camera.position.y = 200;
        camera.position.z = 200;
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

    initObject(size,transparent,opacity,font) {
        let geom = new THREE.Geometry();
        let material = new THREE.PointsMaterial(
            {
                size: size,
                transparent: transparent,
                opacity: opacity,
                vertexColors: true,
                color: 0xffffff,
            }
        );


        for (let x = -5; x < 5; x++) {
            for (let y = -5; y < 5; y++) {
                let pos = font*Math.random();
                let particle = new THREE.Vector3(x * pos, y * pos, 5);
                geom.vertices.push(particle);
                geom.colors.push(
                    new THREE.Color(Math.random()*0xffffff)
                );
            }
        }

        this.system = new THREE.Points(geom, material);
        this.system.name = 'particles';
        if (this.scene.getObjectByName('particles')) {
            this.scene.remove(this.scene.getObjectByName('particles'));
        }//存在则清除，然后重制
        this.scene.add(this.system);
    }


    animate() {
        // this.scene.children.forEach((child)=>{
        //     if(child instanceof THREE.Points){
        //         let vertices = child.geometry.vertices;
        //         vertices.forEach((v)=>{
        //             v.y = v.y - (this.act);
        //             v.x = v.x - (this.act);
        //             v.z = v.z - (this.act);
        //
        //             if(v.y <= 0){
        //                 v.y = 60;
        //             }
        //             if(v.x <= -20 || v.x>20){
        //                 this.act = this.act * -1;
        //             }
        //             if(v.z<-20 || v.z >=20){
        //                 this.act = this.act * -1;
        //             }
        //         });
        //     }
        // });
        // log(this.scene);
        // log(this.scene.children[1].geometry.vertices[0].z);

        let size = Math.random()*6+3;
        let opacity = Math.random()*0.8+0.2;

        this.initObject(size,true,opacity,100);
        this.renderer.clear();
        this.renderer.render(this.scene, this.camera);
        // requestAnimationFrame(() => {
        //     this.animate();
        // });
        setTimeout(()=>{
            this.animate();
        },500);
    }

    paintChart() {
        this.initThree();
        this.initCamera();
        this.initScene();
        this.initLight();
        this.initObject(3,true,1,10);
        this.renderer.clear();
        this.renderer.render(this.scene, this.camera);
        this.animate();
    }

}

page.contextTypes = {
    router: React.PropTypes.object
};
module.exports = page;