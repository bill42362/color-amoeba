// GameSubject.react.js
'use strict'
import React from 'react';
class GameSubject extends React.Component {
    constructor(props) {
        super(props);
        this.antialiasingFactor = 2;
        this.context = undefined;
    }
    clearCanvas() {
        let canvas = this.canvas;
        this.context.clearRect(0, 0, canvas.width, canvas.height);
    }
    drawCompleteCount(count, center, style = '#fff') {
        const ctx = this.context;
        let tempFillStyle = ctx.fillStyle;
        ctx.fillStyle = style;
        let textWidth = ctx.measureText(count).width;
        ctx.fillText(count, center.x - 0.5*textWidth, center.y + 8);
        ctx.fillStyle = tempFillStyle;
    }
    drawCircle(center, radius = 4, style = '#888', width = 5, arcStartRatio = 0, arcStopRatio = 1) {
        const ctx = this.context;
        let tempStrokeStyle = ctx.strokeStyle;
        let tempLineWidth = ctx.lineWidth;
        ctx.strokeStyle = style;
        ctx.lineWidth = width;
        ctx.beginPath();
            ctx.moveTo(center.x, center.y - radius);
            ctx.arc(
                center.x, center.y, radius,
                (arcStartRatio - 0.25)*Math.PI*2, (arcStopRatio - 0.25)*Math.PI*2, false
            );
        ctx.stroke();
        ctx.strokeStyle = tempStrokeStyle;
        ctx.lineWidth = tempLineWidth;
    }
    drawBall(center, radius = 4, style = '#888') {
        const ctx = this.context;
        let tempFillStyle = ctx.fillStyle;
        ctx.fillStyle = style;
        ctx.beginPath();
            ctx.moveTo(center.x + radius, center.y);
            ctx.arc(center.x, center.y, radius, 0, Math.PI*2, true);
        ctx.fill();
        ctx.fillStyle = tempFillStyle;
    }
    drawProps(props) {
        this.clearCanvas();
        let amoeba = this.props.amoeba;
        let subjects = this.props.gameSubjects;
        let subjectRadius = Math.min(Math.max(this.canvas.clientWidth/6, 25), 80);
        let now = Date.now();
        let maxTransitionTime = 1000;
        subjects.forEach((subject, index) => {
            let timestamp = subject.transitionTime;
            let transitionRatio = Math.min((now - subject.transitionTime)/maxTransitionTime, 1.0);
            if(subject.completeColor) {
                let completeColor = 'rgb('
                    + Math.floor(subject.completeColor.red) + ','
                    + Math.floor(subject.completeColor.green) + ','
                    + Math.floor(subject.completeColor.blue)
                + ')';
                this.drawBall(
                    {x: 15 + subjectRadius + index*(15 + 2*subjectRadius), y: 15 + subjectRadius},
                    subjectRadius, completeColor
                );
                let subjectColor = 'rgb('
                    + Math.floor((1 - transitionRatio)*subject.color.red + transitionRatio*255) + ','
                    + Math.floor((1 - transitionRatio)*subject.color.green + transitionRatio*255) + ','
                    + Math.floor((1 - transitionRatio)*subject.color.blue + transitionRatio*255)
                + ')';
                this.drawCircle(
                    {x: 15 + subjectRadius + index*(15 + 2*subjectRadius), y: 15 + subjectRadius},
                    subjectRadius, subjectColor, 5
                );
                this.drawCompleteCount(
                    subject.completeCount,
                    {x: 15 + subjectRadius + index*(15 + 2*subjectRadius), y: 15 + subjectRadius},
                );
            } else if(subject.inProgress) {
                // Draw amoeba color.
                let tempGlobalAlpha = this.context.globalAlpha;
                this.context.globalAlpha = transitionRatio;
                let ameobaColor = 'rgb('
                    + Math.floor(amoeba.color.red) + ','
                    + Math.floor(amoeba.color.green) + ','
                    + Math.floor(amoeba.color.blue)
                + ')';
                this.drawBall(
                    {x: 15 + subjectRadius + index*(15 + 2*subjectRadius), y: 15 + subjectRadius},
                    subjectRadius, ameobaColor
                );
                this.drawCompleteCount(
                    subject.completeCount,
                    {x: 15 + subjectRadius + index*(15 + 2*subjectRadius), y: 15 + subjectRadius},
                );
                this.context.globalAlpha = tempGlobalAlpha;
                // Draw dashed circle.
                this.context.setLineDash([15]);
                this.drawCircle(
                    {x: 15 + subjectRadius + index*(15 + 2*subjectRadius), y: 15 + subjectRadius},
                    subjectRadius, '#888', 5
                );
                this.context.setLineDash([]);
                // Draw subject circle.
                let subjectColor = 'rgb('
                    + Math.floor(subject.color.red) + ','
                    + Math.floor(subject.color.green) + ','
                    + Math.floor(subject.color.blue)
                + ')';
                this.drawCircle(
                    {x: 15 + subjectRadius + index*(15 + 2*subjectRadius), y: 15 + subjectRadius},
                    subjectRadius, subjectColor, 5, 0, transitionRatio
                );
            } else {
                let subjectColor = 'rgb('
                    + Math.floor(subject.color.red) + ','
                    + Math.floor(subject.color.green) + ','
                    + Math.floor(subject.color.blue)
                + ')';
                this.context.setLineDash([15]);
                this.drawCircle(
                    {x: 15 + subjectRadius + index*(15 + 2*subjectRadius), y: 15 + subjectRadius},
                    subjectRadius, '#888', 5
                );
                this.context.setLineDash([]);
            }
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
        this.context.font = "32px Helvetica Neue,Helvetica,Arial,sans-serif";
        this.drawProps(this.props);
    }
    componentWillReceiveProps(nextProps) { this.drawProps(nextProps); }
    render() { return <canvas className='game-subject' ref='canvas'></canvas>; }
}
module.exports = GameSubject;
