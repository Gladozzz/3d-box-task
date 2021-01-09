import React, { Component, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Canvas, useFrame, useThree } from 'react-three-fiber'
import * as THREE from 'three';
import { Button } from "./Button"
import CustomBox from './custombox';

const propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    length: PropTypes.number,
    showBox: PropTypes.bool,
    vertices: PropTypes.array,
    triangles: PropTypes.array
};

const defaultProps = {
    width: 10,
    height: 10,
    length: 10,
    showBox: false,
    vertices: [],
    triangles: []
};

class Threejsview extends Component {
    constructor(props) {
        super(props);

        this.handleDrawOnClick = this.handleDrawOnClick.bind(this);
        // this.handleWidthChange = this.handleWidthChange.bind(this);
        // this.handleHeightChange = this.handleHeightChange.bind(this);
        // this.handleLengthChange = this.handleLengthChange.bind(this);
        // this.renderThreejs = this.renderThreejs.bind(this);

        this.state = {
            showBox: this.props.showBox,
            vertices: this.props.vertices,
            triangles: this.props.triangles,
            widthValid: true,
            heigthValid: true,
            lengthValid: true
        };
    }

    // handleWidthChange(event) {
    //     if (!isNaN(event.target.value)) {
    //         this.setState({ widthValid: true });
    //         this.widthInput.className = "goodInput";
    //     } else {
    //         this.widthInput.className = "badInput";
    //         this.setState({ widthValid: false });
    //     }
    // }

    // handleHeightChange(event) {
    //     if (!isNaN(event.target.value)) {
    //         this.setState({ heigthValid: true });
    //         this.heigthInput.className = "goodInput";
    //     } else {
    //         this.heigthInput.className = "badInput";
    //         this.setState({ heigthValid: false });
    //     }
    // }

    // handleLengthChange(event) {
    //     if (!isNaN(event.target.value)) {
    //         this.setState({ lengthValid: true });
    //         this.lengthInput.className = "goodInput";
    //     } else {
    //         this.lengthInput.className = "badInput";
    //         this.setState({ lengthValid: false });
    //     }
    // }

    handleDrawOnClick(event) {
        if (this.state.widthValid && this.state.heigthValid && this.state.lengthValid) {
            var w = this.widthInput.value
            var h = this.heigthInput.value
            var l = this.lengthInput.value

            var dif = 1;
            if (w > h && w > l && w > 1000) {
                dif = w / 1000; 
                console.log("dif w");
            } else if (h > w && h > l && h > 1000) {
                dif = h / 1000; 
                console.log("dif h");
            } else if (l > 1000) {
                dif = l / 1000;
                console.log("dif l");
            }
            console.log("dif " + dif);
            if (dif > 1) {
                w = (w / dif).toFixed(5);
                h = (h / dif).toFixed(5);
                l = (l / dif).toFixed(5);
            }
            fetch('/calculate?width=' + w + '&height=' + h + '&length=' + l)
                .then(response => response.json())
                .then(json => {
                    var vertices = [];
                    var jsonVertices = json["vertices"]
                    for (var i = 0; i < 8; i++) {
                        vertices.push(jsonVertices[String(i)]);
                    }
                    var triangles = [];
                    var jsonTriangles = json["triangles"]
                    for (var i = 0; i < 12; i++) {
                        triangles.push(jsonTriangles[String(i)]);
                    }
                    this.setState({ showBox: true, vertices: vertices, triangles: triangles });
                    // this.container.componentWillUnmount(); 
                });
        } else {
            alert("Wrong attributes!");
        }
    }

    renderThreejs() {
        if (!this.state.showBox) {
            return null;
        }
        return (
            <div className='container'>
                <CustomBox vertices={this.state.vertices} triangles={this.state.triangles} ref={c=>this.container=c}/>
            </div>
        );
    }

    render() {
        return (
            <div className='threejsview'>
                <div className='inputs'>
                    <div className='boxSizeInput'>
                        <label htmlFor="winput">Enter width:</label><input className="goodInput" id='winput' defaultValue={defaultProps.width} type="number" min={0} ref={c=>this.widthInput=c}/>
                    </div>
                    <div className='boxSizeInput'>
                        <label htmlFor="hinput">Enter height:</label><input className="goodInput" id='hinput' defaultValue={defaultProps.height} type="number" min={0} ref={c=>this.heigthInput=c}/>
                    </div>
                    <div className='boxSizeInput'>
                        <label htmlFor="linput">Enter length:</label><input className="goodInput" id='linput' defaultValue={defaultProps.length} type="number" min={0} ref={c=>this.lengthInput=c}/>
                    </div>
                    <Button
                        id="drawButton"
                        onClick={this.handleDrawOnClick}
                        type="button"
                        buttonStyle="btn--primary--outline"
                        buttonSize="btn--large">Draw</Button>
                </div>
                {this.renderThreejs()}
            </div>
        );
    }
}

Threejsview.propTypes = propTypes;
Threejsview.defaultProps = defaultProps;

export default Threejsview;