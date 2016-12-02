var Core = require('../../common/core/Core.js');
var DateInput = React.createClass({
    getInitialState: function(e) {
        return { year: undefined, month: undefined, day: undefined, time: '00:00' }
    },
    onChange: function(e) {
        var state = this.state;
        state.year = this.refs.year.value;
        state.month = this.refs.month.value;
        state.day = this.refs.day.value;
        if(!!this.refs.time) { state.time = this.refs.time.value; }
        this.setState(state);
        if(this.props.parentOnDateChange) {
            this.props.parentOnDateChange(this.getDate());
        }
    },
    getDate: function() {
        var year = Number(this.refs.year.value);
        var month = Number(this.refs.month.value) - 1;
        var day = Number(this.refs.day.value);
        var time = this.state.time;
        if(!!this.refs.time) { time = this.refs.time.value; }
        var hours = Number(time.slice(0, -3));
        var minutes = Number(time.slice(3));
        return new Date(year, month, day, hours, minutes).getTime()/1000;
    },
    render: function() {
        var disabled = this.props.disabled;
        var title = this.props.title;

        var year = this.state.year;
        var month = this.state.month;
        var date = this.state.day;
        var time = this.state.time;
        if(this.props.timestampSecond) {
            var dateObject = new Date(this.props.timestampSecond*1000);
            year = dateObject.getFullYear();
            month = dateObject.getMonth() + 1;
            date = dateObject.getDate();
            time = Core.getDateStringWithFormat(dateObject.getTime(), 'hh:mm');
        }

        // Make option arrays.
        var thisYear = new Date(Date.now()).getFullYear();
        var yearRange = this.props.yearRange || [thisYear - 10, thisYear + 10];
        var yearArray = [];
        for(var i = yearRange[0]; i <= yearRange[1]; ++i) { yearArray.push(i); }
        var monthArray = [];
        for(var i = 1; i < 13; ++i) { monthArray.push(i); }
        var monthDayArray = [28, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        var dayArray = [];
        if((0 === year%400) || ((0 === year%4) && (0 != year%100))) {
            monthDayArray[2] = 29;
        }
        var monthDay = monthDayArray[month] || monthDayArray[0];
        for(var i = 1; i <= monthDay; ++i) { dayArray.push(i); }

        // Make errorMessage.
		var errorMessage = undefined;
        year = Number(year); month = Number(month); date = Number(date);
        if((year || month || date) && (!year || !month || !date)) {
            var errorString = '日期錯誤';
            if(!year) { errorString = '請選擇年份'; }
            else if(!month) { errorString = '請選擇月份'; }
            else if(!date) { errorString = '請選擇日期'; }

            errorMessage = <li className='errorInfo' ref='errorMessage'>{errorString}</li>;
        }

        // Make time input.
        var timeInput = undefined;
        if(this.props.enableTime) {
            timeInput = <input
                className='date-selector-time' ref='time' type='time' title={title}
                disabled={disabled} value={time} onChange={this.onChange}
            />;
        }

        return <div className='date-input'>
            <select
                className="dateSelectorYear" ref="year" title={title}
                disabled={disabled} value={year || '西元'} onChange={this.onChange}
            >
                <option value="西元">西元</option>
                {yearArray.map((year) => {
                    return <option value={year} key={year}>{year}</option>
                })}
            </select>

            <select
                className="dateSelectorMonth" ref="month" title={title}
                disabled={disabled} value={month || '月'} onChange={this.onChange}
            >
                <option value="月">月</option>
                {monthArray.map((month) => {
                    return <option value={month} key={month}>{month}</option>
                })}
            </select> 

            <select
                className="dateSelectorDay" ref="day" title={title}
                disabled={disabled} value={date || '日'} onChange={this.onChange}
            >
                <option value="日">日</option>
                {dayArray.map((day) => {
                    return <option value={day} key={day}>{day}</option>
                })}
            </select>
            <span> </span>
            {timeInput}
            {errorMessage}
        </div>;
    }
})
module.exports = DateInput;

//* vim: filetype=php.javascript.jsx
//* vim: dictionary=~/.vim/dict/javascript.dict
