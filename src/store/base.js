import Observer from 'declaretion/observer';

const dispatcherSymbol = Symbol.for('private:store:dispatcher');
const stateSymbol = Symbol.for('private:store:state');
const emitChange = Symbol.for('private:store:emitChange');

export default class BaseStore {
	constructor() {
		this[dispatcherSymbol] = new Observer();
		this[stateSymbol] = {};
	}
	[emitChange] = () => {
		this[dispatcherSymbol].fire('change', this[stateSymbol]);
	}

	addListener(callback) {
		this[dispatcherSymbol].on('change', callback);
	}

	getState() {
		return this[stateSymbol];
	}
}
