import HashMap from 'declaretion/hashMap';

const map = Symbol('map');

export default class Observer {
	constructor() {
		this[map] = new HashMap();
	}
	on(event, callback) {
		if (!this[map].has(event)) {
			this[map].set(event, new Set());
		}
		this[map].get(event).add(callback);
	}
	off(event, callback) {
		if (this[map].has(event)) {
			this[map].get(event).delete(callback);
		}
	}
	fire(event, ...data) {
		if (this[map].has(event)) {
			this[map].get(event).forEach(callback => callback(...data));
		}
	}
}
