// DataPanel.react.js
'use strict'
import React from 'react';

class MouseTracker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            prev: null,
            axis: {x: 0, y: 0},
            move: {x: 0, y: 0},
            wheel: null,
            key: {left: false, middle: false, right: false},
            callBackFunctions: [],
        };
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onContextMenu = this.onContextMenu.bind(this);
        // Operations usually carried out in componentWillMount go here
    }
    onMouseMove(e) {
        const state = this.state;
        state.axis.x = e.nativeEvent.offsetX;
        state.axis.y = e.nativeEvent.offsetY;
        if(state.prev) {
            state.move.x = state.axis.x - state.prev.axis.x;
            state.move.y = state.axis.y - state.prev.axis.y;
        }
        let callBackFunctions = [];
        if(this.props.onMouseMove) { callBackFunctions.push(this.props.onMouseMove); }
        if((state.key.left || state.key.middle || state.key.right) && this.props.onMouseDrag) {
            callBackFunctions.push(this.props.onMouseDrag);
        }
        state.callBackFunctions = callBackFunctions;
        state.prev = this.getPrevState();
        this.setState(state);
    }
    onContextMenu(e) { e.preventDefault(); return false; }
    onMouseDown(e) {
        const state = this.state;
        state.prev = this.getPrevState();
        if(0 === e.button) { state.key.left = true; }
        if(1 === e.button) { state.key.middle = true; }
        if(2 === e.button) { state.key.right = true; }
        let callBackFunctions = [];
        if(this.props.onMouseDown) { callBackFunctions.push(this.props.onMouseDown); }
        state.callBackFunctions = callBackFunctions;
        this.setState(state);
    }
    onMouseUp(e) {
        const state = this.state;
        state.prev = this.getPrevState();
        if(0 === e.button) { state.key.left = false; }
        if(1 === e.button) { state.key.middle = false; }
        if(2 === e.button) { state.key.right = false; }
        let callBackFunctions = [];
        if(this.props.onMouseUp) { callBackFunctions.push(this.props.onMouseUp); }
        state.callBackFunctions = callBackFunctions;
        this.setState(state);
    }
    getPrevState() {
        const s = this.state;
        return {
            axis: {x: s.axis.x, y: s.axis.y},
            move: {x: s.move.x, y: s.move.y},
            wheel: s.wheel,
            key: {left: s.key.left, middle: s.key.middle, right: s.key.right} };
    }
    componentDidUpdate(prevProps, prevState) {
        var callBackFunctions = this.state.callBackFunctions.concat();
        if(callBackFunctions.length) {
            callBackFunctions.forEach(callBackFunction => {
                callBackFunction(this.state);
            });
            this.setState({callBackFunctions: []});
        }
    }
    render() {
        const state = this.state;
        return <div
            ref='div' className='mouse-tracker'
            onMouseMove={this.onMouseMove}
            onMouseUp={this.onMouseUp}
            onMouseDown={this.onMouseDown}
            onContextMenu={this.onContextMenu}
            onTouchMove={this.props.onTouchMove}
        ></div>;
    }
}
module.exports = MouseTracker;

//* vim: filetype=php.javascript.jsx
//* vim: dictionary=~/.vim/dict/javascript.dict
