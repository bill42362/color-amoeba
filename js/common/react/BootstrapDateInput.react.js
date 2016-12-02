var Core = require('../../common/core/Core.js');
var BootstrapInput = require('./BootstrapInput.react.js');
var BootstrapDateInput = React.createClass({
    getInitialState: function(e) {
        var dateString = undefined;
        var dateObject = undefined;
        if(this.props.timestampSecond) { dateObject = new Date(this.props.timestampSecond*1000); }
        if(dateObject) {
            dateString = Core.getDateStringWithFormat(dateObject.getTime(), 'YYYY/MM/DD hh:mm');
        }
        return { dateString: dateString, shouldCallOnChange: false, shouldWarnOnInput: true, };
    },
    onChange: function(e) { this.setState({dateString: this.refs.date.getValue(),}); },
    getDateFromString: function(dateString) {
        var result = undefined;
        var datePharser = '^.*(\\d{4})[^\\d]+(\\d+)[^\\d]+(\\d+)[^\\d]+(\\d+)[^\\d]+(\\d+).*$';
        var matchResult = dateString.match(datePharser);
        if(matchResult) {
            var year = matchResult[1];
            var month = matchResult[2] - 1;
            var date = matchResult[3];
            var hour = matchResult[4];
            var minute = matchResult[5];
            result = new Date(year, month, date, hour, minute);
        }
        return result;
    },
    getDate: function() {
        var result = undefined;
        var dateString = this.refs.date.getValue();
        var dateObject = undefined;
        if(dateString) { dateObject = this.getDateFromString(dateString); }
        if(dateObject) { result = dateObject.getTime()/1000; }
        return result;
    },
    getValue: function() { return this.getDate(); },
    onBlur: function(e) {
        var dateString = undefined;

        // Use dateString from props.
        var propsDateObject = undefined;
        if(this.props.timestampSecond) { propsDateObject = new Date(this.props.timestampSecond*1000); }
        if(propsDateObject) {
            dateString = Core.getDateStringWithFormat(propsDateObject.getTime(), 'YYYY/MM/DD hh:mm');
        }

        var tempDateString = this.refs.date.getValue();
        var dateObject = undefined;
        if(tempDateString) { dateObject = this.getDateFromString(tempDateString); }
        else { this.setState({dateString: '', shouldCallOnChange: true}); }
        if(dateObject) {
            dateString = Core.getDateStringWithFormat(dateObject.getTime(), 'YYYY/MM/DD hh:mm');
            this.setState({dateString: dateString, shouldCallOnChange: true, shouldWarnOnInput: true});
        } else if(!tempDateString) {
            this.setState({dateString: tempDateString, shouldWarnOnInput: true});
        } else {
            this.setState({dateString: tempDateString, shouldWarnOnInput: false});
        }
    },
    componentWillReceiveProps: function(nextProps) {
        var dateString = undefined;
        var dateObject = undefined;
        if(nextProps.timestampSecond) { dateObject = new Date(nextProps.timestampSecond*1000); }
        if(dateObject) {
            dateString = Core.getDateStringWithFormat(dateObject.getTime(), 'YYYY/MM/DD hh:mm');
            this.setState({dateString: dateString, shouldWarnOnInput: true});
        } else if(!nextProps.timestampSecond) {
            this.setState({dateString: dateString, shouldWarnOnInput: true});
        } else {
            this.setState({dateString: dateString});
        }
    },
    componentDidUpdate: function(prevProps, prevState) {
        if(this.state.shouldCallOnChange && this.props.parentOnDateChange) {
            this.props.parentOnDateChange(this.getDate());
            this.setState({shouldCallOnChange: false});
        }
    },
    render: function() {
        var state = this.state;
        var props = this.props;
        var inputStatus = 'default';
        if(!!props.errorMessage) { inputStatus = 'error'; }
        else if(!state.shouldWarnOnInput) { inputStatus = 'warning'; }

        return <BootstrapInput
            ref='date' gridWidth={props.gridWidth} hasFeedback={props.hasFeedback}
            headAddon={props.headAddon} tailAddon={props.headAddon}
            label={props.label} labelHidden={false}
            title={'Ex: 2016/06/01 18:30'}
            status={inputStatus}
            errorMessage={props.errorMessage}
            type={'text'} value={state.dateString} disabled={props.disabled}
            onBlur={this.onBlur} onChange={this.onChange}
        />;
    }
})
module.exports = BootstrapDateInput;

//* vim: filetype=php.javascript.jsx
//* vim: dictionary=~/.vim/dict/javascript.dict
