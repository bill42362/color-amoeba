// BootstrapSelect.react.js
var React = require('react');
var ClassNames = require('classnames');
var BootstrapSelect = React.createClass({
    getValue: function() { return this.refs.select.value; },
    statusClassNameDictionary: {
        success: {formGroup: 'has-success'},
        warning: {formGroup: 'has-warning'},
        error: {formGroup: 'has-error'},
        default: {formGroup: ''},
    },
    render: function() {
        var gridWidth = this.props.gridWidth || '12';
        var labelHidden = this.props.labelHidden || false;
        var label = this.props.label || '';
        var title = this.props.title || '';
        var autoFocus = this.props.autoFocus || false;
        var value = this.props.value || '';
        var status = this.props.status || 'default';
        var errorMessage = this.props.errorMessage || '';
        var selectUuid = Core.newUuid();
        var options = this.props.options;
        var optionElements = [];
        if(options && !!options.length) {
            options.map(function(option, index) {
                optionElements.push(<option
                    value={option.value || option.key || option.id || option} key={index}
                >
                    {option.display || option.value || option.name || option}
                </option>);
            }, this);
        }

        var componentClassName = ClassNames(
            'form-group', 'col-md-' + gridWidth,
            this.statusClassNameDictionary[status].formGroup
        );
        var labelClassName = ClassNames('control-label', {'sr-only': labelHidden});
        var helper = undefined, helpUuid = undefined;
        if((('error' === status) || ('warning' === status)) && !!errorMessage) {
            helpUuid = Core.newUuid();
            helper = <span id={helpUuid} className='help-block'>{errorMessage}</span>;
        }
        return <div className={componentClassName}>
            <label className={labelClassName} htmlFor={selectUuid}>{label}</label>
            <select
                className="form-control" id={selectUuid} ref='select'
                title={title} autoFocus={autoFocus} onBlur={this.props.onBlur}
                value={value} onChange={this.props.onChange}
                aria-describedby={helpUuid}
            >
                <option value=''>{title}</option>
                {optionElements}
            </select>
            {helper}
        </div>;
    }
});

module.exports = BootstrapSelect;

//* vim: filetype=php.javascript.jsx
//* vim: dictionary=~/.vim/dict/javascript.dict
