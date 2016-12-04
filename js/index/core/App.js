// App.js
var ReactDOM = require('react-dom');
var Core = require('../../common/core/Core.js');
var Wrapper = require('../react/App.react.js');

var onReadyStateChange = function onReadyStateChange(e) {
    if(document.readyState == 'complete') {
        ReactDOM.render(<Wrapper />, document.getElementById('app-root'));
    }   
};
document.addEventListener('readystatechange', onReadyStateChange);
