// BootstrapProgressBar.react.js
var ClassNames = require('classnames');

var BootstrapProgressBar = React.createClass({
    contextClassNameDictionary: {
        primary: {progressBar: '',},
        success: {progressBar: 'progress-bar-success',},
        warning: {progressBar: 'progress-bar-warning',},
        error: {progressBar: 'progress-bar-danger',},
        info: {progressBar: 'progress-bar-info',},
        default: {progressBar: '',},
    },
    onClick: function(e) {
        e.stopPropagation();
        var target = e.target, bar = undefined;
        while(target.parentNode && !bar) {
            if(-1 != target.className.indexOf('progress-bar')) { bar = target; }
            target = target.parentNode;
        }
        var data = JSON.parse(bar.getAttribute('data-data'));
        if(data && this.props.onClick) { this.props.onClick(data); }
        return false;
    },
    render: function() {
        var bars = this.props.bars || [];
        return <div className="progress">
            {bars.map(function(bar, index) {
                var statusClassNames = this.contextClassNameDictionary[bar.context];
                var progressClassName = 'progress-bar-' + bar.context;
                if(statusClassNames) { progressClassName = statusClassNames.progressBar; }
                var className = ClassNames('progress-bar', progressClassName);
                return <div
                    className={className} key={index}
                    style={{width: bar.percent, backgroundColor: bar.color}}
                    title={bar.title || bar.statusString} role='progressbar'
                    data-data={JSON.stringify(bar.data)} onClick={this.onClick}
                >
                    <span>{bar.display}</span>
                </div>;
            }, this)}
        </div>;
    }
});
module.exports = BootstrapProgressBar;

//* vim: filetype=php.javascript.jsx
//* vim: dictionary=~/.vim/dict/javascript.dict
