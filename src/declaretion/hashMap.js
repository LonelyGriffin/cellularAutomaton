const mapSymbol = Symbol('map');

export default class HashMap {
	constructor(KVs) {
		this[mapSymbol] = new Map();

		if (KVs && KVs.forEach) {
			KVs.forEach(kv => this.set(kv[0], kv[1]));
		}
	}
	set(key, value) {
		this[mapSymbol].set(JSON.stringify(key), value);
	}
	get(key) {
		return this[mapSymbol].get(JSON.stringify(key));
	}
	delete(key) {
		this[mapSymbol].delete(JSON.stringify(key));
	}

	clear() {
		this[mapSymbol].clear();
	}

	forEach(callback) {
		this[mapSymbol].forEach((v, k, map) => callback(v, JSON.parse(k), map));
	}
	has(key) {
		return this[mapSymbol].has(JSON.stringify(key));
	}
}

