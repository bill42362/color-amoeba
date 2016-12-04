// BootstrapBarchart.react.js
var React = require('react');
var ClassNames = require('classnames');
var BootstrapProgressBar = require('./BootstrapProgressBar.react.js');
var BootstrapBarchart = React.createClass({
    getInitialState: function() {
        return {
            value: {groupId: '', typeKey: ''},
            shouldCallOnChange: false,
        };
    },
    getValue: function() { return this.state.value; },
    onBarClicked: function(data) { this.setState({ value: data, shouldCallOnChange: true, }); },
    onGroupClicked: function(e) {
        var target = e.target, groupElement = undefined;
        while(target.parentNode && !groupElement) {
            if(-1 != target.className.indexOf('bar-chart-group')) {
                groupElement = target;
            } else {
                target = target.parentNode;
            }
        }
        var groupId = groupElement.getAttribute('data-group_id');
        this.setState({ value: {groupId: groupId, typeKey: ''}, shouldCallOnChange: true, });
    },
    componentDidUpdate: function(prevProps, prevState) {
        if(this.state.shouldCallOnChange && this.props.onChange) {
            this.props.onChange(this.getValue());
            this.setState({shouldCallOnChange: false});
        }
    },
    render: function() {
        var state = this.state;
        var props = this.props;
        var barTypes = props.barTypes || [];
        var barGroups = props.barGroups || [];
        var datas = props.datas || [];
        var processedBarGroups = barGroups.map((barGroup, index) => {
            var groupDataCount = 0;
            var bars = barTypes.map(barType => {
                var count = datas.filter(data => {
                    return barType.key === data.type && barGroup.id === data.group;
                }).length;
                groupDataCount += count;
                return {
                    color: barType.color, count: count,
                    display: count, title: barType.display,
                    data: {groupId: barGroup.id, typeKey: barType.key},
                };
            });
            bars = bars.map(bar => {
                bar.percent = 100*bar.count/groupDataCount + '%';
                return bar;
            });
            return {props: barGroup, bars: bars};
        });
        var usingBarTypes = barTypes.filter(barType => {
            return datas.some(data => { return barType.key === data.type; });
        });
        return <div className='bar-chart row'>
            {processedBarGroups.map(function(barGroup, index) {
                var className = ClassNames(
                    'bar-chart-group', 'col-md-12',
                    {'selected': state.value.groupId === barGroup.props.id}
                );
                return <div
                    className={className} key={index}
                    data-group_id={barGroup.props.id} onClick={this.onGroupClicked}
                >
                    <label className='title'>
                        {barGroup.props.display}
                        <span className='labels'>{barGroup.props.postAddons}</span>
                    </label> 
                    <BootstrapProgressBar bars={barGroup.bars} onClick={this.onBarClicked} />
                </div>;
            }, this)}
            {!!usingBarTypes.length && <div className='bar-chart-figure-legends'>
                {usingBarTypes.map(function(barType, index) {
                    return <span className='bar-chart-figure-legend' key={index}>
                        <span
                            className={ClassNames('label')}
                            style={{backgroundColor: barType.color}}
                        >&nbsp;</span>
                        {barType.display}
                    </span>;
                })}
            </div>}
        </div>;
    }
});

module.exports = BootstrapBarchart;
