// ColorAmoeba.react.js
'use strict'
import React from 'react';
class ColorAmoeba extends React.Component {
    constructor(props) {
        super(props);
        this.antialiasingFactor = 2;
        this.ballStack = [];
        this.context = undefined;
    }
    getStyleFromRGB({red = 0, green = 0, blue = 0}) {
        return 'rgb(' + Math.floor(red) + ',' + Math.floor(green) + ',' + Math.floor(blue) + ')';
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
    pushBallStack(center, radius = 4, style = '#888', alpha = 1) {
        this.ballStack.push({
            moveTo: {x: center.x, y: center.y - radius},
            arc: {centerX: center.x, centerY: center.y, radius: radius,},
            fillStyle: style, globalAlpha: alpha
        });
    }
    drawBallStack() {
        const ctx = this.context;
        const PI2 = Math.PI*2;
        let stack = this.ballStack.sort((a, b) => {
            if(a.fillStyle > b.fillStyle) return 1; 
            if(a.fillStyle < b.fillStyle) return -1; 
            if(a.globalAlpha > b.globalAlpha) return 1; 
            if(a.globalAlpha < b.globalAlpha) return -1; 
        });
        let tempFillStyle = ctx.fillStyle;
        let tempGlobalAlpha = ctx.globalAlpha;
        ctx.beginPath();
        stack.forEach(ball => {
            let current = {
                fillStyle: ctx.fillStyle,
                globalAlpha: ctx.globalAlpha,
            };
            if(current.fillStyle !== ball.fillStyle || current.globalAlpha !== ball.globalAlpha) {
                ctx.fill();
                if(current.fillStyle !== ball.fillStyle) ctx.fillStyle = ball.fillStyle;
                if(current.globalAlpha !== ball.globalAlpha) ctx.globalAlpha = ball.globalAlpha;
                ctx.beginPath();
            }
            ctx.moveTo(ball.moveTo.x, ball.moveTo.y);
            ctx.arc(
                ball.arc.centerX, ball.arc.centerY, ball.arc.radius,
                0, PI2, ball.arc.anticlockwise
            );
        });
        ctx.fill();
        ctx.fillStyle = tempFillStyle;
        ctx.globalAlpha = tempGlobalAlpha;
        this.ballStack = [];
    }
    drawProps(props) {
        this.clearCanvas();
        let amoeba = props.amoeba;
        props.pullingPoints.forEach(point => {
            var gradient = this.context.createLinearGradient(
                point.position.x, point.position.y,
                amoeba.position.x, amoeba.position.y,
            );
            let amoebaColor = this.getStyleFromRGB(amoeba.color);
            let pointColor = this.getStyleFromRGB(point.color);
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
            this.pushBallStack(point.position, point.size, this.getStyleFromRGB(point.color));
        });
        this.drawBallStack();
        this.drawEatenCount(amoeba);
    }
    clearCanvas() {
        let canvas = this.canvas;
        this.context.clearRect(0, 0, canvas.width, canvas.height);
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
    render() { return <canvas className='color-amoeba' ref='canvas'></canvas>; }
}
module.exports = ColorAmoeba;
