// GameSubject.react.js
'use strict'
import React from 'react';
class GameSubject extends React.Component {
    constructor(props) {
        super(props);
        this.antialiasingFactor = 2;
        this.ballStack = [];
        this.circleStack = [];
        this.context = undefined;
    }
    getStyleFromRGB({red = 0, green = 0, blue = 0}) {
        return 'rgb(' + Math.floor(red) + ',' + Math.floor(green) + ',' + Math.floor(blue) + ')';
    }
    drawText(text, center, style = '#fff', font = '32px Helvetica Neue,Helvetica,Arial,sans-serif') {
        const ctx = this.context;
        let tempFillStyle = ctx.fillStyle;
        let tempFont = ctx.font;
        ctx.fillStyle = style;
        ctx.font = font;
        let textWidth = ctx.measureText(text).width;
        ctx.fillText(text, center.x - 0.5*textWidth, center.y + 8);
        ctx.fillStyle = tempFillStyle;
        ctx.font = tempFont;
    }
    pushCircleStack(center, radius = 4, style = '#888', width = 5, arcStartRatio = 0, arcStopRatio = 1, lineDash = []) {
        this.circleStack.push({
            moveTo: {x: center.x, y: center.y - radius},
            arc: {
                centerX: center.x, centerY: center.y, radius: radius,
                startAngle: (arcStartRatio - 0.25)*Math.PI*2, endAngle: (arcStopRatio - 0.25)*Math.PI*2,
                anticlockwise: false
            },
            strokeStyle: style, lineWidth: width, lineDash: lineDash
        });
    }
    drawCircleStack() {
        const ctx = this.context;
        let stack = this.circleStack.sort((a, b) => {
            if(a.strokeStyle > b.strokeStyle) return 1; 
            if(a.strokeStyle < b.strokeStyle) return -1; 
            if(a.lineWidth > b.lineWidth) return 1; 
            if(a.lineWidth < b.lineWidth) return -1; 
            if(a.lineDash > b.lineDash) return 1; 
            if(a.lineDash < b.lineDash) return -1; 
        });
        ctx.beginPath();
        stack.forEach(circle => {
            let current = {
                strokeStyle: ctx.strokeStyle,
                lineWidth: ctx.lineWidth,
                lineDash: ctx.getLineDash().toString()
            };
            if(
                current.strokeStyle !== circle.strokeStyle
                || current.lineWidth !== circle.lineWidth
                || current.lineDash !== circle.lineDash.toString()
            ) {
                ctx.stroke();
                if(current.strokeStyle !== circle.strokeStyle)  ctx.strokeStyle = circle.strokeStyle;
                if(current.lineWidth !== circle.lineWidth)  ctx.lineWidth = circle.lineWidth;
                if(current.lineDash !== circle.lineDash.toString())  ctx.setLineDash(circle.lineDash);
                ctx.beginPath();
            }
            ctx.moveTo(circle.moveTo.x, circle.moveTo.y);
            ctx.arc(
                circle.arc.centerX, circle.arc.centerY, circle.arc.radius,
                circle.arc.startAngle, circle.arc.endAngle, circle.arc.anticlockwise
            );
        });
        ctx.stroke();
        this.circleStack = [];
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
        let amoeba = this.props.amoeba;
        let subjects = this.props.gameSubjects;
        let subjectRadius = Math.min(Math.max(this.canvas.clientWidth/7, 25), 80);
        let now = Date.now();
        let maxTransitionTime = 1000;
        subjects.forEach((subject, index) => {
            let timestamp = subject.transitionTime;
            let transitionRatio = Math.min((now - subject.transitionTime)/maxTransitionTime, 1.0);
            if(subject.completeColor) {
                // Draw completed color.
                this.pushBallStack(
                    {x: 15 + subjectRadius + index*(15 + 2*subjectRadius), y: 15 + subjectRadius},
                    subjectRadius, this.getStyleFromRGB(subject.completeColor)
                );
                // Draw subject circle.
                let subjectColor = this.getStyleFromRGB({
                    red: (1 - transitionRatio)*subject.color.red + transitionRatio*255,
                    green: (1 - transitionRatio)*subject.color.green + transitionRatio*255,
                    blue: (1 - transitionRatio)*subject.color.blue + transitionRatio*255,
                });
                this.pushCircleStack(
                    {x: 15 + subjectRadius + index*(15 + 2*subjectRadius), y: 15 + subjectRadius},
                    subjectRadius, subjectColor, 5
                );
            } else if(subject.inProgress) {
                // Draw amoeba color.
                this.pushBallStack(
                    {x: 15 + subjectRadius + index*(15 + 2*subjectRadius), y: 15 + subjectRadius},
                    subjectRadius, this.getStyleFromRGB(amoeba.color), transitionRatio
                );
                // Draw dashed circle.
                this.pushCircleStack(
                    {x: 15 + subjectRadius + index*(15 + 2*subjectRadius), y: 15 + subjectRadius},
                    subjectRadius, '#888', 5, 0, 1, [15]
                );
                // Draw subject circle.
                this.pushCircleStack(
                    {x: 15 + subjectRadius + index*(15 + 2*subjectRadius), y: 15 + subjectRadius},
                    subjectRadius, this.getStyleFromRGB(subject.color), 5, 0, transitionRatio
                );
            } else {
                // Draw dashed circle.
                this.pushCircleStack(
                    {x: 15 + subjectRadius + index*(15 + 2*subjectRadius), y: 15 + subjectRadius},
                    subjectRadius, '#888', 5, 0, 1, [15]
                );
            }
        });
        this.drawBallStack();
        this.drawCircleStack();
        subjects.forEach((subject, index) => {
            let timestamp = subject.transitionTime;
            let transitionRatio = Math.min((now - subject.transitionTime)/maxTransitionTime, 1.0);
            if(subject.completeColor) {
                this.drawText(
                    subject.completeCount,
                    {x: 15 + subjectRadius + index*(15 + 2*subjectRadius), y: 15 + subjectRadius},
                );
            } else if(subject.inProgress) {
                let tempGlobalAlpha = this.context.globalAlpha;
                this.context.globalAlpha = transitionRatio;
                this.drawText(
                    amoeba.eatenCount,
                    {x: 15 + subjectRadius + index*(15 + 2*subjectRadius), y: 15 + subjectRadius},
                );
                this.drawText(
                    '('
                        + Math.floor(amoeba.color.red)
                        + ', ' + Math.floor(amoeba.color.green)
                        + ', ' + Math.floor(amoeba.color.blue)
                    + ')',
                    {x: 15 + subjectRadius + index*(15 + 2*subjectRadius), y: 35 + 2*subjectRadius},
                    undefined,
                    "20px Helvetica Neue,Helvetica,Arial,sans-serif"
                );
                this.context.globalAlpha = tempGlobalAlpha;
            }
        });
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
    render() { return <canvas className='game-subject' ref='canvas'></canvas>; }
}
module.exports = GameSubject;
