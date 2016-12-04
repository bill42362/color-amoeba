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
    getTangentPoints(center, radius, point) {
        let distance = Core.getDistance(center, point);
        let cos = radius/distance;
        let sin = Math.sqrt(distance*distance - radius*radius)/distance;
        let vector = {x: point.x - center.x, y: point.y - center.y};
        let rotatedPoint1 = {x: vector.x*cos - vector.y*sin, y: vector.x*sin + vector.y*cos};
        let rotatedPoint2 = {x: vector.x*cos + vector.y*sin, y: -vector.x*sin + vector.y*cos};
        return {
            point1: {x: center.x + cos*rotatedPoint1.x, y: center.y + cos*rotatedPoint1.y},
            point2: {x: center.x + cos*rotatedPoint2.x, y: center.y + cos*rotatedPoint2.y},
        };
    }
    drawEatenCount(amoeba, opt_style) {
        const ctx = this.context;
        let tempFillStyle = ctx.fillStyle;
        ctx.fillStyle = opt_style || '#fff';
        let textWidth = ctx.measureText(amoeba.eatenCount).width;
        ctx.fillText(amoeba.eatenCount, amoeba.position.x - 0.5*textWidth, amoeba.position.y + 8);
        ctx.fillStyle = tempFillStyle;
    }
    drawTentacle(centerA, radiusA, centerB, radiusB, opt_style) {
        const ctx = this.context;
        let aPoints = this.getTangentPoints(centerA, radiusA, centerB);
        let bPoints = this.getTangentPoints(centerB, radiusB, centerA);
        let distance = Core.getDistance(centerA, centerB);
        let vectorAB = {x: centerB.x - centerA.x, y: centerB.y - centerA.y};
        let edgeB = {
            x: centerA.x + (distance - radiusB)*vectorAB.x/distance,
            y: centerA.y + (distance - radiusB)*vectorAB.y/distance,
        };
        let ratioA = radiusA/(radiusA + radiusB), ratioB = radiusB/(radiusA + radiusB);
        let middlePoint = {x: ratioB*centerA.x + ratioA*centerB.x, y: ratioB*centerA.y + ratioA*centerB.y};
        let tempFillStyle = ctx.fillStyle;
        ctx.fillStyle = opt_style || '#888';
        ctx.beginPath();
            ctx.moveTo(aPoints.point1.x, aPoints.point1.y);
            ctx.bezierCurveTo(middlePoint.x, middlePoint.y, edgeB.x, edgeB.y, bPoints.point2.x, bPoints.point2.y);
            ctx.lineTo(bPoints.point1.x, bPoints.point1.y);
            ctx.bezierCurveTo(edgeB.x, edgeB.y, middlePoint.x, middlePoint.y, aPoints.point2.x, aPoints.point2.y);
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
        props.pullingPoints.forEach(point => {
            var gradient = this.context.createLinearGradient(
                point.position.x, point.position.y,
                amoeba.position.x, amoeba.position.y,
            );
            let amoebaColor = 'rgb('
                + Math.floor(amoeba.color.red) + ','
                + Math.floor(amoeba.color.green) + ','
                + Math.floor(amoeba.color.blue)
            + ')';
            let pointColor = 'rgb('
                + Math.floor(point.color.red) + ','
                + Math.floor(point.color.green) + ','
                + Math.floor(point.color.blue)
            + ')';
            gradient.addColorStop(0.4, pointColor);
            gradient.addColorStop(0.6, amoebaColor);
            this.drawTentacle(
                amoeba.position, amoeba.size,
                point.position, point.size,
                gradient
            );
        });
        let points = props.points.concat(amoeba).concat(props.pullingPoints);
        points.forEach(point => {
            let fillStyle = 'rgb('
                + Math.floor(point.color.red) + ','
                + Math.floor(point.color.green) + ','
                + Math.floor(point.color.blue)
            + ')';
            this.drawCircle(point.position, point.size, fillStyle);
        });
        this.drawEatenCount(amoeba);
    }
    componentDidMount() {
        let antialiasingFactor = this.antialiasingFactor;
        let canvas = this.refs.canvas;
        this.canvas = this.refs.canvas;
        this.context = canvas.getContext('2d');
        this.context.canvas.width = antialiasingFactor*canvas.clientWidth;
        this.context.canvas.height = antialiasingFactor*canvas.clientHeight;
        this.context.translate(0.5, 0.5);
        this.context.font = "32px Helvetica Neue,Helvetica,Arial,sans-serif";
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
