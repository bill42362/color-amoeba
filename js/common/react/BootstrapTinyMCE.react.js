// BootstrapTinymce.react.js
var React = require('react');
var ClassNames = require('classnames');
var TinyMCE = require('react-tinymce');
var BootstrapTinymce = React.createClass({
    getInitialState: function() {
        return {shouldCallback: false, textContent: '', inputUuid: Core.newUuid()};
    },
    onValueChange: function(e) {
        var textContent = e.target.getContent({format: 'raw'});
        textContent = textContent.replace(/<br>/ig, '<br />');
        textContent = textContent.replace(/&nbsp;</ig, '<');
        this.setState({shouldCallback: true, textContent: textContent});
    },
    getValue: function() { return this.state.textContent; },
    statusClassNameDictionary: {
        success: {formGroup: 'has-success', feedback: 'glyphicon-ok'},
        warning: {formGroup: 'has-warning', feedback: 'glyphicon-warning-sign'},
        error: {formGroup: 'has-error', feedback: 'glyphicon-remove'},
        info: {formGroup: 'has-info', feedback: ''},
        default: {formGroup: '', feedback: ''},
    },
    componentDidUpdate: function(prevProps, prevState) {
        var props = this.props, state = this.state;
        if(prevProps.value != props.value) {
            tinymce.EditorManager.get(state.inputUuid).setContent(props.value);
            this.setState({textContent: props.value});
        }
        if(state.shouldCallback && this.props.onChange) {
            this.setState({shouldCallback: false});
            this.props.onChange(state.textContent);
        }
    },
    render: function() {
        var gridWidth = this.props.gridWidth || '12';
        var labelHidden = this.props.labelHidden || false;
        var label = this.props.label || '';
        var config = this.props.config || {
            plugins: 'link image code preview media',
            toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code preview media'
        };
        var value = this.props.value || '';
        var status = this.props.status || 'default';
        var hasFeedback = this.props.hasFeedback || false;
        var errorMessage = this.props.errorMessage || '';
        var inputUuid = this.state.inputUuid;

        var componentClassName = ClassNames(
            'form-group', 'col-md-' + gridWidth, {'has-feedback': hasFeedback},
            this.statusClassNameDictionary[status].formGroup
        );
        var labelClassName = ClassNames('control-label', {'sr-only': labelHidden});
        var helper = undefined, helpUuid = undefined;
        if((('error' === status) || ('warning' === status)) && !!errorMessage) {
            helpUuid = Core.newUuid();
            helper = <span id={helpUuid} className='help-block'>{errorMessage}</span>;
        }
        var feedback = undefined;
        if(hasFeedback) {
            var feedbackClassName = this.statusClassNameDictionary[status].feedback;
            feedback = <span
                className={ClassNames('glyphicon form-control-feedback', feedbackClassName)}
                aria-hidden="true"
            ></span>;
        }
        return <div className={componentClassName}>
            <label className={labelClassName} htmlFor={inputUuid}>{label}</label>
            <TinyMCE
                className="form-control" id={inputUuid} ref='input'
                content={value} config={config}
                onChange={this.onValueChange} onBlur={this.props.onBlur}
                aria-describedby={helpUuid}
            />
            {feedback} {helper}
        </div>;
    }
});

module.exports = BootstrapTinymce;

//* vim: filetype=php.javascript.jsx
//* vim: dictionary=~/.vim/dict/javascript.dict
