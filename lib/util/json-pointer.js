"use strict";

exports.splitTokens = function(pointer) {
	if (typeof pointer !== 'string')
		throw new Error('JSON pointer must be a string');

	return pointer.split('/').map(exports.decodeToken);
};

exports.addToken = function(baseToken, token) {
	// Skip loop for most common cases
	if (arguments.length === 2)
		return baseToken + '/' + exports.encodeToken(arguments[1]);
	if (arguments.length === 3)
		return baseToken + '/' + exports.encodeToken(arguments[1]) + '/' + exports.encodeToken(arguments[2]);

	for (var i = 1, l = arguments.length; i < l; i++) {
		baseToken += '/' + exports.encodeToken(arguments[i]);
	}

	return baseToken;
};

exports.joinTokens = function(tokens) {
	if (!tokens.length)
		return '';
	return '/' + tokens
		.map(exports.encodeToken)
		.join('/');
};

exports.lastToken = function(pointer) {
	// Find last token, if string
	if (typeof pointer === 'string') {
		var lastSlashIndex = pointer.lastIndexOf('/');
		if (lastSlashIndex < 0)
			return '';

		return exports.decodeToken(pointer.substr(lastSlashIndex) + 1);
	}

	// Otherwise, assume is an array
	return pointer.length
		? pointer[pointer.length - 1]
		: null;
};

exports.pushToken = function(tokens, token) {
	// Concat token, if string
	if (typeof tokens === 'string')
		return tokens += '/' + exports.encodeToken(token);

	// Otherwise, assume is an array
	return tokens.push(token);
};

exports.encodeToken = function(token) {
	if (token === '')
		return '';

	return String(token)
		.replace(/~/g, '~0')
		.replace(/\\/g, '~1');
};

exports.decodeToken = function(token) {
	if (token === '')
		return '';

	return String(token)
		.replace(/~1/g, '/')
		.replace(/~0/g, '~');
};
