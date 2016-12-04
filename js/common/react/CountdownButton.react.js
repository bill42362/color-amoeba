// CountdownButton.react.js
var ClassNames = require('classnames');
var CountdownButton = React.createClass({
    getInitialState: function() {
        return {
            canBeClick: true,
            secondsRemaining: 0,
            hasClicked: false,
        };
    },
    interval: undefined,
    startTick: function(seconds) {
        this.interval = setInterval(this.tick, 1000);
        var secondsRemaining = seconds;
        if((undefined === seconds) || (null === seconds)) {
            secondsRemaining = this.props.seconds;
        }
        if(!this.props.seconds) { secondsRemaining = 0; }
        this.setState({secondsRemaining: secondsRemaining});
    },
    tick: function() {
        var nextSecond = this.state.secondsRemaining - 1;
        var canBeClick = this.state.canBeClick;
        if(0 >= nextSecond) {
            canBeClick = true;
            clearInterval(this.interval);
        }
        this.setState({secondsRemaining: nextSecond, canBeClick: canBeClick});
    },
    onClick: function(e) {
        if(!this.props.disabled && this.state.canBeClick) {
            this.setState({hasClicked: true, canBeClick: false});
            if(this.props.onClick) { this.props.onClick(e); }
        }
    },
    componentWillUnmount: function() { clearInterval(this.interval); },
    render: function() {
        var secondsRemaining = this.state.secondsRemaining;
        var canBeClick = this.state.canBeClick;
        var buttonClassName = ClassNames(this.props.className, {'disabled': !canBeClick});
        var display = this.props.initialString;
        if(this.state.hasClicked) {
            if(0 < secondsRemaining) {
                display = this.props.countingString.replace(/%d/g, secondsRemaining);
            } else if(!canBeClick) {
                display = this.props.preCountingString;
            } else {
                display = this.props.countedString || this.props.initialString;
            }
        }
        return <button className={buttonClassName} onClick={this.onClick}>
            {display}
        </button>;
    }
});
module.exports = CountdownButton;

//* vim: filetype=php.javascript.jsx
//* vim: dictionary=~/.vim/dict/javascript.dict
