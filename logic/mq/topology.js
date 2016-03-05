'use strict';

module.exports = {
	queues: [{
		name: 'sender-queue',
		subscribe: true,
		durable: true
	}],
	exchanges: [{
		name: 'sender',
		type: 'direct',
		persistent: true,
		durable: true
	}],
	bindings: [{
		exchange: 'sender',
		target: 'sender-queue',
		keys: ['sender.sendMail']
	}]
};
