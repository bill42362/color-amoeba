// BootstrapInput.react.js
var React = require('react');
var ClassNames = require('classnames');
var BootstrapInput = React.createClass({
    getValue: function() { return this.refs.input.value; },
    statusClassNameDictionary: {
        success: {formGroup: 'has-success', feedback: 'glyphicon-ok'},
        warning: {formGroup: 'has-warning', feedback: 'glyphicon-warning-sign'},
        error: {formGroup: 'has-error', feedback: 'glyphicon-remove'},
        info: {formGroup: 'has-info', feedback: ''},
        default: {formGroup: '', feedback: ''},
    },
    render: function() {
        var gridWidth = this.props.gridWidth || '12';
        var labelHidden = this.props.labelHidden || false;
        var label = this.props.label || '';
        var type = this.props.type || 'text';
        var title = this.props.title || '';
        var headAddon = this.props.headAddon || '';
        var tailAddon = this.props.tailAddon || '';
        var autoFocus = this.props.autoFocus || false;
        var value = this.props.value;
        var readOnly = this.props.readOnly || false;
        var status = this.props.status || 'default';
        var shouldShowFeedback = (this.props.hasFeedback || false) && 'default' != status;
        var errorMessage = this.props.errorMessage || '';
        var inputUuid = Core.newUuid();
        var dataList = this.props.dataList;
        var dataListUuid = undefined;
        var dataListElement = undefined;
        if(dataList && !!dataList.length) {
            dataListUuid = Core.newUuid();
            dataListElement = <datalist id={dataListUuid}>
                {dataList.map(function(data, index) {
                    return <option value={data} key={index} />
                }, this)}
            </datalist>;
        }

        var componentClassName = ClassNames(
            this.props.className, 'form-group', {'has-feedback': shouldShowFeedback},
            'col-md-' + gridWidth, this.statusClassNameDictionary[status].formGroup
        );
        var labelClassName = ClassNames('control-label', {'sr-only': labelHidden});
        var helper = undefined, helpUuid = undefined;
        if((('error' === status) || ('warning' === status)) && !!errorMessage) {
            helpUuid = Core.newUuid();
            helper = <span id={helpUuid} className='help-block'>{errorMessage}</span>;
        }
        var input = <input
            className="form-control" id={inputUuid} ref='input'
            title={title} placeholder={title} autoFocus={autoFocus}
            type={type} list={dataListUuid} onBlur={this.props.onBlur}
            value={value} onChange={this.props.onChange}
            aria-describedby={helpUuid} readOnly={readOnly}
        />;
        if('textarea' === type) {
            input = <textarea
                className="form-control" id={inputUuid} ref='input'
                title={title} placeholder={title} autoFocus={autoFocus}
                value={value} onChange={this.props.onChange}
                aria-describedby={helpUuid} onBlur={this.props.onBlur}
            />;
        }
        var inputGroup = input;
        if(headAddon || tailAddon) {
            inputGroup = <div className='input-group'>
                {!!headAddon && <span className="input-group-addon">{headAddon}</span>}
                {input}
                {!!tailAddon && <span className="input-group-addon">{tailAddon}</span>}
            </div>;
        }
        var feedback = undefined;
        if(shouldShowFeedback) {
            var feedbackClassName = this.statusClassNameDictionary[status].feedback;
            feedback = <span
                className={ClassNames('glyphicon form-control-feedback', feedbackClassName)}
                aria-hidden="true"
            ></span>;
        }
        return <div className={componentClassName}>
            <label className={labelClassName} htmlFor={inputUuid}>{label}</label>
            {inputGroup} {dataListElement}
            {feedback} {helper}
        </div>;
    }
});

module.exports = BootstrapInput;

//* vim: filetype=php.javascript.jsx
//* vim: dictionary=~/.vim/dict/javascript.dict
