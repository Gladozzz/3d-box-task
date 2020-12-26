import React, { Component } from "react";
import ReactDOM from "react-dom";
import * as THREE from 'three';
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import CameraControls from 'camera-controls';
import PropTypes from 'prop-types';


const style = {
    height: '1000px', // we can control scene size by setting container dimensions
    width: '1000px',
};

const propTypes = {
    vertices: PropTypes.array,
    triangles: PropTypes.array
};

const defaultProps = {
    vertices: null,
    triangles: null
};

class CustomBox extends Component {
    constructor(props) {
        super(props);
        this.startAnimationLoop = this.startAnimationLoop.bind(this);
        this.handleWindowResize = this.handleWindowResize.bind(this);
    }

    componentDidMount() {
        this.sceneSetup();
        this.addCustomSceneObjects();
        this.startAnimationLoop();
        window.addEventListener('resize', this.handleWindowResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowResize);
        window.cancelAnimationFrame(this.requestID);
        this.mount.removeChild(this.renderer.domElement)
        // this.controls.dispose();
    }
    componentDidUpdate() {
        this.mount.removeChild(this.renderer.domElement)
        window.cancelAnimationFrame(this.requestID);
        // this.startAnimationLoop();
        // this.sceneSetup();
        // this.addCustomSceneObjects();
        // this.startAnimationLoop();
        this.sceneSetup();
        this.addCustomSceneObjects();
        this.startAnimationLoop();
        window.addEventListener('resize', this.handleWindowResize);
    }

    // Standard scene setup in Three.js. Check "Creating a scene" manual for more information
    // https://threejs.org/docs/#manual/en/introduction/Creating-a-scene
    sceneSetup() {
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75, // fov = field of view
            width / height, // aspect ratio
            0.1, // near plane
            2000 // far plane
        );
        
        // Calculating z
        var maxLenghtFromCenter = this.props.vertices[0][0]
        for (var vertex of this.props.vertices) {
            var lengthFromCenter = Math.sqrt(vertex[0]*vertex[0] + vertex[1]*vertex[1] + vertex[2]*vertex[2]);
            if (lengthFromCenter > maxLenghtFromCenter) {
                maxLenghtFromCenter = lengthFromCenter;
            }
        }
        this.camera.position.x = 0;
        this.camera.position.y = 0;
        this.camera.position.z = maxLenghtFromCenter * 1.6; // is used here to set some distance from a cube that is located at z = 0
        // OrbitControls allow a camera to orbit around the object
        // https://threejs.org/docs/#examples/controls/OrbitControls
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.renderer.setSize(width, height);
        this.mount.appendChild(this.renderer.domElement); // mount using React ref
    };

    // Here should come custom code.
    // Code below is taken from Three.js BoxGeometry example
    // https://threejs.org/docs/#api/en/geometries/BoxGeometry
    addCustomSceneObjects() {
        // const geometry = new THREE.BoxGeometry();
        const geometry = new THREE.Geometry();
        for (var vertex of this.props.vertices) {
            geometry.vertices.push(new THREE.Vector3(vertex[0], vertex[1], vertex[2]));
        }
        // geometry.merge();
        for (var triangle of this.props.triangles) {
            geometry.faces.push(new THREE.Face3(triangle[0], triangle[1], triangle[2]));
        }
        const material = new THREE.MeshPhongMaterial({
            color: 0x156289,
            emissive: 0x072534,
            side: THREE.DoubleSide,
            flatShading: true
        });
        this.box = new THREE.Mesh(geometry, material);
        this.scene.add(this.box);

        const lights = [];
        lights[0] = new THREE.PointLight(0xffffff, 1, 0);
        lights[1] = new THREE.PointLight(0xffffff, 1, 0);
        lights[2] = new THREE.PointLight(0xffffff, 1, 0);

        lights[0].position.set(0, 200, 0);
        lights[1].position.set(100, 200, 100);
        lights[2].position.set(- 100, - 200, - 100);

        this.scene.add(lights[0]);
        this.scene.add(lights[1]);
        this.scene.add(lights[2]);
    };

    startAnimationLoop() {
        this.box.rotation.x += 0.01;
        this.box.rotation.y += 0.01;

        this.renderer.render(this.scene, this.camera);

        // The window.requestAnimationFrame() method tells the browser that you wish to perform
        // an animation and requests that the browser call a specified function
        // to update an animation before the next repaint
        this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
    };

    handleWindowResize() {
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;
        // const width = 1000;
        // const height = 1000;

        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;

        // Note that after making changes to most of camera properties you have to call
        // .updateProjectionMatrix for the changes to take effect.
        this.camera.updateProjectionMatrix();
    };

    render() {
        return <div style={style} ref={ref => (this.mount = ref)} />;
    }
}

CustomBox.propTypes = propTypes;
CustomBox.defaultProps = defaultProps;

export default CustomBox;