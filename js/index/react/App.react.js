// App.react.js
'use strict'
import React from 'react';
import ClassNames from 'classnames';
import GameSubject from './GameSubject.react.js';
import ColorAmoeba from './ColorAmoeba.react.js';
import MouseTracker from './MouseTracker.react.js';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.staticStrings = { };
        this.state = {
            startFeeding: false, amoebaHovering: false, isGameFinished: true,
            points: [], pullingPoints: [],
            // Color:
            // facebook.com/somekidding/photos/a.304991492899199.71173.114982431900107/1274572585941080
            gameSubjects: [
                {
                    color: {red: 229, green: 40, blue: 47, alpha: 1},
                    colorOffset: {red: 60, green: 60, blue: 60, alpha: 1},
                    completeCount: 0, completeColor: undefined,
                    unlocked: true, inProgress: true, transitionTime: Date.now(),
                },
                {
                    color: {red: 240, green: 142, blue: 41, alpha: 1},
                    colorOffset: {red: 50, green: 50, blue: 50, alpha: 1},
                    completeCount: 0, completeColor: undefined,
                    unlocked: true, inProgress: false, transitionTime: Date.now(),
                },
                {
                    color: {red: 254, green: 238, blue: 64, alpha: 1},
                    colorOffset: {red: 40, green: 40, blue: 40, alpha: 1},
                    completeCount: 0, completeColor: undefined,
                    unlocked: true, inProgress: false, transitionTime: Date.now(),
                },
                {
                    color: {red: 73, green: 174, blue: 64, alpha: 1},
                    colorOffset: {red: 30, green: 30, blue: 30, alpha: 1},
                    completeCount: 0, completeColor: undefined,
                    unlocked: false, inProgress: false, transitionTime: Date.now(),
                },
                {
                    color: {red: 21, green: 87, blue: 165, alpha: 1},
                    colorOffset: {red: 20, green: 20, blue: 20, alpha: 1},
                    completeCount: 0, completeColor: undefined,
                    unlocked: false, inProgress: false, transitionTime: Date.now(),
                },
                {
                    color: {red: 118, green: 46, blue: 136, alpha: 1},
                    colorOffset: {red: 10, green: 10, blue: 10, alpha: 1},
                    completeCount: 0, completeColor: undefined,
                    unlocked: false, inProgress: false, transitionTime: Date.now(),
                },
            ],
            amoeba: {
                eatenCount: 0, movedDistance: 0,
                position: {x: -1, y: -1},
                size: 80, eatingSize: 200,
                color: {red: 128, green: 128, blue: 128, alpha: 1},
            },
            mousePosition: {x: -1, y: -1},
            lastBreedTimestamp: Date.now(),
            lastUpdateTimestamp: Date.now(),
            lastMoveTimestamp: Date.now() - 500,
        };
        this.frequency = 60;
        this.maxPoints = 200;
        this.breedTime = 250;
        this.maxBreedTryingTime = 10;
        this.maxPullingTime = 1000;
        this.pointLifeTime = 10000;
        this.moveShild = {time: 500, moreThanEating: 200};
        this.timeloop = this.timeloop.bind(this);
        this.nextStep = this.nextStep.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onBonusImageLoad = this.onBonusImageLoad.bind(this);

        let finishBonusImage = new Image();
        finishBonusImage.src = '/img/finish-bonus-1.png';
        finishBonusImage.onload = this.onBonusImageLoad;
    }
    onBonusImageLoad(e) {
        let image = e.target;
        var canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        let context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, image.width, image.height);
        this.bonusImage = image;
        this.bonusImageCanvasContext = context;
    }
    getColorFromBonusImage(axis) {
        let ctx = this.bonusImageCanvasContext;
        let pixelData = ctx.getImageData(axis.x, axis.y, 1, 1).data;
        return {red: pixelData[0], green: pixelData[1], blue: pixelData[2], alpha: pixelData[3]};
    }
    fitPointToBonusImage(axis, baseDimension, imageDimension) {
        let arrayFromBaseCenter = {x: axis.x - 0.5*baseDimension.x, y: axis.y - 0.5*baseDimension.y};
        let pointOnImage = {
            x: 0.5*imageDimension.x + arrayFromBaseCenter.x,
            y: 0.5*imageDimension.y + arrayFromBaseCenter.y,
        };
        return pointOnImage;
    }
    onTouchMove(e) {
        let mouseState = this.refs.mouseTracker.state;
        let mouseAxis = {x: e.nativeEvent.layerX*2, y: e.nativeEvent.layerY*2};
        let amoeba = this.state.amoeba;
        let mouseOffset = Core.getDistance(amoeba.position, mouseAxis);
        let amoebaHovering = amoeba.size + 20 > mouseOffset;
        if(amoebaHovering) {
            e.preventDefault();
            let now = Date.now();
            amoeba.movedDistance += mouseOffset;
            amoeba.position = mouseAxis;
            this.setState({
                mousePosition: mouseAxis, amoeba: amoeba,
                lastUpdateTimestamp: now, lastMoveTimestamp: now,
            });
            this.nextStep();
        } else if(this.state.isGameFinished) {
            e.preventDefault();
            let points = this.state.points;
            let newPoint = this.getNewPoint();
            newPoint.position = mouseAxis;
            let positionOnImage = this.fitPointToBonusImage(
                newPoint.position,
                this.state.baseDimension,
                {x: this.bonusImage.width, y: this.bonusImage.height},
            );
            let color = this.getColorFromBonusImage(positionOnImage);
            if(20 < color.red || 20 < color.green || 20 < color.blue) {
                newPoint.color = color;
                points.push(newPoint);
                this.setState({points: points});
                this.nextStep();
            }
        }
        return false;
    }
    onMouseUp() {
        let mouseState = this.refs.mouseTracker.state;
        if(mouseState.key.left !== mouseState.prev.key.left) {
            if(this.state.startFeeding) { this.setState({startFeeding: false}); }
            else if(this.state.amoebaHovering) { this.setState({startFeeding: true}); }
        }
    }
    onMouseMove() {
        let now = Date.now();
        let state = this.state;
        let mouseState = this.refs.mouseTracker.state;
        let mouseAxis = {x: mouseState.axis.x*2, y: mouseState.axis.y*2};
        let amoeba = state.amoeba;
        let mouseOffset = Core.getDistance(amoeba.position, mouseAxis);
        let lastMoveTimestamp = state.lastMoveTimestamp;
        let points = state.points;
        if(state.startFeeding) {
            amoeba.position = mouseAxis;
            amoeba.movedDistance += mouseOffset;
            lastMoveTimestamp = now;
        } else if(state.isGameFinished) {
            let newPoint = this.getNewPoint();
            newPoint.position = mouseAxis;
            let positionOnImage = this.fitPointToBonusImage(
                newPoint.position, state.baseDimension,
                {x: this.bonusImage.width, y: this.bonusImage.height},
            );
            let color = this.getColorFromBonusImage(positionOnImage);
            if(20 < color.red || 20 < color.green || 20 < color.blue) {
                newPoint.color = color;
                points.push(newPoint);
            }
        }
        let amoebaHovering = amoeba.size > mouseOffset;
        this.setState({
            mousePosition: mouseState.axis, points: points,
            amoeba: amoeba, amoebaHovering: amoebaHovering,
            lastUpdateTimestamp: now,
            lastMoveTimestamp: lastMoveTimestamp
        });
        this.nextStep();
    }
    killExpiredPoints(points = []) {
        let now = Date.now();
        return points.filter(point => { return point.lifeTime > (now - point.birthTimestamp); });
    }
    resizePoints(points = []) {
        let now = Date.now();
        return points.map(point => {
            let age = (now - point.birthTimestamp)/1000;
            let blinkCycle = Math.max(Math.min(age, 1), 0);
            if(1 > blinkCycle && 0 < blinkCycle) {
                point.size = 10 + 10*Math.sin(blinkCycle*Math.PI);
            }
            else { point.size = 10; }
            return point;
        });
    }
    huntPoints(points = []) {
        let amoeba = this.state.amoeba;
        let huntedPoints = [];
        let leftPoints = points.filter(point => {
            let distance = Core.getDistance(point.position, amoeba.position);
            if(amoeba.eatingSize >= distance) {
                point.birthTimestamp = Date.now();
                point.originPosition = point.position;
                huntedPoints.push(point);
            }
            return amoeba.eatingSize < distance;
        });
        return {freePoints: leftPoints, huntedPoints: huntedPoints};
    }
    getNewPoint() {
        let baseSize = {width: this.refs.base.clientWidth, height: this.refs.base.clientHeight};
        return {
            position: {x: baseSize.width*Math.random()*2, y: baseSize.height*Math.random()*2},
            size: 10,
            color: {
                red: Math.floor(Math.random()*255),
                green: Math.floor(Math.random()*255),
                blue: Math.floor(Math.random()*255),
                alpha: 1,
            },
            birthTimestamp: Date.now(), lifeTime: this.pointLifeTime,
        };
    }
    pullPoints(points = []) {
        let amoeba = this.state.amoeba;
        let now = Date.now();
        let maxPullingTime = this.maxPullingTime;
        return points.map(point => {
            let pullingDuration = now - point.birthTimestamp;
            let pullingRatio = 0.1*Math.sqrt(Math.min(100*pullingDuration/maxPullingTime, 100));
            point.position = {
                x: pullingRatio*amoeba.position.x + (1 - pullingRatio)*point.originPosition.x,
                y: pullingRatio*amoeba.position.y + (1 - pullingRatio)*point.originPosition.y,
            };
            return point;
        });
    }
    swalloPullingPoints(points = []) {
        let amoeba = this.state.amoeba;
        let pullingPoints = [], swalloedPoints = [];
        points.forEach(point => {
            if(Core.getDistance(amoeba.position, point.position) <= amoeba.size + point.size) {
                swalloedPoints.push(point);
            } else { pullingPoints.push(point); }
        });
        return {pullingPoints: pullingPoints, swalloedPoints: swalloedPoints};
    }
    digestSwalloedPoints(points = []) {
        let amoeba = this.state.amoeba;
        let amoebaColor = amoeba.color;
        points.forEach(point => {
            let pointColor = point.color;
            amoebaColor.red += 0.3*(pointColor.red - amoebaColor.red);
            amoebaColor.green += 0.3*(pointColor.green - amoebaColor.green);
            amoebaColor.blue += 0.3*(pointColor.blue - amoebaColor.blue);
        });
        amoeba.color = amoebaColor;
        amoeba.eatenCount += points.length;
        return amoeba;
    }
    isSubjectPassed(subject, color) {
        return Math.abs(subject.color.red - color.red) < subject.colorOffset.red
            && Math.abs(subject.color.green - color.green) < subject.colorOffset.green
            && Math.abs(subject.color.blue - color.blue) < subject.colorOffset.blue
            && Math.abs(subject.color.alpha - color.alpha) < subject.colorOffset.alpha
    }
    processGameSubjects(gameSubjects) {
        let amoeba = this.state.amoeba;
        gameSubjects.forEach((subject, index) => {
            if(subject.inProgress) {
                if(this.isSubjectPassed(subject, amoeba.color)) {
                    subject.completeCount = amoeba.eatenCount;
                    subject.completeColor = JSON.parse(JSON.stringify(amoeba.color));
                    subject.inProgress = false;
                    subject.transitionTime = Date.now();
                    gameSubjects[index + 1].inProgress = true;
                    gameSubjects[index + 1].transitionTime = Date.now();
                }
            }
        });
        return gameSubjects;
    }
    nextStep() {
        let state = this.state;
        let now = Date.now();
        let timeStep = now - state.lastUpdateTimestamp;
        let resizedPoints = this.resizePoints(this.state.points);
        let survivedPoints = this.killExpiredPoints(resizedPoints);
        let huntingResult = this.huntPoints(survivedPoints);
        let pullingPoints = this.resizePoints(this.pullPoints(this.state.pullingPoints));
        let swallowResult = this.swalloPullingPoints(pullingPoints);
        this.digestSwalloedPoints(swallowResult.swalloedPoints);
        let points = huntingResult.freePoints;
        let lastBreedTimestamp = state.lastBreedTimestamp;
        let breedTryingTime = 0;
        if(!state.isGameFinished && this.maxPoints > points.length && this.breedTime < (now - lastBreedTimestamp)) {
            let amoeba = this.state.amoeba;
            let newPoint = undefined;
            let shouldOpenMoveShild = now < state.lastMoveTimestamp + this.moveShild.time;
            let pointFreeDistance = amoeba.eatingSize + 20;
            if(shouldOpenMoveShild) { pointFreeDistance += this.moveShild.moreThanEating; }
            let minInterPointDistance = 2*amoeba.eatingSize + 20;
            while(!newPoint && this.maxBreedTryingTime > breedTryingTime) {
                newPoint = this.getNewPoint();
                // New point must outside of eating range.
                while(pointFreeDistance > Core.getDistance(amoeba.position, newPoint.position)) {
                    newPoint = this.getNewPoint();
                }
                // Cancel if new point too close to other points.
                let pointsPin = 0;
                while(newPoint && pointsPin < points.length) {
                    if(minInterPointDistance > Core.getDistance(newPoint.position, points[pointsPin].position)) {
                        newPoint = undefined;
                    }
                    ++pointsPin;
                }
                ++breedTryingTime;
            }
            if(newPoint) { points.push(newPoint); }
            lastBreedTimestamp = now;
        } else if(state.isGameFinished && this.breedTime/2 < (now - lastBreedTimestamp)) {
            let newPoint = undefined;
            while(!newPoint) {
                newPoint = this.getNewPoint();
                let positionOnImage = this.fitPointToBonusImage(
                    newPoint.position, state.baseDimension,
                    {x: this.bonusImage.width, y: this.bonusImage.height},
                );
                let color = this.getColorFromBonusImage(positionOnImage);
                newPoint.color = color;
                if(20 > color.red && 20 > color.green && 20 > color.blue) {
                    newPoint = undefined;
                }
            }
            newPoint.lifeTime = 100000;
            points.push(newPoint);
            lastBreedTimestamp = now;
        }
        let gameSubjects = this.processGameSubjects(state.gameSubjects);
        let isGameFinished = state.isGameFinished || !gameSubjects.filter(subject => !subject.completeColor)[0];
        this.setState({
            points: points,
            pullingPoints: swallowResult.pullingPoints.concat(huntingResult.huntedPoints),
            lastUpdateTimestamp: now, lastBreedTimestamp: lastBreedTimestamp,
            gameSubjects: gameSubjects, isGameFinished: isGameFinished,
        });
    }
    timeloop() {
        let now = Date.now();
        let maxTimeToLastUpdate = 1000/this.frequency;
        let timeToLastUpdate = now - this.state.lastUpdateTimestamp;
        if(maxTimeToLastUpdate < timeToLastUpdate) { this.nextStep(); }
    }
    onWindowScroll(e) { e.preventDefault(); return false; }
    componentDidMount() {
        window.setInterval(this.timeloop, 10);
        document.addEventListener('scroll', this.onWindowScroll, false);
        let baseDimension = {x: 2*this.refs.base.clientWidth, y: 2*this.refs.base.clientHeight};
        let amoeba = this.state.amoeba;
        amoeba.position = {x: 0.5*baseDimension.x, y: 0.5*baseDimension.y};
        this.setState({amoeba: amoeba, baseDimension: baseDimension});
        window.navigator.standalone = true;
    }
    componentWillUnmount() { document.removeEventListener('scroll', this.onWindowScroll, false); }
    render() {
        let state = this.state;
        return <div
            id='wrapper' className={ClassNames({'amoeba-hovering': this.state.amoebaHovering})}
            ref='base'
        >
            <ColorAmoeba
                amoeba={this.state.amoeba}
                points={this.state.points}
                pullingPoints={this.state.pullingPoints}
            />
            <GameSubject
                amoeba={this.state.amoeba}
                gameSubjects={this.state.gameSubjects}
            />
            <MouseTracker
                ref='mouseTracker'
                onMouseMove={this.onMouseMove}
                onMouseUp={this.onMouseUp}
                onTouchMove={this.onTouchMove}
            />
        </div>;
    }
}
module.exports = App;
