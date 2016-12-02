// App.react.js
'use strict'
import React from 'react';
import ClassNames from 'classnames';
import ColorAmoeba from './ColorAmoeba.react.js';
import MouseTracker from './MouseTracker.react.js';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.staticStrings = { };
        this.state = {
            points: [], eatingPoints: [],
            amoeba: {
                position: {x: -1, y: -1},
                size: 80, eatingSize: 160,
                color: {red: 250, green: 250, blue: 250, alpha: 1},
            },
            mousePosition: {x: -1, y: -1},
            lastUpdateTimestamp: Date.now(),
        };
        this.frequency = 10;
        this.maxPoints = 100;
        this.timeloop = this.timeloop.bind(this);
        this.nextStep = this.nextStep.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
    }
    onMouseMove() {
        let mouseState = this.refs.mouseTracker.state;
        let mouseAxis = mouseState.axis;
        let amoeba = this.state.amoeba;
        amoeba.position = {x: mouseAxis.x*2, y: mouseAxis.y*2};
        this.setState({mousePosition: mouseState.axis, amoeba: amoeba, lastUpdateTimestamp: Date.now()});
        this.nextStep();
    }
    renewPoints(points = []) {
        let baseSize = {width: this.refs.base.clientWidth, height: this.refs.base.clientHeight};
        while(this.maxPoints > points.length) {
            points.push({
                position: {x: baseSize.width*Math.random()*2, y: baseSize.height*Math.random()*2},
                size: 10,
                color: {
                    red: Math.floor(Math.random()*255),
                    green: Math.floor(Math.random()*255),
                    blue: Math.floor(Math.random()*255),
                    alpha: 1,
                },
                birthTimestamp: Date.now(),
            });
        }
        return points;
    }
    resizePoints(points = []) {
        let now = Date.now();
        return points.map(point => {
            let age = Math.min(now - point.birthTimestamp, 1000)/1000;
            if(1 > age) { point.size = 10 + 10*Math.sin(age*Math.PI); }
            else { point.size = 10; }
            return point;
        });
    }
    getEatingResult(points = []) {
        let amoeba = this.state.amoeba;
        let eatingPoints = [];
        let leftPoints = points.filter(point => {
            let xDistance = point.position.x - amoeba.position.x;
            let yDistance = point.position.y - amoeba.position.y;
            let distance = Math.sqrt(xDistance*xDistance + yDistance*yDistance);
            if(amoeba.eatingSize >= distance) {
                point.birthTimestamp = Date.now();
                eatingPoints.push(point);
            }
            return amoeba.eatingSize < distance;
        });
        return {points: leftPoints, eatingPoints: eatingPoints};
    }
    nextStep() {
        let state = this.state;
        let now = Date.now();
        let timeStep = now - state.lastUpdateTimestamp;
        let resizedPoints = this.resizePoints(this.state.points);
        let eatingResult = this.getEatingResult(resizedPoints);
        let points = this.renewPoints(eatingResult.points.concat());
        this.setState({
            points: points,
            eatingPoints: eatingResult.eatingPoints,
            lastUpdateTimestamp: now
        });
    }
    timeloop() {
        let now = Date.now();
        let maxTimeToLastUpdate = 1000/this.frequency;
        let timeToLastUpdate = now - this.state.lastUpdateTimestamp;
        if(maxTimeToLastUpdate < timeToLastUpdate) { this.nextStep(); }
    }
    componentDidMount() {
        this.setState({points: this.renewPoints()});
        window.setInterval(this.timeloop, 10);
    }
    componentWillUnmount() { }
    render() {
        let state = this.state;
        return <div id='wrapper' ref='base'>
            <ColorAmoeba points={this.state.points.concat([this.state.amoeba])} />
            <MouseTracker
                ref='mouseTracker'
                onMouseMove={this.onMouseMove}
            />
        </div>;
    }
}
module.exports = App;
