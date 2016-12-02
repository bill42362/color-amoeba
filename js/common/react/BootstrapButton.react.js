// BootstrapButton.react.js
var BootstrapButton = React.createClass({
    statusClassNameDictionary: {
        primary: {formGroup: '', button: 'btn-primary'},
        success: {formGroup: 'has-success', button: 'btn-success'},
        warning: {formGroup: 'has-warning', button: 'btn-warning'},
        danger: {formGroup: 'has-error', button: 'btn-danger'},
        info: {formGroup: 'has-info', button: 'btn-info'},
        default: {formGroup: '', button: 'btn-default'},
    },
    onClick: function(e) {
        if(!this.props.disabled && this.props.onClick) {
            this.props.onClick(e);
        }
    },
    render: function() {
        var gridWidth = this.props.gridWidth || '12';
        var labelHidden = this.props.labelHidden;
        var label = this.props.label;
        var title = this.props.title;
        var status = this.props.status || 'default';
        var disabled = this.props.disabled || false;
        var classNames
            = this.statusClassNameDictionary[status] || this.statusClassNameDictionary.default;
        var baseClassName = ClassNames(
            'form-group', 'col-md-' + gridWidth, classNames.formGroup
        );
        var labelClassName = ClassNames('control-label', {'sr-only': labelHidden});
        var buttonClassName = ClassNames('btn col-md-12', classNames.button, {'disabled': disabled});
        return <div className={baseClassName} ref='base'>
            <label className={labelClassName}>{label}</label>
            {!labelHidden && <br />}
            <button
                className={buttonClassName} type="button"
                title={title} onClick={this.onClick}
            >
                <span className='head-icon' aria-hidden={true} >
                    {this.props.headIcon}
                </span>
                {title}
                <span className='tail-icon' aria-hidden={true} >
                    {this.props.tailIcon}
                </span>
            </button>
        </div>;
    }
});
module.exports = BootstrapButton;

//* vim: filetype=php.javascript.jsx
//* vim: dictionary=~/.vim/dict/javascript.dict
