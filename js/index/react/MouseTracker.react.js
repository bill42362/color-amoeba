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
            key: {left: 0, middle: 0, right: 0},
            callBackFunctions: [],
        };
        this.onMouseMove = this.onMouseMove.bind(this);
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
    getPrevState() {
        const s = this.state;
        return {
            axis: {x: s.axis.x, y: s.axis.y},
            move: {x: s.move.x, y: s.move.y},
            wheel: s.wheel,
            key: {left: s.key.left, middle: s.key.middle, right: s.key.right}
        };
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
        ></div>;
    }
}
module.exports = MouseTracker;

//* vim: filetype=php.javascript.jsx
//* vim: dictionary=~/.vim/dict/javascript.dict
