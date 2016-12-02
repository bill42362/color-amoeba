// BootstrapInput.react.js
var React = require('react');
var ClassNames = require('classnames');
var BootstrapInput = React.createClass({
    getValue: function() { return this.refs.input.checked; },
    statusClassNameDictionary: {
        success: {formGroup: 'has-success',},
        warning: {formGroup: 'has-warning',},
        error: {formGroup: 'has-error',},
        info: {formGroup: 'has-info',},
        default: {formGroup: '',},
    },
    render: function() {
        var gridWidth = this.props.gridWidth || '12';
        var label = this.props.label || '';
        var autoFocus = this.props.autoFocus || false;
        var value = this.props.value;
        var readOnly = this.props.readOnly || false;
        var status = this.props.status || 'default';
        var inputUuid = Core.newUuid();

        var componentClassName = ClassNames(
            'col-md-' + gridWidth,
            this.statusClassNameDictionary[status].formGroup
        );
        return <div className={componentClassName}>
            <div className='checkbox'>
                <label htmlFor={inputUuid}>
                    <input
                        id={inputUuid} ref='input'
                        title={label} autoFocus={autoFocus}
                        type='checkbox' onBlur={this.props.onBlur}
                        checked={value} onChange={this.props.onChange}
                        readOnly={readOnly}
                    />
                    {label}
                </label>
            </div>
        </div>;
    }
});
module.exports = BootstrapInput;
