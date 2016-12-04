// BootstrapOrderSwapper.react.js
var BootstrapOrderSwapper = React.createClass({
    getInitialState: function() {
        return {
            items: this.props.value, shouldCallOnChange: false,
            draggingItemIndex: -1, lastEnteredIndex: -1,
        };
    },
    getValue: function() { return this.state.items; },
    traceHandlerOfItem: function(element) {
		var handler = undefined;
		var target = element;
		while((undefined != target.parentNode) && (undefined === handler)) {
			if(-1 != target.className.indexOf('item-draggable-handler')) { handler = target; }
			target = target.parentNode;
		}
        return handler;
    },
	onItemDragStart: function(e) {
		if(-1 === e.target.className.indexOf('item-draggable-handler')) { return; }
        e.target.blur();
		this.setState({draggingItemIndex: e.target.getAttribute('data-index')});
	},
	onItemDragEnter: function(e) {
		var state = this.state;
		if(-1 === state.draggingItemIndex) { return; }
		var handler = this.traceHandlerOfItem(e.target);
		if(undefined === handler) { return; }
		var recepterIndex = handler.getAttribute('data-index');
		var ligandIndex = state.draggingItemIndex;
		if(-1 != state.lastEnteredIndex) {
			this.swapItems(state.lastEnteredIndex, ligandIndex);
		}
		this.swapItems(recepterIndex, ligandIndex);
        this.setState({lastEnteredIndex: recepterIndex});
	},
	onItemDragEnd: function(e) {
		this.setState({lastEnteredIndex: -1, draggingItemIndex: -1});
	},
	swapItems: function(a, b) {
		var items = this.state.items;
		var tempItem = JSON.parse(JSON.stringify(items[a]));
		items[a] = items[b];
		items[b] = tempItem;
        this.setState({items: items, shouldCallOnChange: true});
	},
    componentWillReceiveProps: function(nextProps) {
        this.setState({items: nextProps.value});
    },
    componentDidUpdate: function(prevProps, prevState) {
        if(this.state.shouldCallOnChange && this.props.onChange) {
            this.props.onChange(this.getValue());
            this.setState({shouldCallOnChange: false});
        }
    },
    render: function() {
        var maxColumnCount = this.props.maxColumnCount || 4;
        var items = this.state.items || [];
        var itemGroups = [];
        for(var i = 0, length = items.length; i < length; i += maxColumnCount) {
            itemGroups.push(items.slice(i, i + maxColumnCount));
        }
        return <div className='order-swapper col-md-12'>
            {itemGroups.map(function(itemGroup, groupIndex) {
                return <div
                    className="btn-group btn-group-justified" role="group" key={groupIndex}
                    aria-label="Button groups of draggable handler for items swapping."
                >
                    {itemGroup.map(function(item, index) {
                        return <div className="btn-group" role="group" key={index}>
                            <button
                                type="button" className="item-draggable-handler btn btn-default"
                                draggable={true} title={item.display}
                                data-index={groupIndex*maxColumnCount + index}
                                onDragStart={this.onItemDragStart}
                                onDragEnter={this.onItemDragEnter}
                                onDragEnd={this.onItemDragEnd}
                            >{item.display}</button>
                        </div>;
                    }, this)}
                </div>;
            }, this)}
        </div>;
    }
});
module.exports = BootstrapOrderSwapper;
