// ColorAmoeba.react.js
'use strict'
import React from 'react';
class ColorAmoeba extends React.Component {
    constructor(props) {
        super(props);
        this.antialiasingFactor = 2;
        this.context = undefined;
        this.drawCircle = this.drawCircle.bind(this);
    }
    clearCanvas() {
        let canvas = this.canvas;
        this.context.clearRect(0, 0, canvas.width, canvas.height);
    }
    getFacingSidePoints(centerA, radiusA, centerB) {
        let distance = Core.getDistance(centerA, centerB);
        let point1 = {
            x: radiusA*(centerA.y - centerB.y)/distance + centerA.x,
            y: radiusA*(centerB.x - centerA.x)/distance + centerA.y,
        };
        let point2 = {
            x: 2*centerA.x - point1.x,
            y: 2*centerA.y - point1.y,
        };
        return {point1: point1, point2: point2};
    }
    drawLinkQuad(centerA, radiusA, centerB, radiusB, opt_style) {
        const ctx = this.context;
        let aPoints = this.getFacingSidePoints(centerA, radiusA, centerB);
        let bPoints = this.getFacingSidePoints(centerB, radiusB, centerA);
        let tempFillStyle = ctx.fillStyle;
        ctx.fillStyle = opt_style || '#888';
        ctx.beginPath();
            ctx.moveTo(aPoints.point1.x, aPoints.point1.y);
            ctx.lineTo(bPoints.point2.x, bPoints.point2.y);
            ctx.lineTo(bPoints.point1.x, bPoints.point1.y);
            ctx.lineTo(aPoints.point2.x, aPoints.point2.y);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = tempFillStyle;
    }
    drawCircle(center, opt_radius, opt_style) {
        const ctx = this.context;
        let radius = opt_radius || 4;
        let tempFillStyle = ctx.fillStyle;
        ctx.fillStyle = opt_style || '#888';
        ctx.beginPath();
            ctx.moveTo(center.x + radius, center.y);
            ctx.arc(center.x, center.y, radius, 0, Math.PI*2, true);
        ctx.fill();
        ctx.fillStyle = tempFillStyle;
    }
    drawProps(props) {
        this.clearCanvas();
        let amoeba = props.amoeba;
        let points = props.points.concat(amoeba).concat(props.pullingPoints);
        points.forEach(point => {
            let fillStyle = 'rgb('
                + Math.floor(point.color.red) + ','
                + Math.floor(point.color.green) + ','
                + Math.floor(point.color.blue)
            + ')';
            this.drawCircle(point.position, point.size, fillStyle);
        });
        props.pullingPoints.forEach(point => {
            let fillStyle = 'rgb('
                + Math.floor(amoeba.color.red) + ','
                + Math.floor(amoeba.color.green) + ','
                + Math.floor(amoeba.color.blue)
            + ')';
            this.drawLinkQuad(
                amoeba.position, amoeba.size,
                point.position, point.size,
                fillStyle
            );
        });
    }
    componentDidMount() {
        let antialiasingFactor = this.antialiasingFactor;
        let canvas = this.refs.canvas;
        this.canvas = this.refs.canvas;
        this.context = canvas.getContext('2d');
        this.context.canvas.width = antialiasingFactor*canvas.clientWidth;
        this.context.canvas.height = antialiasingFactor*canvas.clientHeight;
        this.context.translate(0.5, 0.5);
        this.drawProps(this.props);
    }
    componentWillReceiveProps(nextProps) { this.drawProps(nextProps); }
    render() {
        let props = this.props;
        return <canvas className='color-amoeba' ref='canvas'>
        </canvas>;
    }
}
module.exports = ColorAmoeba;
