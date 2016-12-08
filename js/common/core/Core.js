var MersenneTwister = require('mersenne-twister');
var NodeCrypto = require('crypto');

if(undefined === window.Core) { window.Core = function() {}; };
Core.object = function() {
	return this;
}; Core.object.prototype = Core.prototype;

Core.random = Math.random;
if(window.MersenneTwister) {
    Core.mersenneTwister = new MersenneTwister();
    Core.random = function() { return Core.mersenneTwister.random_long(); }
}

Core.getDistance = function(a, b) {
    let distanceX = b.x - a.x;
    let distanceY = b.y - a.y;
    return Math.sqrt(distanceX*distanceX + distanceY*distanceY);
}

Core.getCookieByName = function(name) {
	var cookieValue = null;
	if (document.cookie && document.cookie != '') {
		var cookies = document.cookie.split(';');
		for (var i = 0; i < cookies.length; i++) {
			var cookie = cookies[i];
            if(window.jQuery) { cookie = jQuery.trim(cookie); }
            else if(''.trim) { cookie = cookie.trim(); }
			// Does this cookie string begin with the name we want?
			if (cookie.substring(0, name.length + 1) == (name + '=')) {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
}

Core.parseDate = function(date) {
    var result;
    if(isNaN(date)) { result = new Date(date); }
    else { result = new Date(date * 1000); }
    return result != 'Invalid Date' ? result : undefined;
}

Core.iterateObject = function(object, func) {
    for(var property in object) {
        if(object.hasOwnProperty(property)) {
            if(object[property] instanceof Array) {
                object[property] = object[property].map(function(item) {
                    return Core.iterateObject(item, func);
                });
            } else if(object[property] instanceof Object) {
                object[property] = Core.iterateObject(object[property], func);
            } else {
                object[property] = func(object[property]);
            }
        }
    }
    return object;
}

Core.getPeriodStringWithFormat = function(seconds, format) {
    return Math.floor(seconds/86400) + 'd '
        + Math.floor(seconds%86400/3600) + 'h '
        + Math.floor(seconds%3600/60) + 'm '
        + Math.floor(seconds%60) + 's';
}

Core.getDateStringWithFormat = function(timestamp, format) {
    function pad(num, size) {
        var s = num + "";
        s = s.slice(-size);
        while(s.length < size) { s = "0" + s; }
        return s;
    }
    var dayStringList = ['日', '一', '二', '三', '四', '五', '六'];
    var dateObject = undefined;
    if(1000000000000 > timestamp) { dateObject = new Date(timestamp*1000); }
    else { dateObject = new Date(timestamp); }
    var matchYear = format.match(/Y/g);
    if(matchYear) { format = format.replace(/[Y]+/, pad(dateObject.getFullYear(), matchYear.length)); }
    var matchMonth = format.match(/M/g);
    if(matchMonth) { format = format.replace(/[M]+/, pad(dateObject.getMonth() + 1, matchMonth.length)); }
    var matchDate = format.match(/D/g);
    if(matchDate) { format = format.replace(/[D]+/, pad(dateObject.getDate(), matchDate.length)); }
    if(!!format.match(/d/g)) { format = format.replace(/[d]+/, dayStringList[dateObject.getDay()]); }
    var matchHours = format.match(/h/g);
    if(matchHours) { format = format.replace(/[h]+/, pad(dateObject.getHours(), matchHours.length)); }
    var matchMinutes = format.match(/m/g);
    if(matchMinutes) { format = format.replace(/[m]+/, pad(dateObject.getMinutes(), matchMinutes.length)); }
    var matchSeconds = format.match(/s/g);
    if(matchSeconds) { format = format.replace(/[s]+/, pad(dateObject.getSeconds(), matchSeconds.length)); }
    return format;
}

Core.newUuid = function() {
    var regexp = new RegExp('[xy]', 'g');
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(regexp, function(c) {
        var r = Core.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

Core.reverseDigitString = function(string) { return string.split('').reverse().join(''); }
Core.addNumberComma = function(number) {
    let intString = Math.floor(number) + '';
    let reversedWithComma = Core.reverseDigitString(intString).split(/(\d{3})/).filter(n => n).join(',');
    let result = Core.reverseDigitString(reversedWithComma);
    let floatPart = (number + '').replace(/\d*\.?/, '');
    if(floatPart) { result += '.' + floatPart; }
    return result;
}

Core.getUrlSearches = function() {
    var result = {};
    var searches = window.location.search;
    searches = searches.slice(1).split('&');
    searches.map(function(search) {
        var pair = search.split('=');
        result[pair[0]] = pair[1];
    }, this);
    return result;
}

Core.nodeListToArray = function(nodeList) {
    var result = [];
    // iterate backwards ensuring that length is an UInt32
    for (var i = nodeList.length >>> 0; i--;) { result[i] = nodeList[i]; }
    return result;
}

Core.encryptString = function(string, opt_salt) {
    var salt = opt_salt || '54883155';
    var result = string;
    if(NodeCrypto.createCipher) {
        var cipher = NodeCrypto.createCipher('aes192', salt);
        var encrypted = cipher.update(string, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        result = encrypted;
    }
    return result;
}

Core.decryptString = function(string, opt_salt) {
    var salt = opt_salt || '54883155';
    var result = undefined;
    try {
        var decipher = NodeCrypto.createDecipher('aes192', salt);
        var decrypted = decipher.update(string, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        result = decrypted;
    } catch(e) { }
    return result;
}

module.exports = Core;
window.Core = Core;
