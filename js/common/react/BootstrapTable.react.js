// BootstrapTable.react.js
var React = require('react');
var ClassNames = require('classnames');
var BootstrapTable = React.createClass({
    staticStrings: {
        activatedRow: {string: '被選擇的列', context: 'Indicate activated row for screen readers.'},
    },
    onItemSelected: function(e) {
        var target = e.target;
        var trElement = undefined;
        while((undefined != target) && (undefined === trElement)) {
            if('TR' === target.tagName) { trElement = target; }
            else { target = target.parentNode; }
        }
        if(undefined != trElement) {
            if(this.props.onItemSelected) {
                this.props.onItemSelected(trElement.getAttribute('data-index'));
            }
        }
    },
    render: function() {
        var strings = this.staticStrings;
        var titleList = this.props.titleList || [];
        var dataList = this.props.dataList || [];
        var activatedDataIndex = this.props.activatedDataIndex;
        return <table className="table table-hover table-selectable table-orderable">
            <thead>
                <tr>
                    {titleList.map(function(title, index) {
                        return <th className="" key={index}>{title.string}</th>;
                    }, this)}
                </tr>
            </thead>
            <tbody>
                {dataList.map(function(data, dataIndex) {
                    var isActivatedData = (activatedDataIndex === dataIndex);
                    return <tr
                        className={ClassNames({'active': isActivatedData})}
                        key={dataIndex}
                        data-index={dataIndex}
                        onClick={this.onItemSelected}
                    >
                        {titleList.map(function(title, titleIndex) {
                            var tdClassName = 'default';
                            if(data.contextDictionary) {
                                tdClassName = data.contextDictionary[title.key] || 'default';
                            }
                            return <td className={tdClassName} key={titleIndex}>
                                {data[title.key]}
                                {isActivatedData && <span className='sr-only'>
                                    {strings.activatedRow.string}
                                </span>}
                            </td>;
                        }, this)}
                    </tr>;
                }, this)}
            </tbody>
        </table>;
    }
});

module.exports = BootstrapTable;

//* vim: filetype=php.javascript.jsx
//* vim: dictionary=~/.vim/dict/javascript.dict
