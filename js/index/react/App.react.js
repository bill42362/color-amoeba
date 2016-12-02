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
            points: [
                {position: {x: 10, y: 10}, size: 10, color: {red: 111, green: 222, blue: 33, alpha: 1}},
                {position: {x: 20, y: 20}, size: 10, color: {red: 11, green: 222, blue: 33, alpha: 1}},
            ],
            mousePosition: {x: -1, y: -1},
        };
        this.onMouseMove = this.onMouseMove.bind(this);
    }
    onMouseMove() {
        var mouseState = this.refs.mouseTracker.state;
        this.setState({mousePosition: mouseState.axis});
    }
    componentDidMount() { }
    componentWillUnmount() { }
    render() {
        let state = this.state;
        return <div id='wrapper' ref='base'>
            <ColorAmoeba points={this.state.points} />
            <MouseTracker
                ref='mouseTracker'
                onMouseMove={this.onMouseMove}
            />
        </div>;
    }
}
module.exports = App;
