var Core = require('./Core.js');

if(undefined === window.Core) { window.Core = function() {}; };
Core.EventCenter = function() {
	this.logsEvents = false;
	return this;
}
Core.EventCenter.Event = function(type, _target) {
	var self = this;
	this.type = type;
	this.target = _target;
	this.currentTarget = this.target;
	return this;
}
Core.eventCenter = new Core.EventCenter();

Core.EventCenter.prototype.registListenable = function(listenable, type) {
	// [type][{listener, callOnce}]
	var la = listenable;
	if(undefined === la.listenTable_) {
		la.listenTable_ = {};
	}
	if(undefined === la.listenTable_[type]) {
		la.listenTable_[type] = [];
	}
	return this;
}

Core.EventCenter.prototype.registListener = function(listenable, type, listener, opt_thisObject, opt_callOnce) {
	var la = listenable;
	var callOnce = opt_callOnce || false;

	this.registListenable(listenable, type);

	var listeners = la.listenTable_[type];
	var repeatedAndCallOnceSetted = function(e) {
		var is_repeat = false;
		if((e.listener === this) && (e.thisObject === opt_thisObject)) {
			e.callOnce = callOnce;
			is_repeat = true;
		}
		return is_repeat;
	}
	if(!listeners.filter(repeatedAndCallOnceSetted, listener)[0]) {
		listeners.push({listener: listener, callOnce: callOnce, thisObject: opt_thisObject || window});
	}
	return this;
}

Core.EventCenter.prototype.registOnceListener = function(listenable, type, listener, opt_thisObject) {
	return this.registListener(listenable, type, listener, opt_thisObject, true);
}

Core.EventCenter.prototype.removeListener = function(listenable, type, listener) {
	var la = listenable;
	var notTheSameListener = function(e) { return !(e.listener === listener); }
	if((undefined != la.listenTable_) && la.listenTable_[type]) {
		la.listenTable_[type] = la.listenTable_[type].filter(notTheSameListener);
	}
	return this;
}

Core.EventCenter.prototype.castEvent = function(listenable, type, data) {
	var la = listenable;

	this.registListenable(this, type);
	this.registListenable(listenable, type);

	var listeners = la.listenTable_[type].concat(this.listenTable_[type]);
	var event = new Core.EventCenter.Event(type, la);
	var notCallOnce = function(e) { return !e.callOnce; }

	event.data = data;
	for(var i = 0; i < listeners.length; ++i) {
		listeners[i].thisObject.ltn_ = listeners[i].listener;
		listeners[i].thisObject.ltn_(event);
		listeners[i].thisObject.ltn_ = undefined;
	}
	if(this.logsEvents) { console.log(listenable + ' cast ' + type); }
	la.listenTable_[type] = listeners.filter(notCallOnce);
	return this;
}
module.exports = Core.EventCenter;
