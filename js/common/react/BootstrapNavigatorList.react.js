// BootatrapNavigatorList.react.js
var React = require('react');
var ClassNames = require('classnames');
var BootatrapNavigatorList = React.createClass({
    getInitialState: function() {
        return { topAnchorId: '', };
    },
    getNavigatorItemsFromNode: function(node) {
        var topAnchorId = this.state.topAnchorId;
        var result = [
            <a
                href={'#' + node.id}
                className={ClassNames(
                    'list-group-item',
                    {'list-group-item-info': node.id === topAnchorId}
                )}
            >{node.display}{node.tailElement}</a>
        ];
        if(0 != node.subNodes.length) {
            var subNodesWithIndicator = node.subNodes.filter(function(subNode) {
                return topAnchorId === subNode.id;
            }, this);
            var shouldExpendlistGroupFolder = 0 != subNodesWithIndicator.length || node.id === topAnchorId;
            var height = 0;
            if(shouldExpendlistGroupFolder) {
                var foldedListGroupElements = Core.nodeListToArray(
                    document.getElementsByClassName('list-group-folded')
                );
                var thisListGroup = foldedListGroupElements.filter(function(element) {
                    return node.id === element.getAttribute('data-parent_id');
                }, this)[0];
                if(thisListGroup) { height = thisListGroup.clientHeight + 30; }
            }
            var style = {height: height + 'px'};
            result.push(<div
                className={ClassNames(
                    'list-group list-group-item list-group-folder',
                    {'collapse': !shouldExpendlistGroupFolder}
                )}
                style={style}
            >
                <div className='list-group-folded' data-parent_id={node.id} >
                    {node.subNodes.map(this.getNavigatorItemsFromNode, this)}
                </div>
            </div>);
        }
        return result;
    },
    distanceToScreenTop: function(element) {
        var clientRect = element.getBoundingClientRect();
        var elementCenter = 0.5*(clientRect.top + clientRect.bottom);
        return Math.abs(elementCenter);
    },
    getTopAnchorId: function() {
        var anchorNodes = document.getElementsByClassName('anchor');
        var anchors = [];
        for(var i = 0; i < anchorNodes.length; ++i) { anchors.push(anchorNodes[i]); }
        var anchorOnScreenResults = anchors.map(function(anchor) {
            return {element: anchor, distanceToScreenTop: this.distanceToScreenTop(anchor),};
        }, this);
        var topAnchor = anchorOnScreenResults.reduce(function(a, b) {
            if(a.distanceToScreenTop > b.distanceToScreenTop) { return b; }
            else { return a; }
        }, anchorOnScreenResults[0]);
        return topAnchor.element.id;
    },
    onWindowScroll: function(e) {
        this.setState({topAnchorId: this.getTopAnchorId()});
    },
    componentDidMount: function() {
        this.setState({topAnchorId: this.getTopAnchorId()});
        document.addEventListener('scroll', this.onWindowScroll, false);
    },
    componentWillUnmount: function() {
        document.removeEventListener('scroll', this.onWindowScroll, false);
    },
    render: function() {
        var navigatorTree = this.props.navigatorTree;
        return <div className="page-anchor-list list-group list-group-root">
            <a href="#top" className="list-group-item active">Top</a>
            {navigatorTree.map(this.getNavigatorItemsFromNode, this)}
        </div>;
    }
});
module.exports = BootatrapNavigatorList;

//* vim: filetype=php.javascript.jsx
//* vim: dictionary=~/.vim/dict/javascript.dict
