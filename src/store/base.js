import Observer from 'declaretion/observer';
import Dispatcher from 'service/dispatcher';

const dispatcherSymbol = Symbol('private:store:dispatcher');
const stateSymbol = Symbol.for('private:store:state');
const emitChangeSymbol = Symbol.for('private:store:emitChange');
const handlersSymbol = Symbol.for('private:store:handlers');

export default class BaseStore {
	constructor() {
		this[dispatcherSymbol] = new Observer();
		this[stateSymbol] = {};
		this.initHandlers();
	}
	[emitChangeSymbol] = () => {
		this[dispatcherSymbol].fire('change', this[stateSymbol]);
	}
	[handlersSymbol] = []

	addListener(callback) {
		this[dispatcherSymbol].on('change', callback);
	}

	getState() {
		return this[stateSymbol];
	}
	initHandlers() {
		Object.keys(this[handlersSymbol]).forEach(event =>
			Dispatcher.on(event, this[handlersSymbol][event].bind(this)));
	}
}
