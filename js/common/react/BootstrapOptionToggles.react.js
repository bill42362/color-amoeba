// BootstrapOptionToggles.react.js
var BootstrapOptionToggles = React.createClass({
    statusClassNameDictionary: {
        success: {formGroup: 'has-success'},
        warning: {formGroup: 'has-warning'},
        error: {formGroup: 'has-error'},
        info: {formGroup: 'has-info'},
        default: {formGroup: ''},
    },
    getValue: function() {
        var enabledOptions = [];
        var buttons = this.refs.base.getElementsByTagName('button');
        for(var i = 0; i < buttons.length; ++i) {
            if('true' === buttons[i].getAttribute('data-enabled')) {
                enabledOptions.push(buttons[i].getAttribute('data-option_key'));
            }
        }
        return enabledOptions;
    },
    onChange: function(e) {
        var target = e.target, optionEnabled = undefined;
        while(!!target && !optionEnabled) {
            if('BUTTON' === target.tagName) {
                optionEnabled = target.getAttribute('data-enabled');
            } else {
                target = target.parentNode;
            }
        }
        if(!!optionEnabled) {
            var newOptionEnabled = ('true' === optionEnabled) ? 'false' : 'true';
            target.setAttribute('data-enabled', newOptionEnabled);
            if(this.props.onChange) { this.props.onChange(this.getValue()); }
        }
    },
    render: function() {
        var gridWidth = this.props.gridWidth || '12';
        var label = this.props.label;
        var labelHidden = this.props.labelHidden;
        var hasFeedback = this.props.hasFeedback || false;
        var status = this.props.status || 'default';
        var options = this.props.options || [];
        var maxColumnCount = this.props.maxColumnCount || 4;
        var values = this.props.values || [];
        var strings = this.staticStrings;
        var baseClassName = ClassNames(
            'option-toggles form-group', 'col-md-' + gridWidth, {'has-feedback': hasFeedback},
            this.statusClassNameDictionary[status].formGroup
        );
        var labelClassName = ClassNames('control-label', {'sr-only': labelHidden});
        var optionGroups = [];
        for(var i = 0, length = options.length; i < length; i += maxColumnCount) {
            optionGroups.push(options.slice(i, i + maxColumnCount));
        }
        return <div className={baseClassName} ref='base'>
            <label className={labelClassName}>{label}</label>
            {optionGroups.map(function(optionGroup, groupIndex) {
                return <div
                    className="btn-group btn-group-justified" key={groupIndex}
                    role="group" aria-label={label}
                >
                    {optionGroup.map(function(option, index) {
                        var optionKey = option.value || option.key || option.id || option;
                        var optionDisplay = option.display || option.value || option.name || option;
                        var enabled = values.includes(optionKey) ? 'true' : 'false';
                        var buttonStatusClassName = 'btn-default';
                        if('error' === status) {
                            buttonStatusClassName = 'btn-danger';
                        } else if('true' == enabled) {
                            buttonStatusClassName = 'btn-success';
                        }
                        var buttonClassName = ClassNames('btn', buttonStatusClassName);
                        var icon = this.props.uncheckedIcon;
                        if('true' == enabled) { icon = this.props.checkedIcon; }
                        return <div className="btn-group" role="group" key={index}>
                            <button
                                className={buttonClassName} type="button"
                                title={optionDisplay}
                                data-option_key={optionKey} data-enabled={enabled}
                                onClick={this.onChange}
                            >
                                {icon} {optionDisplay}
                            </button>
                        </div>;
                    }, this)}
                </div>;
            }, this)}
        </div>;
    }
});
module.exports = BootstrapOptionToggles;

//* vim: filetype=php.javascript.jsx
//* vim: dictionary=~/.vim/dict/javascript.dict
