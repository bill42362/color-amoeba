// BootstrapStringsEditor.react.js
var BootstrapInput = require('./BootstrapInput.react.js');
var BootstrapStringsEditor = React.createClass({
	getInitialState: function() {
		return {
			draggingStringIndex: -1,
			lastEnteredIndex: -1,
		};
	},
    statusClassNameDictionary: {
        success: {formGroup: 'has-success'},
        warning: {formGroup: 'has-warning'},
        error: {formGroup: 'has-error'},
        default: {formGroup: ''},
    },
    swappedStrings: undefined,
    getValue: function() {
        var strings = [];
        var inputs = [];
        for(var key in this.refs) {
            if(0 === key.indexOf('settings-')) { inputs.push(this.refs[key]); }
        }
        for(var i = 0; i < inputs.length; ++i) {
            if(!!inputs[i].getValue()) { strings.push(inputs[i].getValue()); }
        }
        return this.swappedStrings || strings;
    },
    onChange: function() {
		if(this.props.parentOnChange) {
			this.props.parentOnChange(this.getValue());
		}
    },
    traceContainerOfElement: function(element) {
		var container = undefined;
		var target = element;
		while((undefined != target.parentNode) && (undefined === container)) {
			if(-1 != target.className.indexOf('string-draggable-container')) { container = target; }
			target = target.parentNode;
		}
        return container;
    },
	onStringDragStart: function(e) {
		if(-1 === e.target.className.indexOf('string-draggable-container')) { return; }
		var inputs = e.target.getElementsByTagName('input');
		inputs[0].focus(); inputs[0].blur();
		this.setState({draggingStringIndex: e.target.getAttribute('data-index')});
	},
	onStringDragEnd: function(e) {
		this.setState({lastEnteredIndex: -1, draggingStringIndex: -1});
	},
	onStringDragEnter: function(e) {
		var state = this.state;
		if(-1 === state.draggingStringIndex) { return; }
		var container = this.traceContainerOfElement(e.target);
		if(undefined === container) { return; }
		var recepterIndex = container.getAttribute('data-index');
		var ligandIndex = state.draggingStringIndex;
		if(-1 != state.lastEnteredIndex) {
			this.swapStrings(state.lastEnteredIndex, ligandIndex);
		}
		this.swapStrings(recepterIndex, ligandIndex);
		this.setState({lastEnteredIndex: recepterIndex});
	},
	swapStrings: function(a, b) {
		var stringList = this.props.strings;
		var tempString = stringList[a];
		stringList[a] = stringList[b];
		stringList[b] = tempString;
        this.swappedStrings = stringList;
		if(this.props.parentOnChange) {
			this.props.parentOnChange(this.getValue());
		}
	},
    componentWillUpdate: function() { this.swappedStrings = undefined; },
	render: function() {
        var gridWidth = this.props.gridWidth || '12';
        var label = this.props.label || '';
        var labelHidden = this.props.labelHidden || false;
        var titles = this.props.titles || [''];
        var status = this.props.status || 'default';
        var minCount = this.props.minCount || 0;
        var maxCount = this.props.maxCount || 0;
        var type = this.props.type || 'text';
        var strings = this.props.strings.concat();
        for(var i = strings.length; i < minCount; ++i) { strings.push(''); }
        if((0 === maxCount) || (maxCount > strings.length)) { strings.push(''); }
        else if(maxCount < strings.length) { strings.length = maxCount; }
        var maxColumnCount = this.props.maxColumnCount || 1;
        var stringsGridWidth = 12/maxColumnCount;
        if(strings.length < maxColumnCount) { stringsGridWidth = 12/strings.length; }
        var componentClassName = ClassNames(
            'strings-editor', 'form-group', 'col-md-' + gridWidth,
            this.statusClassNameDictionary[status].formGroup
        );
        var labelClassName = ClassNames('control-label', {'sr-only': labelHidden});
        var errorMessage = this.props.errorMessage || '';
		return <div className={componentClassName} ref='base'>
            <label className={labelClassName}>{label}</label>
            <div className='row'>
                {strings.map(function(string, index) {
                    var title = titles[index] || titles[0];
                    return <div
                        className={'string-draggable-container col-md-' + stringsGridWidth}
                        key={index} draggable={true}
                        data-index={index}
                        onDragStart={this.onStringDragStart}
                        onDragEnd={this.onStringDragEnd}
                        onDragEnter={this.onStringDragEnter}
                    >
                        <div className='row'>
                            <BootstrapInput
                                ref={'settings-' + index} gridWidth={'12'} headAddon={this.props.headAddon}
                                label={title} labelHidden={this.props.subLabelsHidden} title={title}
                                status={status} hasFeedback={true} errorMessage={errorMessage}
                                type={type} value={string} onChange={this.onChange}
                            />
                        </div>
                    </div>
                }, this)}
            </div>
		</div>
	},
})
module.exports = BootstrapStringsEditor;

//* vim: filetype=php.javascript.jsx
//* vim: dictionary=~/.vim/dict/javascript.dict
